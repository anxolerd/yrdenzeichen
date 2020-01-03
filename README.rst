=============
Yrden Zeichen
=============

Yrden zeichen is a prototype of kubernetes admission controller. The idea is to
create highly-customizable and configurable admission webhook for kubernetes
which will keep bad deployments out of cluster.

Usage
=====

Deployment
----------

Kubernetes
~~~~~~~~~~

1. Create namespace for yrdenzeichen

   .. code:: console

      $ kubectl create namespace yrdenzeichen
      namespace/yrdenzeichen created

2. Generate ssl certificate and key for yrdenzeichen. For example, the `Manage
   TLS Certificates in a Cluster
   <https://kubernetes.io/docs/tasks/tls/managing-tls-in-a-cluster/>`_ guide
   can be followed.

3. As soon as you have both key (``server.key.pem``) and certificate
   (``server.crt.pem``) generate a Kubernetes secret with those:

   .. code:: console

    $ kubectl -n yrdenzeichen create secret generic yrdenzeichen-certs \
        --from-file server.crt.pem \
        --from-file server.key.pem
    secret/yrdenzeichen-certs created

4. Create deployment manifest for yrdenzeichen

   .. code:: yaml

      ---
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: yrdenzeichen
        namespace: yrdenzeichen
        labels:
          app.kubernetes.io/name: admission-webhook
          app.kubernetes.io/instance: yrdenzeichen
      spec:
        replicas: 3
        selector:
          matchLabels:
            app.kubernetes.io/name: admission-webhook
            app.kubernetes.io/instance: yrdenzeichen
        template:
          metadata:
            labels:
              app.kubernetes.io/name: admission-webhook
              app.kubernetes.io/instance: yrdenzeichen
          spec:
            containers:
            - name: yrdenzeichen
              image: anxolerd/yrden:20200103.1657
              imagePullPolicy: IfNotPresent
              ports:
              - containerPort: 3000
                name: http
              - containerPort: 3001
                name: https
              env:
              - name: HTTP_PORT
                value: '3000'
              - name: HTTPS_PORT
                value: '3001'
              - name: METRICS_PORT
                value: '9090'
              - name: LOG_JSON
                value: 'true'
              volumeMounts:
              - name: yrdenzeichen-certs
                mountPath: '/etc/ssl/'
                readOnly: true
              resources:
                requests:
                  cpu: 100m
                  memory: 32Mi
                limits:
                  cpu: 200m
                  memory: 64Mi
            volumes:
            - name: yrdenzeichen-certs
              secret:
                secretName: yrdenzeichen-certs
      ---
      apiVersion: v1
      kind: Service
      metadata:
        name: webhook
        namespace: yrdenzeichen
      spec:
        ports:
          - name: https
            port: 443
            targetPort: https
          - name: http
            port: 80
            targetPort: http
        selector:
          app.kubernetes.io/name: admission-webhook
          app.kubernetes.io/instance: yrdenzeichen

5. Apply yrdenzeichen deployment manifest created in previous step

   .. code:: console

      $ kubectl apply -f deployment.yaml
      deployment/yrdenzeichen created
      service/webhook created

6. Create admission webhook registration manifest

   .. code:: yaml

      ---
      apiVersion: admissionregistration.k8s.io/v1beta1
      kind: ValidatingWebhookConfiguration
      metadata:
        name: yrdenzeichen
      webhooks:
      - name: webhook.yrdenzeichen.svc.cluster.local
        clientConfig:
          caBundle: <certificate authority root certificate in base64>
          service:
            name: webhook
            namespace: yrdenzeichen
            port: 443
        # Enable only on selected namespaces
        namespaceSelector:
          matchExpressions:
          - key: io.github.anxolerd.yrdenzeichen/validation
            operator: In
            values: ["enabled"]
        rules:
        - operations: ["CREATE", "UPDATE"]
          apiGroups: ["apps"]
          apiVersions: ["v1"]
          resources: ["deployments", "replicasets", "statefulsets"]
          scope: "Namespaced"
        - operations: ["CREATE", "UPDATE"]
          apiGroups: [""]
          apiVersions: ["v1"]
          resources: ["pods"]
          scope: "Namespaced"
        failurePolicy: Fail # Other possible value is `Ignore`

7. Apply admission webhook registration created in previous step

   .. code:: console

      $ kubectl apply -f webhook.yaml
      validatingwebhookconfiguration.admissionregistration.k8s.io/yrdenzeichen created

8. Label namespaces you want to validate

   .. code:: console

      $ kubectl label namespace your-namespace io.github.anxolerd.yrdenzeichen/validation=enabled

Configuration
-------------

Enabled validators and groups are configured via ``app/config.js`` file.

Development
===========

Validators
----------

Validators should follow the following API::

    validator :: KubernetesObject -> {valid: bool, errors: string[]}


Name
====

    Yrden is a simple magical sign used by witchers. When inscribed on a solid
    surface, it blocks the monsters from getting closer, scaring them off.
    [...]
    In "The Witcher", a short story in The Last Wish, Geralt uses Yrden to
    ensure his own safety inside the sarcophagus.

    -- https://witcher.fandom.com/wiki/Yrden

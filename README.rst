=============
Yrden Zeichen
=============

Yrden zeichen is a prototype of kubernetes admission controller. The idea is to
create highly-customizable and configurable admission webhook for kubernetes
which will keep bad deployments out of cluster.

Validators
==========

Validators should follow the follownig API::

    validator :: KubernetesObject -> {valid: bool, errors: string[]}


Name
====

    Yrden is a simple magical sign used by witchers. When inscribed on a solid
    surface, it blocks the monsters from getting closer, scaring them off.
    [...]
    In "The Witcher", a short story in The Last Wish, Geralt uses Yrden to
    ensure his own safety inside the sarcophagus. 

    -- https://witcher.fandom.com/wiki/Yrden

Handle the Session
==================

[←](../index.md)

Documentation
-------------

###Usage

You can use the [service](../dependency-injection.md) `danf:http.sessionHandler` to easily manage the session. In most cases you will just need to use the methods `get` and `set` to set and retrieve values in the session. This latter is started and saved for you.

###API

**Get a value in the session.**

`.get(key)`

* *key (string)*: The key.

**Set a value in the session.**

`.set(key, value)`

* *key (string)*: The key.
* *value (mixed)*: The value.

**Regenerate the session.**

`.regenerate()`

**Destroy the session.**

`.destroy()`

**Reload the session.**

`.reload()`

**Save the session.**

`.save()`

**Update the max age of the session.**

`.touch()`

Navigation
----------

[Use Cookies](cookies.md)

[←](../index.md)
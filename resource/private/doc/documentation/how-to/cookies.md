How to Use Cookies
==================

[←](../index.md)

Usage
-----

You can use the [service](../dependency-injection.md) `danf:http.cookiesRegistry` to easily manage cookies on both client-side and server-side.

API
---

**Get a cookie.**

` .get(key) `

* *key (string)*: The key.
* *value (mixed)*: The value.

**Set a cookie.**

`.set(key, value, expiresAt, path, domain, isSecude, isHttpOnly)`

* *key (string)*: The key.
* *value (string)*: The value.
* *expiresAt (date|null)*: The date of expiration.
* *path (string|null)*: The optional path.
* *domain (string|null)*: The optional domain.
* *isSecure (boolean|null)*: Whether or not this is a secure cookie.
* *isHttpOnly (boolean|null)*: Whether or not this is a http only cookie.

**Unset a cookie.**

`.unset(key, path, domain)`

* *key (string)*: The key.
* *path (string|null)*: The optional path.
* *domain (string|null)*: The optional domain.

Navigation
----------

[Handle the Session](session.md)

[←](../index.md)
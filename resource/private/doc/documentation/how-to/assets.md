Handle Assets
=============

[←](../index.md)

Assets are the files (js, css, pdf, ...) that are accessible to an HTTP client (like a browser for example).

Use assets on the client side
-----------------------------

To access one of these assets with an HTTP request use:

```http://{domain}/-/{package-name}/{path-relative-to-public-directory}```

* *{domain}*: Your domain.
* *{package-name}*: The name defined in the file `package.json` of the module containing the asset file without starting "danf-".
* *{path-relative-to-public-directory}*: The path of the file relative to the directory `/resource/public`.

**Example for a npm module which would be called `danf-gnodi-form`:**

```http://www.my-domain/-/gnodi-form/css/input.css```

> The package file can be the one of the current application or one of a dependency danf module.

Add a custom assets directory
-----------------------------

Danf provides a simple way to customize these accessible files and directories (if you don't like `/resource/public` for instance).

```javascript
// config/server/config/assets.js

'use strict';

module.exports = {
    '/assets/css': '/custom-asset-directory/css'
    '!/assets/css/less': '/custom-asset-directory/css/less'
};
```

* `'/assets/css': __dirname + '/custom-asset-directory/css'` means that the files in the defined directory will be accessible.
* `'!/assets/css/less': __dirname + '/custom-asset-directory/css/less' means that the files in the defined directory will not be accessible.

The file `.../custom-asset-directory/css/style.css` will be accessible using the path `/assets/css/style.css`.
The file `.../custom-asset-directory/css/less/style.less` will not be accessible.

The rules can apply on both directories and files.

Here is a description of the applied algorithm:

*1. If the asked file is matched by a forbidden rule, the file will not be served (404).
*2. Else if the asked file is matched by an allowed rule, the file will be served if it exists (otherwise 404).
*3. Else (the asked file is not matched by any rule), the file will not be served (404) (anyway it cannot be mapped to a path).

[←](../index.md)
<%= repository.name %>
======================

<%= app.description %>

Use as a danf module
--------------------

Add the module to your `package.json`:
```json
{
    ...
    "dependencies": {
        ...,
        "<%= repository.name %>": "*"
    },
    ...
}
```

Then, install this new dependency:
```sh
$ npm install
```

Use as an application
---------------------

Start the server with the command:
```sh
$ node app-dev
```

You should be able to test the application at `http://localhost:3080`.

> Use `app-prod` to start the server in prod environment.

Execute tests
-------------

```sh
$ make test
```
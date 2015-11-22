Installation
============

[←](index.md)

### Create a proto application

The better way to create a new application/danf module (in Danf an application is a **danf module** and conversely) is to let [Yeoman](http://yeoman.io/) do it for you!

First, install Yeoman:
```sh
$ npm install -g yo
```

Then, install the specific generator for Danf applications:
```sh
$ npm install -g yo generator-danf
```

Finally, create an application using:
```sh
$ yo danf
```

### Start the server

After creating your application, you should be able to start the server in this way:
```sh
$ node app-dev
```

A welcome message is waiting for you at `http://localhost:3080`!

> Use `app-prod` to start the server in prod environment (less debugging, more performances!).

### Run the tests

You can run the tests of your application thanks to:
```sh
$ make test
```

[←](index.md)
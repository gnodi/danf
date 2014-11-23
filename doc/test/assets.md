Handle Assets
=============

[←](index.md)

Application
-----------

Assets are the files (js, css, pdf, ...) that are accessible to an HTTP client (like a browser for example).
Danf provides a simple way to define these accessible files and directories. It is an important section because it could lead to critical security issues like exposing private content to users.

There is nothing to do here because the proto application do it for you. Just follow the little comments on the top of each described files to place them in the correct directories.

However, it would certainly be a good idea to have a quick look at the corresponding documentation accessible below in the navigation part.

Just let's define the files containing the scores of the questions for each framework. These files are in the directory `resources/private` because clients must not have direct access to it. Like said above, the proto app already defines the config to protect this directory.

 * `resources/private/question-scores/choice.csv`
```javascript
danf:5
require:5
meteor:5
angular:5
jquery:5
mootools:1
```

 * `resources/private/question-scores/color.csv`
```javascript
danf:0
require:6
meteor:5
angular:9
jquery:8
mootools:1
```

 * `resources/private/question-scores/life.csv`
```javascript
danf:10
require:0
meteor:0
angular:0
jquery:0
mootools:1
```

 * `resources/private/question-scores/animals.csv`
```javascript
danf:10
require:7
meteor:2
angular:4
jquery:5
mootools:1
```

 * `resources/private/question-scores/nanimals.csv`
```javascript
danf:0
require:3
meteor:8
angular:6
jquery:5
mootools:1
```

Navigation
----------

[Previous section](events.md) |
 [Next section](ajax-app.md)

[Documentation](../use/assets.md)

[←](index.md)
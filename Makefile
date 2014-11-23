MOCHA_OPTS = --check-leaks
REPORTER = dot

check: test

test: test-utils test-manipulation test-configuration test-object test-dependency-injection test-file-system test-event test-http test-rendering test-test test-app

test-utils:
	# Utils
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		$(MOCHA_OPTS) \
		test/init.js test/utils.js

test-manipulation:
	# Manipulation
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/manipulation/*

test-configuration:
	# Congiguration
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/configuration/*

test-object:
	# Object
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/object/*

test-dependency-injection:
	# Dependency Injection
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/dependency-injection/*

test-file-system:
	# File System
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/file-system/*

test-event:
	# Event
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/event/*

test-http:
	# HTTP
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/http/*

test-rendering:
	# Rendering
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/rendering/*

test-test:
	# Test
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--bail \
		$(MOCHA_OPTS) \
		test/test/*

test-app:
	# App
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		$(MOCHA_OPTS) \
		test/app.js
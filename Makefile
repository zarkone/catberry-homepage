
SRC = lib/**.js \
	catberry_modules/**.js

TESTS = test/lib/*

npm-test: lint test

lint:
	./node_modules/.bin/jshint ./ && ./node_modules/.bin/jscs ./

test:
	@echo "Running tests..."
	@NODE_ENV=test ./node_modules/.bin/mocha \
		$(TESTS) \
		--bail

test-cov:
	@echo "Getting coverage report..."
	@NODE_ENV=test node ./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--harmony-generators \
		-- -u exports \
		$(TESTS) \
		--bail

config:
	cp -nR ./configs_example/ ./configs/
	echo "Configuration initialized in ./configs"

release:
	./node_modules/.bin/gulp release && node ./build.js release

clean:
	rm -rf coverage
	./node_modules/.bin/gulp clean

.PHONY: test
npm-test: lint

lint:
	./node_modules/.bin/jshint ./ && ./node_modules/.bin/jscs ./

config:
	cp -nR ./configs_example/ ./configs/
	echo "Configuration initialized in ./configs"

release:
	./node_modules/.bin/gulp release && node ./build.js release

clean:
	rm -rf coverage
	./node_modules/.bin/gulp clean
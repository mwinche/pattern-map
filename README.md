pattern-map
===========

[![Build Status](https://secure.travis-ci.org/mwinche/pattern-map.png?branch=master)](http://travis-ci.org/mwinche/pattern-map)

	npm install pattern-map

This module allows for matching patterns and extracting matches from those patterns. Once the matches are extracted they then can be applied to other patterns to resolve them and create new strings.

Sample usage:

	var patternMap = require('pattern-map');
	
	var urlPattern = patternMap('/bundles/{widget}.js');
	var filePattern = patternMap('src/{widget}/index.js');
	
	var matches = urlPattern.match('/bundles/sortableList.js');
	// { 'widget' : 'sortableList' }
	
	var fileLocation = filePattern.resolve(matches);
	// "src/sortableList/index.js"

API
---

### patternMap(patternString) ###

Returns a new pattern. Uses the `patternString` to establish how it will match. All pattern methods are immutable.

Example:

	var pattern = patternMap('/{path}/{version}/{module}/{theme}.css');

### pattern.tokens([ unique ]) ###

Returns all tokens in the order they are defined in the pattern. If `unique` is truthy, it will only return unique tokens.

Example:

	patternMap('{dir}/{subDir}/{dir}/{target}.json').tokens();
	// ['dir', 'subDir', 'dir', 'target']
	
	patternMap('{dir}/{subDir}/{dir}/{target}.json').tokens(true);
	// ['dir', 'subDir', 'target']

### pattern.match(string) ###

Compares `string` against the pattern. If it matches the pattern returns an object such that it has a key for each value returned by `tokens()` which has a value extracted from the corresponing position of `string`. Returns `undefined` otherwise.

Example:

	patternMap('/modules/{app}.js?build={version}').match('/modules/chat.js?build=0.1.3');
	// { 'app' : 'chat', 'version' : '0.1.3' }
	
	patternMap('/modules/{app}.js?build={version}').match('/a/different/path');
	// undefined

### pattern.resolve(matches) ###

Replaces tokens with corresponding values from the `matches` object.

Example:

	patternMap('src/{widget}/styles/{theme}.less').resolve({ 'widget' : 'navigation', 'theme' : 'highConstrast' });
	// "src/navigation/styles/highContrast.less"

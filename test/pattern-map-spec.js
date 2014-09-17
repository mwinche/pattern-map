"use strict";

var patternMap = require('../lib/pattern-map');

describe('patternMap',function(){
	it('should return a different instance', function(){
		expect(patternMap('/foo')).not.toBe(patternMap('/foo'));
	});
});

describe('pattern', function(){
	it('should have a reference to the string', function(){
		expect(patternMap('/foo')._string).toBe('/foo');
	});

	it('should be immutable', function(){
		expect(Object.isFrozen(patternMap('/foo'))).toBe(true);
	});

	describe('token method', function(){
		it('should return all the tokens from a pattern in order', function(){
			//Not using toEqual here becuase it fails with frozen objects
			var tokens = patternMap('/{dir}/{file}.{extension}').tokens();

			expect(tokens.constructor).toBe(Array);
			expect(tokens.length).toBe(3);
			expect(tokens[0]).toBe('dir');
			expect(tokens[1]).toBe('file');
			expect(tokens[2]).toBe('extension');
		});

		it('should return a frozen array', function(){
			expect(Object.isFrozen(patternMap('/{dir}/{file}.{extension}').tokens())).toBe(true);
		});

		it('should allow duplicates', function(){
			expect(patternMap('/{one}/{one}').tokens().length).toBe(2);
			expect(patternMap('/{one}/{one}').tokens()[0]).toBe('one');
			expect(patternMap('/{one}/{one}').tokens()[1]).toBe('one');
		});

		it('should allow to retrieve only unique tokens', function(){
			expect(patternMap('/{one}/{two}/{one}').tokens(true).length).toBe(2);
			expect(patternMap('/{one}/{two}/{one}').tokens(true)[0]).toBe('one');
			expect(patternMap('/{one}/{two}/{one}').tokens(true)[1]).toBe('two');
		});
	});

	describe('match method', function(){
		it('should find all matches', function(){
			expect(patternMap('src/{dir}/{file}.js').match('src/feature1/controllers.js')).toEqual({
				'dir': 'feature1',
				'file': 'controllers'
			});
		});

		it('should return undefined if there are no matches', function(){
			expect(patternMap('lib/{file}.json').match('src/app.js')).not.toBeDefined();
		});

		it('should allow duplicates', function(){
			expect(patternMap('src/{dir}/sub/{dir}/{file}.css').match('src/foo/sub/foo/colors.css')).toEqual({
				'dir': 'foo',
				'file': 'colors'
			});
		});

		it('should allow duplicates, but not match if the duplicates don\'t match', function(){
			expect(patternMap('src/{dir}/sub/{dir}/{file}.css').match('src/foo/sub/bar/colors.css')).not.toBeDefined();
		});

		it('should not match slashes', function(){
			expect(patternMap('/{dir}/index.html').match('/app/user/index.html')).not.toBeDefined();
		});
	});

	describe('resolve method', function(){
		it('should replace tokens in the original string', function(){
			expect(patternMap('My name is {name}, and I am {age} years old.').resolve({
				'name' : 'Edward Elric',
				'age' : '17'
			})).toBe('My name is Edward Elric, and I am 17 years old.');
		});

		it('should replace duplicates', function(){
			expect(patternMap('{module}/{module}Spec.js').resolve({'module': 'login'})).toBe('login/loginSpec.js');
		});
	});
});

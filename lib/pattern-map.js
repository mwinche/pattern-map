"use strict";

var PATTERN_REGEX = /{\w+}/g;

var extractTokens = function(string){
	var matchData = string.match(PATTERN_REGEX) || [];

	return matchData.map(function(item){
		return item.substr(1, item.length - 2);
	});
};

function extractRegex(string) {
	//Escape slashes
	string = string.replace(/\//g, "\\/");

	//Set up matching groups
	string = string.replace(/{\w+}/g, "([^/]+)");

	return new RegExp("^" + string + "$");
}

function Pattern(patternString){
	this._string = patternString;
	this._pattern = extractRegex(patternString);
	this._tokens = Object.freeze(extractTokens(patternString));

	this._uniqueTokens = Object.freeze(this._tokens.reduce(function(tokens, token){
		if(tokens.indexOf(token) < 0){
			tokens.push(token);
		}

		return tokens;
	}, []));

	this._regexes = this.tokens().map(function(token){
		return new RegExp('\\{' + token + '\\}', 'g');
	});
}

Pattern.prototype.tokens = function tokens(unique){
	return unique ? this._uniqueTokens : this._tokens;
};

Pattern.prototype.match = function match(string){
	var matchData = this._pattern.exec(string);

	if(!matchData){
		return undefined;
	}

	return this.tokens().reduce(function(matches, token, index){
		//In case we decided this wasn't a match in an earlier iteration of the loop
		if(matches === undefined){
			return undefined;
		}

		//If we hit a duplicate but the duplicate is trying to set a different value, we don't have a match
		if(matches[token] !== undefined && matches[token] !== matchData[index + 1]){
			return undefined;
		}

		matches[token] = matchData[index + 1];

		return matches;
	}, {});
};

Pattern.prototype.resolve = function resolve(matches){
	var regexes = this._regexes;

	return this.tokens(true).reduce(function(string, token, index){
		return string.replace(regexes[index], matches[token]);
	}, this._string);
};

module.exports = function(patternString){
	return Object.freeze(new Pattern(patternString));
};

const assert = require('assert');
const driverMethods = require('./driverMethods');
const deasync = require('deasync');

function deasyncPromise(promise) {
	let err;
	let res;
	let done = false;

	promise.then(
		function(r) {
			res = r;
			done = true;
		},
		function(e) {
			err = e;
			done = true;
		}
	);

	deasync.loopWhile(function() {
		return !done;
	});

	if (err) throw err;

	return res;
}

function wrapForRepl(driver) {
	return driverMethods.reduce(function constructMethod(wrappedDriver, methodName) {
		wrappedDriver[methodName] = function(...args) {
			driver = driver[methodName].apply(driver, args);
			return deasyncPromise(driver);
		};
		return wrappedDriver;
	}, {});
}

function wrapForDebug(driver) {
	return driverMethods.reduce(function constructMethod(wrappedDriver, methodName) {
		wrappedDriver[methodName] = function(...args) {
			const callback = (args.length > 0 && typeof args[args.length - 1] === 'function' ? args.pop() : function() {});
			let result;

			driver = driver[methodName].apply(driver, args);

			result = deasyncPromise(driver);
			callback(result);
		};
		return wrappedDriver;
	}, {});
}

function wrapDefault(driver) {
	return driverMethods.reduce(function constructMethod(wrappedDriver, methodName) {
		wrappedDriver[methodName] = function(...args) {
			const callback = (args.length > 0 && typeof args[args.length - 1] === 'function' ? args.pop() : function() {});

			driver = driver[methodName].apply(driver, args);
			driver.then(callback);
		};
		return wrappedDriver;
	}, {});
}

module.exports = function wrap(driver, options) {
	assert.notEqual(typeof driver, 'undefined', 'missing driver to wrap');
	options = options || {};

	switch (options.mode) {
		case 'repl':
			return wrapForRepl(driver);
		case 'debug':
			return wrapForDebug(driver);
		default:
			return wrapDefault(driver);
	}
};

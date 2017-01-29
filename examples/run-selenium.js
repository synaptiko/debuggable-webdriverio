#!/usr/bin/env node
let chromedriver = require('chromedriver');
let selenium = require('selenium-standalone');
let seleniumOptions = {
	version: '2.53.1',
	drivers: {
		chrome: {}
	}
};

// selenium.install(seleniumOptions, function (error, result) {
// 	console.log(error, result);
// });

selenium.start({
	drivers: seleniumOptions.drivers,
	version: seleniumOptions.version,
	seleniumArgs: {},
	spawnCb: function (seleniumProcess) {
		function cleanup(errorCode) {
			process.nextTick(function () {
				seleniumProcess.kill();
				console.log('Kill invoked');
				process.exit(errorCode);
			});
		}

		process.on('SIGINT', cleanup);
		process.on('SIGTERM', cleanup);
	},
	spawnOptions: {
		stdio: 'pipe'
	}
}, function(error, result) {
	console.log('Selenium running');
});

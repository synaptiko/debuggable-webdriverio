#!/usr/bin/env node
const webdriverio = require('webdriverio');
const wrap = require('./index');

let driver = webdriverio.remote({
	logLevel: 'silent',
	connectionRetryTimeout: 300000,
	connectionRetryCount: 2,
	host: 'localhost',
	port: 4444,
	desiredCapabilities: {
		browserName: 'chrome'
	}
});

debugger;
driver = wrap(driver.init(), { mode: 'repl' });
driver.url('http://webdriver.io/api/action/click.html');
console.log('Title was:', driver.getTitle());
driver.moveToObject('h3#Parameters', 0, 0);
driver.click('a[title=Parameters]');
driver.end();

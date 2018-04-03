var engine = require('store/src/store-engine')
var storages = [
	require('store/storages/localStorage'),
	require('store/storages/cookieStorage')
]
var plugins = [
	require('store/plugins/defaults'),
	require('store/plugins/expire')
]

var store = engine.createStore(storages, plugins);
module.exports = store;

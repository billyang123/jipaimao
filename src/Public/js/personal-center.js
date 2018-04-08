import $ from 'jquery';
import table from 'ui/table.js';
import {ajax, getRates} from 'core/utils.js';
import countDown from 'ui/countDown.js';
import distpicker from 'ui/distpicker.js';

import {centerMenuList} from 'config';

import subTmp from './tpl/center/sub.hbs';

window.jQuery = $;




// var table = require('ui/table.js');
// var utils = require('core/utils.js');
// var Handlebars = require('core/handlebars.js');
// var countDown = require('ui/countDown.js');
// var distpicker = require('ui/distpicker');
// var template = Handlebars.template
// var api = utils.api;
// $('[data-countdown]').countdown();
// $('.js-table').table();

function _indexPage() {
	this.$container = $('#J_personal-center');
	this.init();
	//this.getInitData('centerIndex');
	//this._bind();
}
_indexPage.prototype = {
	initSub() {
		const subHtmls = subTmp({
			"exchangeRate": this.curRate,
			"userInfo": {
				"balance": 9989,
				"account": "1044567743@qq.com",
				"bond": 4566,
				"integral": 665
			},
			"menuList": centerMenuList
		})
		$('#PersonalCenterSub').html(subHtmls)
	},
	init() {
		getRates((rates) => {
			this.curRate = rates['JPY_CNY'];
			this.initSub();
		})
	},
	getInitData: function(type) {
		var _this = this;
		utils.ajax({
			url: utils.getApi(api[type]),
			dataType: 'json',
			success: function(res) {
				console.log(res)
				var data = res.data;
				for( var key in data) {
					var id = '#JT-'+type+'-' + key;
					var tempDode = $(id);
					if (tempDode.length == 0) continue;
					var temp = tempDode.html();
					template(temp, data[key])
					var htmlNode = $(template(temp, data[key]));
					tempDode.after(htmlNode)
				}
			}
		})
	},
	getList:function(type) {
		var _this = this;
		utils.ajax({
			url: utils.getApi(api[type]),
			dataType: 'json',
			success: function(res) {
				console.log(res)
				var data = res.data;

			}
		})
	},
	_bind:function() {
		this.$container.on('click', '.js-pcSubTo', function(e) {
			console.log(e.target)
		})
	}
};
new _indexPage();

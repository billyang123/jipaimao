var $ = require('jquery');

var detailPicShow = require('ui/detailPicShow.js');
import countDown from 'ui/countDown.js'
import {ajax, URLPARAM, getRates} from 'core/utils.js';
import {priceInc} from 'config'
import infoBoxTmp from './tpl/detail/infoBox.hbs';
import detailPicTmp from './tpl/detail/detailPic.hbs';

import calculation from 'ui/calculation.js';
import loading from 'ui/loading.js'
var remodal = require('ui/remodal.js');

var Loading = new loading('#itemDetail', {style:'width: 100%;height: 100px;'});
var Loading_info = new loading('#detailMain', {style:'width: 100%;height: 100px;'});
var itemDetail = function(){
	console.log(URLPARAM);
	this.itemId = URLPARAM.id || 'r235736015';
	console.log('itemId',this.itemId);
	this.init();
}
itemDetail.prototype = {
	init() {
		this.getDetail();
	},
	getPriceInc(price) {
		let inc = 0;
		for (var p in priceInc) {
			const curpc = priceInc[p];
			if (curpc[1] < 0) {
				inc = p;
				break;
			} else if (price > curpcp[0] && price > curpcp[1]) {
				inc = p;
				break;
			} else {
				continue;
			}
		}
		return inc;
	},
	getDetail() {
		Loading.show()
		Loading_info.show()
		ajax({
				url: '/spider/api/',
				data: {
					op: '001008',
					item: this.itemId
				},
				type: 'post',
				complete() {
					Loading.hide()
					Loading_info.hide()
				},
				success: (res) => {
						res.priceInc = priceInc;
						if (!res.data) res.data = {};
						if ($.isEmptyObject(res.data)) {
							return alert('该商品已下架！')
						}
						const specifics = res.data.specifics || [];
						specifics.forEach((item) => {
							if(item.title == '開始日時') {
								const _times = item.description.match(/(\d{4}\.\d{2}\.\d{2}).+(\d{2}\:\d{2})/);
								res.data.startTime = `${_times[1].replace(/\./g, '-')} ${_times[2]}`;
							}
							if(item.title == '終了日時') {
								const _times = item.description.match(/(\d{4}\.\d{2}\.\d{2}).+(\d{2}\:\d{2})/);
								res.data.endTime = `${_times[1].replace(/\./g, '-')} ${_times[2]}`;

								//res.data.countdown = (new Date(res.data.endTime)).getTime() - Date.now();
							}
							if(item.title == '最高額入札者') {
								res.data.laster = item.description
							}
							if(item.title == '個数') {
								res.data.tNum = item.description;
							}
							if(item.title == '自動延長') {
								res.data.isLater = item.description == 'あり' ? '是' : '否';
							}
							if(item.title == '早期終了') {
								res.data.isFirstStop = item.description == 'あり' ? '是' : '否';
							}
							if(item.title == '返品') {
								res.data.isReturn = item.description == '返品不可' ? '不可以' : '可以';
							}
						})
						const imgs = res.data.imgs || [];
						detailPicShow('#detailPicBox', {imgs})
						$('#itemDetailTanslate').attr('href', `http://fanyi.baidu.com/transpage?query=https%3A%2F%2Fpage.auctions.yahoo.co.jp%2Fjp%2Fauction%2F${res.data.item_id}&source=url&ie=utf8&from=auto&to=zh&render=1`)
						getRates((rates) => {
							res.data.CNYPrice = Math.round(res.data.bid.bid_price.split(',').join('') * rates['JPY_CNY'] * 100)/100;
							Loading.addContent(infoBoxTmp(res))
							Loading_info.addContent(res.data.body)
							//$('#itemDetail').html(infoBoxTmp(res))
							//$('#detailMain').html(res.data.body);
							setTimeout(() => {
								$('[data-countdown]').countdown();
							}, 2000)
						})
						console.log(res);
				}
		})
	}
};
new itemDetail();
//inst.open();

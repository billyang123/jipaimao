var $ = require('jquery');
import {getRates} from 'core/utils.js';
import dataBind from 'ui/databind.js';
import remodal from 'ui/remodal.js';
import calculationTmp from '../tpl/calculation.hbs';
window.$ = $;
var sppData = {
	'EMS': {
		'500':'1400',
		'600':'1540',
		'700':'1680',
		'800':'1820',
		'900':'1960',
		'1000':'2100',
		'1250':'2400',
		'1500':'2700',
		'1750':'3000',
		'2000':'3300',
		'2500':'3800',
		'3000':'4300',
		'3500':'4800',
		'4000':'5300',
		'4500':'5800',
		'5000':'6300',
		'5500':'6800',
		'6000':'7300',
		'7000':'8100',
		'8000':'8900',
		'9000':'9700',
		'10000':'10500',
		'11000':'11300',
		'12000':'12100',
		'13000':'12900',
		'14000':'13700',
		'15000':'14500',
		'16000':'15300',
		'17000':'16100',
		'18000':'16900',
		'19000':'17700',
		'20000':'18500',
		'21000':'19300',
		'22000':'20100',
		'23000':'20900',
		'24000':'21700',
		'25000':'22500',
		'26000':'23300',
		'27000':'24100',
		'28000':'24900',
		'29000':'25700',
		'30000':'26500'
	},
	'航空件': {
		'500':'1700',
		'1000':'2050',
		'1500':'2400',
		'2000':'2750',
		'2500':'3100',
		'3000':'3450',
		'3500':'3800',
		'4000':'4150',
		'4500':'4500',
		'5000':'4850',
		'5500':'5150',
		'6000':'5450',
		'6500':'5750',
		'7000':'6050',
		'7500':'6350',
		'8000':'6650',
		'8500':'6950',
		'9000':'7250',
		'9500':'7550',
		'10000':'7850',
		'11000':'8250',
		'12000':'8650',
		'13000':'9050',
		'14000':'9450',
		'15000':'9850',
		'16000':'10250',
		'17000':'10650',
		'18000':'11050',
		'19000':'11450',
		'20000':'11850',
		'21000':'12250',
		'22000':'12650',
		'23000':'13050',
		'24000':'13450',
		'25000':'13850',
		'26000':'14250',
		'27000':'14650',
		'28000':'15050',
		'29000':'15450',
		'30000':'15850'
	},
	'SAL': {
		'1000':'1800',
		'2000':'2400',
		'3000':'3000',
		'4000':'3600',
		'5000':'4200',
		'6000':'4700',
		'7000':'5200',
		'8000':'5700',
		'9000':'6200',
		'10000':'6700',
		'11000':'7000',
		'12000':'7300',
		'13000':'7600',
		'14000':'7900',
		'15000':'8200',
		'16000':'8500',
		'17000':'8800',
		'18000':'9100',
		'19000':'9400',
		'20000':'9700',
		'21000':'10000',
		'22000':'10300',
		'23000':'10600',
		'24000':'10900',
		'25000':'11200',
		'26000':'11500',
		'27000':'11800',
		'28000':'12100',
		'29000':'12400',
		'30000':'12700'
	},
	'船运': {
		'1000':'1600',
		'2000':'1900',
		'3000':'2200',
		'4000':'2500',
		'5000':'2800',
		'6000':'3100',
		'7000':'3400',
		'8000':'3700',
		'9000':'4000',
		'10000':'4300',
		'11000':'4550',
		'12000':'4800',
		'13000':'5050',
		'14000':'5300',
		'15000':'5550',
		'16000':'5800',
		'17000':'6050',
		'18000':'6300',
		'19000':'6550',
		'20000':'6800',
		'21000':'7050',
		'22000':'7300',
		'23000':'7550',
		'24000':'7800',
		'25000':'8050',
		'26000':'8300',
		'27000':'8550',
		'28000':'8800',
		'29000':'9050',
		'30000':'9300'
	}
};
function getYunPrice(t,w) {
	var rv = 0;
	$.each(sppData[t], function(key,v){
		rv = parseInt(v, 10);
		if(w < parseInt(key)) {
			return false;
		}
	})
	return rv;
}
const getFixNum = function(number) {
	return Math.round(number * 100) / 100;
}
const checkNum = function(number) {
	if(/^[-+]?[0-9]*\.?[0-9]+$/.test(number)) {
		return parseFloat(number)
	} else {
		return 0;
	}
}
const calc = new dataBind('calculation');
const setNum = function(rate, pirce, spsf, calLocalFreight, gjyf, calPackingCost, fwf) {
	calc.set('huilv', rate);
	calc.set('spje', pirce);
	calc.set('spsj', getFixNum(spsf));
	calc.set('rbddyf', calLocalFreight);
	calc.set('gjyf', getFixNum(gjyf));
	calc.set('bzf', calPackingCost);
	calc.set('yhhksxf', fwf);
	var total = pirce + spsf + calLocalFreight + gjyf + calPackingCost + fwf;
	calc.set('hejirmb', getFixNum(total));
	calc.set('hejiry', getFixNum(total * rate));
}
function calcula() {
  this.$node = $('#calculationModal'),
  this.$submit = this.$node.find('.js-calculation'),
  this.$reset = this.$node.find('.js-reset'),
  this.$calItemPrice = this.$node.find('.calItemPrice'),
  this.$calExciseTax = this.$node.find('.calExciseTax'),
  this.$calLocalFreight = this.$node.find('.calLocalFreight'),
  this.$calItemWeight = this.$node.find('.calItemWeight'),
  this.$calItemMode = this.$node.find('.calItemMode'),
  this.$calPackingCost = this.$node.find('.calPackingCost');
  this.rate = parseFloat(this.$node.data('rate'));
  this.init();
}
calcula.prototype = {
  getRate() {
    if(window.rates){
      this.rate = window.rates.JPY_CNY;
    } else {
      this.rate = parseFloat(this.$node.data('rate'))
    }
    return this.rate;
  },
  init() {
    this.getRate();
    this._reset();
    this._bind();
  },
  _reset() {
    this.getRate();
    this.$calItemPrice.val(''),
    this.$calExciseTax.val('0'),
    this.$calLocalFreight.val(''),
    this.$calItemWeight.val(''),
    this.$calItemMode.val('EMS'),
    this.$calPackingCost.val('200');
    setNum(this.rate, 0, 0,0,0,0,0);
  },
  _bind() {
    this.$submit.click(() => {
    	var pirce = checkNum(this.$calItemPrice.val());
    	var spsf = pirce * checkNum(this.$calExciseTax.val());

    	var calLocalFreight = checkNum(this.$calLocalFreight.val());

    	var calItemMode = this.$calItemMode.val() || 0;
    	var calItemWeight = checkNum(this.$calItemWeight.val()) * 1000;
    	var gjyf = getYunPrice(calItemMode, calItemWeight);
    	var calPackingCost = checkNum(this.$calPackingCost.val());
    	var fwf = 300;
    	setNum(this.rate, pirce, spsf, calLocalFreight, gjyf, calPackingCost, fwf);
    })
    this.$reset.click(() => {
    	this._reset()
    })
  }
}
getRates((rates) => {
	$('body').append(calculationTmp({rate: window.rates.JPY_CNY || 0.1}));
	var inst = $('[data-remodal-id="calculation"]').remodal();
	let calculation = new calcula();
})
module.exports = calcula

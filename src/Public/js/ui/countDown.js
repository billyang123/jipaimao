var $ = require('jquery');
var countDown = function(container,options) {
  this.$container = $(container);
  var optionsStr = this.$container.data('countdown');
  if (/\{.+\}/.test(optionsStr)) {
    this.options = $.extend({}, eval('('+optionsStr+')') ,options)
  } else {
    this.options = options;
  }
  this.format = this.options.format || 'dd天hh小时mm分钟ss秒';
  if (this.options.diffTime) {
    this.diffTime = this.options.diffTime;
  } else {
    this.deadline = this.options.deadline || '2018/03/12 12:00:00';
  }
  this.tm = null;
  this.init();
}
countDown.prototype = {
  init: function(){
    var _this = this;
    this.shoutDown();
    this.tm = setInterval(function(){
      _this.shoutDown()
    }, 1000)
  },
  setTm: function(time) {
    var _this = this;
    var str = this.format;
    var obj = {
      'dd': parseInt(time/1000/60/60/24,10),
      'hh': parseInt(_this.format.indexOf('dd') > -1 ? time/1000/60/60%24 : time/1000/60/60 ,10),
      'mm': parseInt(_this.format.indexOf('hh') > -1 ? time/1000/60%60 : time/1000/60 ,10),
      'ss': parseInt(_this.format.indexOf('mm') > -1 ? time/1000%60 : time/1000 ,10),
    }
    for (var idx in obj) {
      if (str.indexOf(idx) > -1) {
        str = str.replace(idx,obj[idx] < 10 ? '0' + obj[idx] : obj[idx])
      }
    }
    this.$container.html(str);
  },
  stTime:function(time) {
    if (time <= 0) {
      this.tm && clearInterval(this.tm);
      time = 0;
    }

    this.setTm(time);
  },
  shoutDown:function() {
    var _time = (new Date(this.deadline)).getTime();
    if(this.diffTime) {
        this.diffTime --;
        this.stTime(this.diffTime * 1000);
    } else {
      var nowtime = Date.now();
      this.stTime(nowtime - _time)
    }
  }
};
var defualts = {
  format: 'dd天hh小时mm分钟ss秒',
  deadline: '2018/03/12 12:00:00'
}
$.fn.countdown = function (options) {
  var me = this;
  var opts = $.extend({}, defualts, options);
  this.each(function(){
    if(!$(this).data('countDown')) {
      $(this).data('countDown', new countDown(this, opts))
    }
  })
  return this;
}
module.exports = countDown;

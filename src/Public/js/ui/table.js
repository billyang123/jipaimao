var $ = require('jquery');
var table = function(container, options) {
	var _this = this;
	this.$container = $(container);
	this.$checkbox = this.$container.find('.js-tdkey');
	this.$checkAll = this.$container.find('.js-check-all');
	this.$uncheckAll = this.$container.find('.js-un-check-all');
	this.dataKeys = [];
	this.dataList = [];
	this._bind();
}
table.prototype = {
	getKeys:function(){
		var keys = [];
		this.$checkbox.each(function(){
			if($(this).prop('checked')) {
				keys.push($(this).val())
			}
		})
		return keys
	},
	checkAll:function() {
		this.$checkbox.each(function(){
			$(this).prop('checked', true)
		})
	},
	unCheckAll:function() {
		this.$checkbox.each(function(){
			$(this).prop('checked', false)
		})
	},
	_bind: function() {
		var _this = this;
		this.$checkbox.click(function(){
			_this.dataKeys = _this.getKeys()
		})
		this.$checkAll.click(function(){
			_this.checkAll()
		})
		this.$uncheckAll.click(function(){
			_this.unCheckAll()
		})
	}
};
var defualts = {};
$.fn.table = function (options) {
  var opts = $.extend({}, defualts, options);
  this.each(function(){
    if(!$(this).data('table')) {
      $(this).data('table', new table(this, opts))
    }
  })
  return this;
}
module.exports = table;
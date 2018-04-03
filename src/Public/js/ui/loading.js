import loadingTemp from '../tpl/loading.hbs';
import $ from 'jquery';
//type: 'fusion-reactor';'flower','dot-circle'
var loading = function(container, options) {
  this.$container = $(container);
  this.options = Object.assign({
    style: 'width: 100%;',
    color: '#FFA100',
    type: 'fusion-reactor'
  },options);
  this.init()
}
loading.prototype = {
  init() {
    this.$container.html(loadingTemp({
      style: this.options.style,
      color: this.options.color,
      type: this.options.type
    }))
    return this;
  },
  show() {
    this.$container.find('.next-loading').addClass('loading');
    return this;
  },
  hide() {
    this.$container.find('.next-loading').removeClass('loading');
    return this;
  },
  addContent(html) {
    this.$container.find('.next-loading-content').html(html);
    return this;
  }
};
module.exports = loading;

var $ = require('jquery');
import {getCategory} from 'core/utils.js'
import yahooServiceTmp from '../tpl/yahooService.hbs';

function yahooService() {
  var ySBox = $('#yahooService');
  var yStrigger = $('.js-ys-target')
  var lisLink = ySBox.find('.service-bd a');
  var ysLBox = ySBox.find('.service-float');
  var ysLItem = ySBox.find('.service-float-item');
  lisLink.mouseenter(function() {
    lisLink.removeClass('hover')
    var index = lisLink.index(this);
    ysLItem.hide();
    lisLink.eq(index).addClass('hover');
    ysLItem.eq(index).show();
    ysLBox.fadeIn(100);
  })
  ySBox.mouseleave(function() {
    lisLink.removeClass('hover')
    ysLBox.fadeOut(100);
  })
  yStrigger.mouseleave(function() {
    lisLink.removeClass('hover')
    ysLBox.fadeOut(100);
    ySBox.fadeOut(100)
  })
  yStrigger.mouseenter(function(){
  	ysLBox.fadeIn(100);
  	ySBox.fadeIn(100)
  })
}
getCategory((cats) => {
  $('#yahooService').html(yahooServiceTmp({data:cats}));
  yahooService();
})

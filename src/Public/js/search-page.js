import $ from 'jquery';
import Paging from 'ui/paging.js';
import countDown from 'ui/countDown.js'

import {ajax, URLPARAM, findYahooCat, setUrlParam, getRates} from 'core/utils.js'

import itemsTemp from './tpl/findItem/items.hbs'
import filterAreaTemp from './tpl/findItem/filterArea.hbs'
import 'ui/yahooServer.js';
import loading from 'ui/loading.js'
window.jQuery = $;

var p = new Paging();
var Loading = new loading('#resultListBox',{style: 'width: 100%;min-height: 100px;'});
var searchPage = function() {
  this.$filter = $('#JfindFilter');
  this.params = Object.assign({pagenum: 1, pagesize: 20},URLPARAM);
  this.init();
}
searchPage.prototype = {
  init() {
    this.initFilter();
    this.search();
    this.bindEvent();
    p.init({
      target:'#pageBox',
      pagesize:this.params.pagesize,
      count:1,
      current: this.params.current,
      toolbar:true,
      changePagesize:(pagesize,currenpage,pagecount) => {
          this.params.pagesize = page;
          this.search();
      },
      callback:(page,size,count) => {
          this.params.pagenum = page;
          this.search();
      }
    });
  },
  setCrumbs(data) {
    const str = data.map((item) => {
      //<a href="#">首页</a> &lt; <a href="#">拍卖</a> &lt; <a href="#">古董、收藏 </a> &lt; <a href="#">工艺品收藏该分类</a>
      return `<a href="/findItem/?category=${item.id}">${item.name}</a>`
    })
    return '你现在的位置：<a href="/index">首页</a> &lt; ' + str.join(' &lt; ')
  },
  initActive() {
    let selectPrice = '';
    let select = this.params;
    let _sitem = null;
    let _item = null;
    if (this.params.max && this.params.min) {
      selectPrice = `min::${this.params.min},max::${this.params.max}`;
      _sitem = this.$filter.find(`.item[data-select="${selectPrice}"]`);
      if (_sitem.length >0) {
        _sitem.siblings('.item.active').removeClass('active');
        _sitem.addClass('active');
      }
    } else {

    }
    for (var key in this.params) {
      const val = this.params[key];
      let _select = `${key}::${val}`
      _item = this.$filter.find(`.item[data-select="${_select}"]`);
      if (_item.length > 0) {
          _item.siblings('a.item.active').removeClass('active');
          _item.addClass('active');
      }
    }
    if (this.params.sort) {
      console.log($('[data-sort]'));
      $('[data-sort]').each((index,st) => {
        const curItem = $(st);
        const sort = curItem.data('sort').split(',');
        if(sort.indexOf(this.params.sort) > -1) {
          curItem.parent('li').addClass('active');
        }
        if(sort[0] == this.params.sort) {
          curItem.find('.iconfont')
          .removeClass('icon-xiajiangjiantou')
          .addClass('icon-shangshengjiantou')
        } else {
          curItem.find('.iconfont')
          .removeClass('icon-shangshengjiantou')
          .addClass('icon-xiajiangjiantou')
        }
      })
    }
    if (this.params.max || this.params.min) {
      if(_sitem.length == 0 && _item.length == 0) {
        this.params.max && this.$filter.find('[name="max"]').val(this.params.max);
        this.params.min && this.$filter.find('[name="min"]').val(this.params.min);
      }
    }
    if (this.params.d_free) {
      this.$filter.find('[name="d_free"][value='+this.params.d_free+']').prop('checked', true)
    }
  },
  bindEvent() {
    this.$filter.find('a.item').on('click', (e) => {
      const selecteStr = $(e.target).data('select');
      const selecteArr = selecteStr.split(',');
      if(/min|max/.test(selecteStr)) {
        if(this.params.min) delete this.params.min;
        if(this.params.max) delete this.params.max;
      }
      selecteArr.forEach((sA) => {
        const ss = sA.split('::');
        this.params[ss[0]] = ss[1];
      })
      window.location.href = setUrlParam(this.params);
    })
    this.$filter.find('.js-pricebtn').on('click', (e) => {
      this.params.min = this.$filter.find('[name="min"]').val();
      this.params.max = this.$filter.find('[name="max"]').val();
      window.location.href = setUrlParam(this.params);
    })
    this.$filter.find('[type="radio"]').on('click', (e) => {
      const radioDom = $(e.currentTarget);
      if(radioDom.val()) {
        this.params.d_free = radioDom.val();
      } else {
        if (this.params.d_free) delete this.params.d_free;
      }
      window.location.href = setUrlParam(this.params);
    })
    $('[data-sort]').on('click', (e) => {

      const sortDom = $(e.currentTarget);
      const sortStr = sortDom.data('sort');
      const arrs = sortStr.split(',');
      this.params.sort = this.params.sort == arrs[0] ? arrs[1] : arrs[0]
      window.location.href = setUrlParam(this.params);
      // if (sortStr.split(','))
    })
  },
  initFilter() {
    findYahooCat(this.params.category || 0, (cat) => {
      let d = {};
      if (cat.resCat) {
        d = cat.resCat;
      } else {
        cat = {};
      }
      $('.bread-crumbs').html(this.setCrumbs(cat.paths))
      this.$filter.html(filterAreaTemp({cats:cat.resCat, params: this.params}))
      this.initActive();
    })
  },
  doResult(res) {
    Loading.addContent('<ul class="clear">' + itemsTemp(res) + '</ul>');
    p.render({count:parseInt(
      res.num_product ? res.num_product.split(',').join('') : '0'
    ),pagesize:res.pagesize, current: this.params.pagenum});
    $('#resultListBox [data-id]').each((index, item) => {
      this.getItemTime($(item).data('id'));
    })
  },
  getItemTime(itemId) {
    ajax({
      url: '/spider/api/',
      type: 'post',
      data: {
        op: '001020',
        item: itemId
      },
      success: (res) => {
        $(`[data-id="${itemId}"]`).find('[data-countdown]').attr(
          'data-countdown', "{diffTime:" + parseInt(res.data.remaining, 10) + "}"
        ).countdown({format: '剩余：<em>dd</em>天<em>hh</em>时<em>mm</em>分<em>ss</em>秒'});
      }
    })
  },
  search() {
    // this.doResult();
    // return;
    let data = this.params;
    data.op = '002001';
    Loading.show();
    ajax({
      url: '/spider/api/',
      type: 'post',
      data: data,
      complete: () => {
        Loading.hide();
      },
      success: (res) => {
        getRates((rates) => {
          const data = res.data || {};
          data.JPY_CNY = rates.JPY_CNY;
          this.doResult(data)
        })
        console.log(res);
      }
    })
  }
};
new searchPage()

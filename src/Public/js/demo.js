import $ from 'jquery';

import {ajax} from 'core/utils';
$.ajax({
  url: '/api/index.html',
  success(res) {
    $('#ApiArea').html(res)
  }
})

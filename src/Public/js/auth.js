import $ from 'jquery';
import {ajax} from 'core/utils';
var authIndex = function(){
	this.init();
  this._bindEvent();
}
authIndex.prototype = {
  init() {
		this.is_send = true;
		this.times = 60;
		this.clear = 1;
		this.keysort = "739695033b3b0f6879";
		this.$form = $('#authFrom');
  },
  _bindEvent() {
		var _this = this;
    $('.checkboximg').on('click', function(e){
      const checkbox = $(e.currentTarget).find('[type="checkbox"]');
      const isFlag = checkbox.prop("checked");
      isFlag ? $(e.currentTarget).removeClass('checked') : $(e.currentTarget).addClass('checked');
      checkbox.prop('checked', !isFlag);
    })
    $('.js-codeVerifyImg').on('click', function(e){
      const curImg = $(e.currentTarget);
      const codeUrl = curImg.data('url');
      curImg.attr('src', codeUrl + Math.random())
    })
		this.$form.find('.js-getTelCode').on('click', function(e){
			_this.send_sms($(this));
		})
		this.$form.find('.js-regSubmit').on('click', function(e){
			_this.telregform();
		})
		this.$form.find('.js-loginSubmit').on('click', function(e){
			_this.telregform();
		})
  },
	less_times($node) {
		this.times--;
		$node.html( this.times+"秒后可再次发送" );
		$node.css("background","#A4A19F");
		this.clear = setTimeout(() => {
			this.less_times($node);
		}, 1000);
		if( this.times < 0 ){
			clearTimeout(this.clear);
			this.is_send = true;
			this.times = 60;
			$node.html("获取手机验证码");
			$node.css("background","#FF7105");
		}
	},
	send_sms($node){
		const url = $node.data('url');
		if( !this.is_send ){
			return false;
		}

		var verifyimgtel = this.$form.find('.js-verifyimgtel').val();
		var tel = this.$form.find('.js-telphone').val();
		if( !tel ){
			layer.alert('请填写手机号码');
			return false;
		}

		var regex = /^1[0-9]{1}[0-9]{1}\d{8}$/;
		if(  !regex.test(tel)  ){
			layer.alert('手机号码格式有误');
			return false;
		}

		if( !verifyimgtel ){
			layer.alert('请输入图片验证码');
			return false;
		}
		$.post(url,{ tel:tel,verifyimg:verifyimgtel,keysort:keysort },(res) => {
			if(res == "1"){
				this.is_send = false;
				this.less_times($node);
				//layer.open({content:"验证码已经发送到您的手机上了，请查收"});
			}else{
				this.is_send = true;
				layer.open({content:res});
			}
		});
	},
	telregform() {
		if( !this.$form.find('.js-telphone').val() ){
			layer.open({content:'请输入手机号码'});
			return;
		}
		if( !this.$form.find('.js-verifyimgtel').val() ){
			layer.open({content:'请输入图片验证码'});
			return;
		}
		if( !this.$form.find('.js-telcode').val() ){
			layer.open({content:'请输入手机验证码'});
			return;
		}
		if( !this.$form.find('.js-password').val() ){
			layer.open({content:'请输入密码'});
			return;
		}
		if( this.$form.find('.js-password').val() != this.$form.find('.js-passwords_re').val() ){
			layer.open({content:'两次密码输入不一样'});
			return;
		}
		if( !this.$form.find('.js-TrueName').val() ){
			layer.open({content:'请输入真实姓名'});
			return;
		}
		this.$form.submit();
	},
	loginForm() {
		if( !this.$form.find('.js-account').val() ){
			layer.open({content:'请输入您的账号'});
			return;
		}
		if( !this.$form.find('.js-password') ){
			layer.open({content:'请输入您的密码'});
			return;
		}
		if( !this.$form.find('.js-verify') ){
			layer.open({content:'请输入验证码'});
			return;
		}
		this.$form.submit();
	}
}
new authIndex();

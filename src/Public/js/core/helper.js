var Handlebars = require('handlebars-template-loader/runtime');
var $ = require('jquery');
var handleHelper = Handlebars.registerHelper("addOne",function(index){
    return index+1;
});
var isArray = function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}
var ExpressionRegistry = function() {
    this.expressions = [];
};
ExpressionRegistry.prototype.add = function (operator, method) {
    this.expressions[operator] = method;
};
ExpressionRegistry.prototype.call = function (operator, left, right) {
    if ( ! this.expressions.hasOwnProperty(operator)) {
        throw new Error('Unknown operator "'+operator+'"');
    }

    return this.expressions[operator](left, right);
};
var eR = new ExpressionRegistry;
eR.add('not', function(left, right) {
    return left != right;
});
eR.add('>', function(left, right) {
    return left > right;
});
eR.add('<', function(left, right) {
    return left < right;
});
eR.add('>=', function(left, right) {
    return left >= right;
});
eR.add('<=', function(left, right) {
    return left <= right;
});
eR.add('===', function(left, right) {
    return left === right;
});
eR.add('!==', function(left, right) {
    return left !== right;
});
eR.add('in', function(left, right) {
    if ( ! isArray(right)) {
        right = right.split(',');
    }
    return right.indexOf(left) !== -1;
});

var isHelper = function() {
    var args = arguments
    ,   left = args[0]
    ,   operator = args[1]
    ,   right = args[2]
    ,   options = args[3]
    ;

    if (args.length == 2) {
        options = args[1];
        if (left) return options.fn(this);
        return options.inverse(this);
    }

    if (args.length == 3) {
        right = args[1];
        options = args[2];
        if (left == right) return options.fn(this);
        return options.inverse(this);
    }

    if (eR.call(operator, left, right)) {
        return options.fn(this);
    }
    return options.inverse(this);
};

Handlebars.registerHelper('is', isHelper);
Handlebars.registerHelper('jsCore', function(jsCore) {
	return eval(jsCore);
});
Handlebars.registerHelper('jsNumTotal', function(arr) {
	var total = 0;
	for (var i = 0; i < arr.length; i++) {
		total +=arr[i]
	}
	return total;
});
Handlebars.registerHelper('nl2br', function(text) {
    var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
    return new Handlebars.SafeString(nl2br);
});

Handlebars.registerHelper('log', function() {
    console.log(['Values:'].concat(
        Array.prototype.slice.call(arguments, 0, -1)
    ));
});

Handlebars.registerHelper('debug', function() {
    console.log('Context:', this);
    console.log(['Values:'].concat(
        Array.prototype.slice.call(arguments, 0, -1)
    ));
});
Handlebars.registerHelper('link', function(text,url, className) {
    text = Handlebars.Utils.escapeExpression(text);
    url  = Handlebars.Utils.escapeExpression(url);

    var result = `<a url="${url}" ${className ? 'class="' + className +'"' : ''}>${text}</a>`;

    return new Handlebars.SafeString(result);
});
Handlebars.registerHelper('imgTag', function(text,url, className) {
    text = Handlebars.Utils.escapeExpression(text);
    url  = Handlebars.Utils.escapeExpression(url);

    var result = `<a url="${url}" ${className ? 'class="' + className +'"' : ''}>${text}</a>`;

    return new Handlebars.SafeString(result);
});
Handlebars.registerHelper("get",function(data, keys){
  if (!keys) return data;
  var keyArr = keys.split('.');
  var result = data;
  keyArr.forEach((key) => {
    // if (/^\d+$/.test(key)) {
    //
    // }
    result = result[key]
  })
  return result;
});
Handlebars.registerHelper("safeString",function(str){
    return new Handlebars.SafeString(str);
});
Handlebars.registerHelper("getArr",function(data, index){
    return data[index]
});
Handlebars.registerHelper("getPrice",function(price, type){
  if (price) {
    price = price.split(',').join('');
  } else {
    price = 0;
  }
  return Math.round(window.rates[type] * price * 100)/100;
});
Handlebars.registerHelper("getItemIdFormUrl", function(url){
  const urls = url.split('/');
  const itemId = urls[urls.length - 1];
  return itemId;
});
Handlebars.registerHelper("ImgTag",function(src, style){
    let styleArr = [];
    for (var key in style) {
      styleArr.push(`${key}:${style[key]};`)
    }
    const result = `<img src="${src}" style="${styleArr.join('')}"/>`
    return new Handlebars.SafeString(result);
});

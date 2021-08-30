/**
 * @Author:      skyeGao
 * @Email:       yyjzp1314@126.com
 * @Description:  
 */


// 根据key值 获取url中search对应的value
export const getLocationParam = (key) => {
  var locationHref = window.location.href,
      rexp = new RegExp("[&?]{1}" + key + "=([^&?|^#?]*)", "ig");
  // return locationHref.match(rexp) ? decodeURI(locationHref.match(rexp)[0].substr(key.length + 2)) : (locationHref = document.referrer, locationHref.match(rexp) ? decodeURI(locationHref.match(rexp)[0].substr(key.length + 2)) : "");
  // url中同名参数的最后一个
  return locationHref.match(rexp) ? decodeURI(locationHref.match(rexp)[locationHref.match(rexp).length-1].substr(key.length + 2)) : (locationHref = document.referrer, locationHref.match(rexp) ? decodeURI(locationHref.match(rexp)[locationHref.match(rexp).length-1].substr(key.length + 2)) : "");
}

// 获取操作系统(android/ios)
export const getOS = () => {
  var userAgent = navigator.userAgent,
      platEnum = {
        android: userAgent.match(/(Android)\s+([\d.]+)/),
        ipad: userAgent.match(/(iPad).*OS\s([\d_]+)/),
        iphone: userAgent.match(/(iPhone\sOS)\s([\d_]+)/)
      },
      txt = "";
  return platEnum.android ? txt = "android" : (platEnum.ipad || platEnum.iphone) && (txt = "ios")
}

// 是否是pc端
export const isPc = () => {
  var userAgent = navigator.userAgent;
  return !userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}

// 获取浏览器类型
export const browser = () => {
  var userAgent = navigator.userAgent.toLowerCase();
  return {
    firefox : /firefox/.test(userAgent),
    safari : /!chrome/.test(userAgent) && /safari/.test(userAgent),
    chrome : /chrome/.test(userAgent),
    opera : /opera/.test(userAgent),
    ie : /msie/.test(userAgent),
    ie11 : /trident 7.0/.test(userAgent) || /trident\/7.0/.test(userAgent),
  }
}

// 格式化参数
export const formatParams = (params) => {
  var str = ''
  for (var k in params) {
    str += k + '=' + encodeURI(params[k]) + '&'
  }
  return str;
}
/*export const formatParams = (data) => {
  var arr = [];
  for (var name in data) {
    arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  };
  // 添加一个随机数，防止缓存
  arr.push('v=' + random());
  return arr.join('&');
}*/

// img打点方式 进行数据请求
export const sendLogByImageGet = (url) => {
  var data = window['imgLogData'] || (window['imgLogData'] = {}); // 防止数据丢失
  var img = new Image();
  var uid = this.unique();
  img.onload = img.onerror = function() {
    img.onload = img.onerror = null;
    img = null;
    delete data[uid];
  }
  img.src = window.location.protocol + url + '&_uid=' + "_img_" + Math.random();
}

export const syncGet = (url, t) => {
  var n = t || 0, self = this, xhr = new XMLHttpRequest;
  xhr.open("GET", url, false);
  xhr.withCredentials = true;
  xhr.onreadystatechange = function() {
    xhr.readyState === 4 && xhr.status !== 200 && n < 1 && (n++, self.syncGet(url, n));
  };
  xhr.send(null);
}

// 判断head中是否有特定src的script标签
export const isHaveScriptBySrc = (src) => {
  var head = document.getElementsByTagName('head')[0];
  var childrens = [].slice.call(head.children);
  return childrens.some(function(item, index, arr) {
    if (item.nodeName.toLowerCase() === 'script' && item.src === src) {
      return true;
    }
  })
}

/**
 * @params      
 * url:       进行请求的url地址
 * data:      进行jsonp请求的data参数对象
 * callback:  jsonp请求的回调函数
 * jsonp:     设置传递给后台的参数字段名
 * success:   jsonp请求成功回调
 * error:     jsonp请求失败回调
 * @调用方式示例:
    ajaxJsonP({
      url: 'https://fans.tv.sohu.com/star/h5/pc/starinfos.json',
      data: {
        starids: '313500,317216,274586,11397,1118096,573113,274591,315539,312942,274665,597107',
        encode: 'GBK',
        _: 1542854883655
      },
      jsonp: 'callback', // 设置传递给后台的参数字段名
      callback: 'successCallback',
      success: successCallback,
      error: error,
      time: 1000
    })

    function successCallback(data){ console.log(data) }
    function error(msg){ console.log(msg) } 
 */
export const ajaxJsonP = (params) => {
  params = params || {};
  params.data = params.data || {};

  if (!params.url || !params.callback){
    throw new Error("jsonp参数错误");
  }

  var callbackName = params.jsonp || 'callback';
  // 设置传递给后台的回调参数名
  params.data[callbackName] = params.callback;

  var _data = formatParams(params.data);
  var script = document.createElement('script');
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(script);

  // 创建jsonp回调函数
  window[params.callback] = function(json){
    isHaveScriptBySrc(params.url+'?'+_data)&&head.removeChild(script);
    params.time&&clearTimeout(params.time);
    window[params.callback] = null;
    params.success&&params.success(json);
  }
  //发送请求
  script.src = params.url+'?'+_data;

  // 为了得知此次请求是否成功，设置超时处理
  if(params.time){
    script.time = setTimeout(function(){
      isHaveScriptBySrc(params.url+'?'+_data)&&head.removeChild(script);
      params.time&&clearTimeout(params.time);
      window[params.callback] = null;
      params.error&&params.error({
        message: '超时'
      });
    }, params.time)
  }
}


/**
 * @params
 * url:       script标签的src    
 * callback:  加载后回调
 * @Description： 动态加载script文件
 */
export const loadScript = (url, callback) => {
  var script = document.createElement("script");
  script.src = url;
  callback = callback || function() {};
  script.onload = script.onreadystatechange = function() {
    this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (callback(), this.onload = this.onreadystatechange = null, this.parentNode.removeChild(this))
  }, 
  document.getElementsByTagName("head")[0].appendChild(script);
}

// 动态加载css
export function loadCss(url){
  let css = document.createElement('link');
  css.href = url;
  css.rel = 'stylesheet';
  css.type = 'text/css';
  document.head.appendChild(css);
}

/**
 * @Description:      兼容性处理事件绑定
 * @示例:
 eventUtil.addHandler(document, 'click', dmClickMonitor, true);
 eventUtil.addHandler(document, 'touchend', dmTouchMonitor, true); 
 */
export const eventUtil = {
  addHandler: function(element, type, handler, bubble) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, bubble!=undefined ? bubble:true);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  removeHandler: function(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, bubble!=undefined ? bubble:true);
    } else if (element.detachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  }
}


export const uniq = (function (){
  var time = (new Date()).getTime() + '-', i = 0;
  return function() {
    return time + (i++);
  }
})()


export const getUuid = (len, radix) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
   for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
   var r;

   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
   uuid[14] = '4';

   for (i = 0; i < 36; i++) {
    if (!uuid[i]) {
     r = 0 | Math.random()*16;
     uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
    }
   }
  }

  return uuid.join('');
}

const getRandomNumber = (start, end)=>{
  return Math.floor(Math.random()*(end-start)) + start
}

// 参数min为随机数最小值 max为随机数最大值 得到的随机数范围为[min,max]
const getRandom = (min, max) => {
  return Math.floor(Math.random()*(max+1-min)+min)
}

//用于生成uuid
function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// str的字符长度计算 英文占1个字符长度 汉字为2个字符长度
export const cnLen = (str) => {
  var len = 0;
  if (str) {
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
        len += 2;
      } else {
        len++;
      }
    }
  }
  return len;
}

// 随机获取一个颜色值
export const getRandomColor = () => {
  const rgb = []
  for (let i = 0 ; i < 3; ++i){
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

// 根据月份返回所属季度
export const myQuarter = (month) => {
  switch (month) {
    case 3:
      return 1;
    case 6:
      return 2;
    case 9:
      return 3;
    case 12:
      return 4;
    default:
      return Math.floor(month/3 + 1);
  }
}

// 根据秒值换算成“时:分:秒”形式
export const realFormatSecond = (second) => {
  const secondType = typeof second
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)

    const hours = Math.floor(second / 3600)
    second = second - hours * 3600
    const mimute = Math.floor(second / 60)
    second = second - mimute * 60

    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  }
  return '0:00:00'
}

// 获取当前鼠标位置
export const getMousePos = (event) => {
  const e = event || window.event;
  const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
  const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  const x = e.pageX || e.clientX + scrollX;
  const y = e.pageY || e.clientY + scrollY;
  //alert('x: ' + x + '\ny: ' + y);
  return {'x': x, 'y': y};
}

// 获取一个随机字符 len：随机字符长度
export const randomString = (len) => {
  len = len || 16;
  var chars = 'abcdefghijklmnopqrstuvwxyz';
  var maxPos = chars.length;
  var val = '';
  for (let i = 0; i < len; i++) {
    val += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return 'ch' + val;
}

// // ********************* js判断客户端是PC端还是移动端访问 ******************* //
// 方法1-推荐
export const isPc = () => {
  const userAgentInfo = navigator.userAgent;
  const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  agents.some(i=>{
    if (userAgentInfo.indexOf(i) > 0) {
      flag = false;
      return true;
    }
  })
  return flag;
}

// 方法2
export const browser={
  versions:function(){ 
    var u = navigator.userAgent, app = navigator.appVersion; 
    return { //移动终端浏览器版本信息 
      trident: u.indexOf('Trident') > -1,                             //IE内核
      presto: u.indexOf('Presto') > -1,                               //opera内核
      webKit: u.indexOf('AppleWebKit') > -1,                          //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,     //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/),                     //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),                //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,  //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 ,                              //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1,                                   //是否iPad  
      webApp: u.indexOf('Safari') == -1,                              //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1,                       //是否微信 
      qq: u.match(/\sQQ/i) == " qq"                                    //是否QQ
    };
  }(),
  language:(navigator.browserLanguage || navigator.language).toLowerCase()
} 
/*
// 使用方法  
if(browser.versions.mobile || browser.versions.ios || browser.versions.android || 
  browser.versions.iPhone || browser.versions.iPad){  	
     window.location = "http://m.zhaizhainv.com";	
} */

// 方法3 摘自im- qq
export const os = function() {
  const ua = navigator.userAgent,
  isWindowsPhone = /(?:Windows Phone)/.test(ua),
  isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone, 
  isAndroid = /(?:Android)/.test(ua), 
  isFireFox = /(?:Firefox)/.test(ua), 
  isChrome = /(?:Chrome|CriOS)/.test(ua),
  isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
  isPhone = /(?:iPhone)/.test(ua) && !isTablet,
  isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid : isAndroid,
    isPc : isPc
  };
}();
/* // 使用方法 
if(os.isAndroid || os.isPhone){
  alert("-----");
} */


// 方法4
if(/AppleWebKit.*mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
  if(window.location.href.indexOf("?mobile")<0){
    try{
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
        window.location.href="手机页面";
      }else if(/iPad/i.test(navigator.userAgent)){
        window.location.href="平板页面";
      }else{
        window.location.href="其他移动端页面"
      }
    }catch(e){}
  }
}

// 如果你只在乎的其实只是界面的大小，可参考如下代码
export const detectMobile = () => {
  return window.innerWidth <=800 && window.innerHeight <=600;
}

// // ********************* js判断客户端是PC端还是移动端访问 ******************* //





















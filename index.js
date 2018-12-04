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





















/**
 * @Author:      skyeGao
 * @Email:       yyjzp1314@126.com
 * @DateTime:    2018-11-22 14:56:31
 * @Description: polyfill 
 */

// 模拟call
Function.prototype.myCall = function(context) {
  var context = context || window;
  // 给 context 添加一个属性
  // getName.call(a, 'yck', '24') => a.fn = getName
  context.fn = this;
  // 将 context 后面的参数取出来
  var args = [...arguments].slice(1);
  // getName.call(a, 'yck', '24') => a.fn('yck', '24')
  var result = context.fn(...args);
  // 删除 fn
  delete context.fn;
  return result;
}

// 测试
/*var obj = {name:'yy'};
var name = 'yytest';
function getName(name,age){
  console.log(name);
  console.log(age);
  console.log(this.name);
}
getName.myCall(obj,'y',20);*/


// 模拟apply
Function.prototype.myApply = function(context) {
  var context = context || window;
  context.fn = this;

  var result;
  // 需要判断是否存储第二个参数
  // 如果存在，就将第二个参数展开
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }

  delete context.fn;
  return result;
}

// 测试
/*var obj = {name:'yy'};
var name = 'yytest';
function getName(name,age){
  console.log(name);
  console.log(age);
  console.log(this.name);
}
getName.myApply(obj,['y',20]);*/




// 模拟 bind
Function.prototype.myBind = function(context){
  if(typeof this!=='function'){
    throw new TypeError('Error');
  }
  var _this = this;
  var args = [...arguments].slice(1);

  // 返回一个函数
  return function F(){
    // 因为返回了一个函数，所以我们可以 new F(),所以需要判断
    if(this instanceof F){
      return new _this(...args,...arguments);
    }
    return _this.apply(context,args.concat(...arguments));
  }
}

// 测试
/*var obj = {name:'yy'};
function getName(name,age){
  console.log(name);
  console.log(age);
  console.log(this.name);
}
getName.bind(obj,'dh',21)()  // 或者 getName.bind(obj)('dh',21)
*/














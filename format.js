
// 带K/M/G单位的字符串转为Byte值
export const convertByteSize = (sizeString) => {
  sizeString = sizeString + ''
  const type = sizeString.substr(sizeString.length - 1, 1)
  let numSize = parseInt(sizeString, 10)
  switch (type) {
    case 'g':
    case 'G':
      numSize = numSize * 1024 * 1024 * 1024
      break
    case 'm':
    case 'M':
      numSize = numSize * 1024 * 1024
      break
    case 'k':
    case 'K':
      numSize = numSize * 1024
      break
    default:
      break
  }
  return numSize;
}

// 带S/M/H单位的字符串转为秒数值
export const convertSecondDuration = (durationString) => {
  durationString = durationString + '';
  const type = durationString.substr(durationString.length - 1, 1);
  let numDuration = parseInt(durationString, 10)
  switch (type) {
  case 's':
  case 'S':
    numDuration = numDuration;
    break;
  case 'm':
  case 'M':
    numDuration = numDuration * 60
    break;
  case 'h':
  case 'H':
    numDuration = numDuration * 60 * 60
    break;
  default:
    break;
  }
  return numDuration;
}


// 格式化为千分位展示数字 
/*export const numThousandSeparator = num => {
  return (num.toString().indexOf ('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}*/

// 格式化为千分位展示数字 
export const formatNumber = (value) => {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}


// 四舍五入保留n位小数，如：2，会在2后面补上00.即2.00
export const toDecimal = (num,n) => {
  var f = parseFloat(num);    
  if (isNaN(f)) { return false; }
  var f = Math.round(num*100)/100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
      rs = s.length;
      s += '.';
  }
  while (s.length <= rs + n) {
    s += '0';
  }
  return s;
}

//保留n位小数并格式化输出（不足的部分补0）
export const fomatFloat = (value, n) {
  var f = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
  var s = f.toString();
  var rs = s.indexOf('.');   
  if (rs < 0) {     
      s += '.';   
  } 
  for(var i = s.length - s.indexOf('.'); i <= n; i++){
    s += "0";
  }
  return s;
}

// 四舍五入保留n位小数，不足则不会后补0
export const retainDecimals = (value, n) => {
  if (parseFloat(value) === 0) {
    return parseFloat(value).toFixed(1)
  }
  return Math.round(value*Math.pow(10, n)) / Math.pow(10, n)
}


/* 

var num = parseInt(5/3)   //1 直接取整，丢弃小数部分
var num = Math.round(5/3) //2 四舍五入取整
var num = Math.ceil(5/3)  //2 向上取整
var num = Math.floor(5/3) //1 向下取整



toFixed()方法
toFixed() 方法可以将数字转化为字符串，并指定小数点后保留几位。如果小数实际位数不够指定的位数，不足的部分会补0.所有主要浏览器都支持toFixed()方法
toFixed() 方法并非四舍五入，而是使用的是银行家舍入规则：四舍六入五取偶（又称四舍六入五留双）

银行家舍入法：
四舍六入五考虑，五排非零就进1，五后为零看奇偶，五前为偶应舍去，五前为奇要进1

规则：
当舍去位的数值 < 5 时，直接舍去
当舍去位的数值 >= 6 时，在舍去的同时向前进一位
当舍去位的数值 = 5 时：
  5后不为空且不全为0，在舍去的同时向前进一位
  5后为空或全为0：
    5前数值为奇数，则在舍去的同时向前进一位
    5前数值为偶数，则直接舍去

var num1 = (5/3).toFixed(2);    // 1.67
var num2 = (4).toFixed(2);      // 4.00
var num3 = (0.015).toFixed(2);  // 0.01
var num4 = (0.025).toFixed(2);  // 0.03

1.045.toFixed(2)    // 1.04
1.0455.toFixed(2)   // 1.05
1.0453.toFixed(2)   // 1.05
1.0450.toFixed(2)   // 1.04
1.0451.toFixed(2)   // 1.05
*/

// 基于toFixed存在的问题，重写
export function toFixedFun (data, len){
  const number = Number(data);
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof (len) === 'undefined' || len === 0) {
    return (Math.round(number)).toString();
  }
  let result = number.toString();
  const numberArr = result.split('.');

  if (numberArr.length < 2) {
    // 整数的情况
    return padNum(result);
  }
  const intNum = numberArr[0]; // 整数部分
  const deciNum = numberArr[1];// 小数部分
  const lastNum = deciNum.substr(len, 1);// 最后一个数字

  if (deciNum.length === len) {
    // 需要截取的长度等于当前长度
    return result;
  }
  if (deciNum.length < len) {
    // 需要截取的长度大于当前长度 1.3.toFixed(2)
    return padNum(result);
  }
  // 需要截取的长度小于当前长度，需要判断最后一位数字
  result = `${intNum}.${deciNum.substr(0, len)}`;
  if (parseInt(lastNum, 10) >= 5) {
    // 最后一位数字大于5，要进位
    const times = Math.pow(10, len); // 需要放大的倍数
    let changedInt = Number(result.replace('.', ''));// 截取后转为整数
    changedInt++; // 整数进位
    changedInt /= times;// 整数转为小数，注：有可能还是整数
    result = padNum(`${changedInt }`);
  }
  return result;
  // 对数字末尾加0
  function padNum(num) {
    const dotPos = num.indexOf('.');
    if (dotPos === -1) {
      // 整数的情况
      num += '.';
      for (let i = 0; i < len; i++) {
        num += '0';
      }
      return num;
    } else {
      // 小数的情况
      const need = len - (num.length - dotPos - 1);
      for (let j = 0; j < need; j++) {
        num += '0';
      }
      return num;
    }
  }
}



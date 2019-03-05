
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
export const formatNumber(value) {
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





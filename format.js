
import moment from 'moment'

export const toDate = value => {
  if (!value) {
    return '-'
  }
  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1 < 10) ? '0' + ~~(date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export const toPercent = value=>{
  return  value ? (parseFloat(value)*100).toFixed(2) + '%' : ''
}

export const toYuan = (value=0, postfix=0) =>{
  if(value){
    value = parseFloat(value)/100000;
    let strValue = value + '';
    if(strValue.indexOf('.')>-1){
      value = value.toFixed(2)
    }
    value += postfix;
  }


  return  parseFloat(value)
}

export const toYuanSign = (value=0) =>{
    if(value){
        value = parseFloat(value)/100000;
        let strValue = value + '';
        if(strValue.indexOf('.')>-1){
            value = value.toFixed(2)
        }
        value = '\uffe5' + value;
    }
    return  value;
}

export const dateformat = (date, format) => {
    date = new Date(date);

    let map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
        let v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });

    return format;
}

export const getAllDate = (startDate, endDate) => {
    let resultArr = [];

    let ab = startDate.split("-");
    let ae = endDate.split("-");
    let db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    let de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    let unixDb = db.getTime();
    let unixDe = de.getTime();

    resultArr.push(startDate);
    for (let k = unixDb + 24 * 60 * 60 * 1000; k < unixDe;) {
        resultArr.push(dateformat((new Date(parseInt(k))), 'yyyy-MM-dd'));
        k = k + 24 * 60 * 60 * 1000;
    }
    resultArr.push(endDate);

    return resultArr;
}

export const toText = (value, list, key, targetKey) => (list.find(item => item[key] == value) ? list.find(item => item[key] == value)[targetKey] : '-');

export const toDay = timeStamp=>moment(timeStamp).format('YYYY-MM-DD')

export const zeroDefault = value => value||'0.00'

export const zeroPercentDefault = value => value||'0.00%'




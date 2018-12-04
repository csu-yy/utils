
// import {isEmpty} from './obj'

export const isEmpty = obj => {
    if (obj == null) { return true; }
    if (obj.length > 0) { return false; }
    if (obj.length === 0) { return true; }

    for (const key in obj) {
        return false;
    }

    return typeof obj === 'object';
}

export const isValidFileType = (rules, filename)=>{
  if(!rules || !rules.length || !filename){
    return false;
  }
  const fileNameArr = filename.split('.');
  let isValidFileType = false;

  let fileType;
  const fileNameArrLen = fileNameArr.length;
  if(fileNameArr && fileNameArrLen>1){
    fileType = fileNameArr[fileNameArrLen-1].toLowerCase();
  }

  isValidFileType = rules.some(rule=>rule.toLowerCase().indexOf(fileType)>-1);
  return isValidFileType;
}

export const arrayIsEmpty = (value) => {
  return !value||!value.length
}

export const numberVendor = (value, bit = 2) => {
  if (+(value) == NaN) {
    return false
  }
  if (bit == 0) {
    return new RegExp('^[0-9]*[1-9][0-9]*$').test(value);

  }

  return new RegExp(`^[0-9]+(\\.\\d{1,${bit}})?$`).test(value)

};

export const rangeVender = (value, minValue, maxValue) => {
  if (+(value) == NaN) {
    return false
  }
  return (!isEmpty(minValue) || !isEmpty(maxValue)) && (minValue <= parseFloat(value) && maxValue >= parseFloat(value));
}

export const isValidUrl = (value, minValue, maxValue) => {
  const urlReg = new RegExp('^((http|https):\\/\\/)(\\w(\\:\\w)?@)?((([0-9a-zA-Z_-]+\\.)*?([a-zA-Z0-9-]+\\.[a-zA-Z]{2,6}(\\.[a-zA-Z]{2})?(\\:[0-9]{2,6})?))|((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\:[0-9]{2,6})?))((\\/[^?#<>\\/\\\\*\":]*)+((\\?|\\&|\\/)[^#]*)?(#.*)?)?$')
  return urlReg.test(value)
}


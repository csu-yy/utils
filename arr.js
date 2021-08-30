'use strict';
import _ from 'lodash'
import { industryArr } from './arrjson'

let arr = changeFieldsByRules(industryArr)

// 递归替换json嵌套数组字段 
changeFieldsByRules = (arr,rules={label:'industry_name',value:'industry_id',children:'childs'})=>{
  if(arr.length===0){ return []; }
  arr.map((item,index,arr)=>{
    if(item.industry_name){
      arr[index] = {
        value: item[rules.value],
        label: item[rules.label],
        children: item[rules.children],
      }
      return arr[index].children && changeFieldsByRules(arr[index].children)
    }
  })
  return arr
}


export const getMaximin = (arr,maximin) => {
  if (maximin == "max") {
    return Math.max.apply(Math, arr);
  } else if (maximin == "min") {
    return Math.min.apply(Math, arr);
  }
}


/**
 * 判断两个数组的每个值是否在两边都有，即不考虑数据项index时两个数组的内容是否相等，如果是则返回true，否则返回false
 * 例1：list1 = [1, 2，3], list2 = [3，1, 2]，则compareItems(list1, list2)返回true
 * 例2：
 *    list1 = [{id: 1, name: 'xxx'}, {id: 2, name: 'yyy'}],
 *    list2 = [{id: 1, name: 'yya'}, {id: 2, name: 'yyb'}],
 *    可得到结果 compareItems(list1, list2) 为false； compareItems(list1, list2, item => item.id) 为true
 * @param list1 数组1
 * @param list2 数组2
 * @param compareBy 对数组每项根据compareBy方法返回的值进行排序和等于的判断，不传该值则直接比较数组项
 * @return {boolean}
 */
export const compareItems = (list1, list2, compareBy) => {
  if (list1.length !== list2.length) {
    return false
  }
  const sortedList1 = _.sortBy(list1, compareBy)
  const sortedList2 = _.sortBy(list2, compareBy)
  return sortedList1.every((item1, index) => {
    const item2 = sortedList2[index]
    if (compareBy) {
      return _.isEqual(compareBy(item1), compareBy(item2))
    }
    return _.isEqual(item1, item2)
  })
}

/**
 * @description: 数组排序（时间正序positive或者倒序reverse）依赖一个大数比较的库 Big.js(npm install Big.js)
 * @param {*} arrKey: 比较数组的key值
 * @param {*} align: positive || reverse
 * @return {*} 按照正序或者倒序的数组
 * 使用： 
 * const arr = [{time:'2021-09-09 11:11:11'},{time:'2021-09-19 11:11:13'}]
 *  arr.sort(compare('time','positive'))
 */
// import Big from 'big.js';
export const compare = (arrKey, align) => (a,b) => {
  const v1 = a[arrKey];
  const v2 = b[arrKey];
  var x = new Big(new Date(v1).getTime())
  var y = new Big(new Date(v2).getTime())
  if (align ==='positive') {
    return  x.minus(y)
  } else {
    return  y.minus(x)
  }
}
















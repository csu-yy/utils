// 正则匹配一段html中的img 并返回src的数组
export const regHtml = (htmlStr) => {
  /*const htmlStr = 'aaaaaaaaaaaa\n' +
        '<p>公告内尔东街口打开后精神可嘉大丰收的11</p>↵<p>'+
        '<img class="wscnph" src="../file/file/?fileName=179a4d73f7bf540779ccf8d9a1e9d89bd&amp;isOnLine=true" />'+
        '<img class="wscnph" src="../file/file/?fileName=279a4d73f7bf540779ccf8d9a1e9d89bd&amp" />'+
        '<IMG class="wscnph" src="../file/file/?fileName=379a4d73f7bf540779ccf8d9a1e9d89bd&amp" />'+
        '</p>';*/
  
  const imgReg = /<img.*?(?:>|\/>)/gi;            // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配src属性
  const arr = htmlStr.match(imgReg);              // 所有已成功匹配图片的数组
  const result = [];
  arr && arr.forEach( item => {
    const srcs = item.match(srcReg);  // 获取图片地址
    if (srcs && srcs[1]) {
      // console.log('已匹配的图片地址', srcs[1])
      result.push(srcs[1])
    }
  })
  return result
}
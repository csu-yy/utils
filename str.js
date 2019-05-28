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

// 去掉所有的html标签，只返回文本
export const delHtmlTag = (htmlStr) => {
  return htmlStr.replace(/<[^>]+>/g,"");
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

// 传入XXXX秒 格式化为 00:00:00
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

// 验证el是否在可视区域内
export const elementIsInViewport = (el, offset = 0) => {
  if (!el) { return false; }
  const box = el.getBoundingClientRect(),
        top = (box.top >= 0),
        left = (box.left >= 0),
        bottom = (box.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset),
        right = (box.right <= (window.innerWidth || document.documentElement.clientWidth) + offset);
  return (top && left && bottom && right);
}


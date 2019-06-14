/**
 * @Author:      skyeGao
 * @Email:       yyjzp1314@126.com
 * @DateTime:    2019-06-14 15:42:18
 * @Description: 鼠标事件兼容处理
 */

/* vue 使用示例
const self = this;
this.carouselEle = this.$refs['ebookContent'];
mouseEvent.wheel({
  target: this.carouselEle,
  callback(e, direction){
    if(direction>0){
      self.goUp(e);
    }else{
      self.goDown(e);
    }
  }
})*/

export const mouseEvent = {
  wheel(opt){
    console.log(opt)
    if(!opt.target){
      console.log('error,target缺失');
      return ;
    }
    let callback = opt.callback || function () {};
    let target = opt.target;

    //获取兼容事件
    let mouseWheel=(/Firefox/i.test(navigator.userAgent))?"DOMMouseScroll": "mousewheel";
    
    if (document.attachEvent) { //IE
      document.attachEvent('on'+mouseWheel,function (e) {
        if(e.target.parentElement == target){
          callback(e, e.wheelDelta)
        }
      })
    } else { //FF、Chrome、Opera、safari
      document.addEventListener(mouseWheel,function (e) {
        e = e || window.event;
        if(e.target.parentElement == target){
          if(e.detail){ // FF
            callback(e,e.detail*40)
          }else{
            callback(e,e.wheelDelta)
          }
        }
      })
    }
  }
};

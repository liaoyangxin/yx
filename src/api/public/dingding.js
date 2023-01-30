// import '../../../public/dingtalk'
export default {
  ddShowMenu: function(title, img, url) {
    console.log('title', title)
    console.log('img', img)
    dd.ready(function() {
      dd.biz.navigation.setRight({
        show: true, 
        control: true, 
        text: title, //空字符串表示显示默认文本
        onSuccess: function(result) {
          console.log('result', result)
          dd.biz.util.share({
            type: 0, //分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
            url: url,
            content: '分享的描述',
            title: title,
            image: img,
            onSuccess: function() {
              console.log('?????22222')
            },
            onFail: function(err) {}
          })
        },
        onFail: function(err) {}
      });
    })
  }

}

#9-16

* 添加eStroke.js第23行：if($.cookie('sketchChanged') == 'false')
    $.cookie('sketchChanged',true);
  添加chatWebRTC.js中Reveal.addEventListener('ready', function (event){}内：
  $(".navigate-left").click和$(".navigate-right").click
  添加chat.ejs中ready：$.cookie('sketchChanged',false);
* 注释：chatWebRTC.js中saveImage
* 问题：浏览器console中提示saveImage中未定义callback。不敢改。

* 调整chat.ejs界面布局：chat-layout.css


#9-15

* 调整login.ejs布局
* 同步chat界面中的chat

#9-12

* 历史查看数据响应
  增加响应script，history的post已经测试成功
  historyDetail界面数据渲染没有测试过
  historyDetail中图和markdown没有实现同步

#9-11

* 文件上传
  增加chat.ejs中的script style html元素
* 图标拖拉
  替换原js，增加idangerous.swiper.css
  修改chat.ejs中的css
* 历史详细界面
  增加historyDetail.html
  修改了index.js【加了测试用，有问题】
* 历史界面
  删去detail板块，script还没有来得及修改

#9-10

* 历史记录界面
  大改：history.ejs
* home界面
  修改home.css部分内容
  修改home.ejs部分细节

#9-9

* charts 拖拉效果
  增加：idangerous.swiper.scrollbar-1.2.js 和 idangerous.swiper-1.9.1.min.js
  修改：chat.ejs 中css代码，添加了.charts 到 .chart 之间的几个类；添加charts块和script
* release左右控制器定位
  修改：reveal.js 374行
        reveal.css 244、280、290行
* home界面
  合并home.css

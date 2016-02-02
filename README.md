      也是书到用时方恨少，这不最近业务需求，需要把制作的网页帮用户做成图片然后保存到相册。于是才开始寻找解决方案。现把自己的经验分享出来帮助大家避免一些坑。
      首先找到的解决方案有两个：
      一个是 客户端 截屏的工具html2canvas，早先寻找的例子http://park.jobdeer.com/discussion/22/%E4%BD%BF%E7%94%A8-html2canvas-%E5%AE%9E%E7%8E%B0%E6%B5%8F%E8%A7%88%E5%99%A8%E6%88%AA%E5%9B%BE%E5%B9%B6%E4%B8%8B%E8%BD%BD   
      感谢一切布道者领路人。让程序员如此方便的完善程序，最终让世界如此便捷美好。
      然后遇到了跨域的问题，我们的图片都是传到七牛的，跟服务器不在一个域，导致生成的图片残缺不全，ok，这个倒是好解决。
      我在express写了一个代理，加入特定的路径 'local'，把这部分资源用superagent代理过来，尝试过http-proxy，并没有成功，还是superagent好用，原理就是把请求路径中真正的地址用superagent请求，将响应体直接反馈到界面，这里请求的图片，因而返回的都是图片的buffer,直接用express的res.send()就好。
     这里简单贴下代码，下面会放demo的地址
     app.get('/local/*', function(req, res) {
         var originurl = req.originalUrl;
         originurl = originurl.substr(localname.length);
         superagent
        .get(originurl)
        .end(function(err, response) {
         if (err) {
            //console.log(err);
           } else {
            res.send(response.body);
          }
         });
       })
      跨域的问题解决后发现截得图还是不能完美截图。尝试过背景图和直接放img,原本测试用例都可以，但是真实的例子布局比较复杂可能导致了一些问题，不知道这算不算html2canvas的小小缺陷，之后调整布局就可以得到完美的截图。

       后续的dom操作就是把得到的base64数据放在界面上。这些都没有啥太大问题，但自己在扩展思路的时候又遇到了问题。比如业务需要把图片记录下来方便查询。ok，原本只需要把base64传入后台然后记录。这时候只需要一个小小的ajax发过去，就可以在用户不会感知的情况下记录这张照片。然而事实就是这个文件太大了，以至于根本传不过去，这里如果有知道ajax传入据上线的请告知下。总之就是过不去。
     so 问题又摆在面前了。
     还好nodejs现在发展的对应各种问题都有解决方案。（这边突然想起d2大会，有人请讲师说明node和php不同的时候，讲师只是说了一个构建快速的优点，似乎没有说nodejs对应前端解决方案的方便性是php比不了的。毕竟核心v8=同浏览器）。ok言归正传。然后就直接用webshort了，不要问我怎么这个东西的，瞎翻瞎翻试试就是了。npm就是方便。例子也足够，然后一下子就成了。


   var options = {
    screenSize: {
        width: 320,
        height: 480
    },
    shotSize: {
        width: 320,
        height: 'all'
    },
    siteType: 'html',
    userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
  }
     res.render('pages/userview', {
        info: info,
        title: '定义你的潮流海报！',
        picpath: picpath,
        layout: layoutPath
      }, function(err, html) {
         webshot(html, 'hhh.png',options, function(err) {
            res.send(html);
        });
    })
下面先看看展示结果：（--为我们潮流的大yoho做个宣传）
这个会自动生成一张图片，自然也可以写成同步不影响真正的渲染。然后你可以把这张图用七牛api上传，把返回的地址保存下来，这个数据给运营看，前端界面完全可以继续使用html2canvas，或者嫌麻烦也可以用同一个，不过可能因为需要同步获取链接会导致用户体验上不太友好，无论如何截图功能就已经够完善了。看吧so easy，nodejs在前端看好你哦。
 
顺便再加个小说明：
你那边运行程序看到的结果或许是
也就是webshot截图有问题，原因有两个
一是我用cheerio 只拿到页面的html标签，没有带样式表，可以把样式表的引用放在 你要截取的元素内
二是样式的引用不要放在同一个域比如这里是localhost/5678  要把它放在cdn上最好。

ok enjoy yourself

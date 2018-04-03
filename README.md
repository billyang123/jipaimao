为了支持类似fis的`__inline`和`__sprite`语法（base64和雪碧图），对依赖包`gulp-css-base64`和`gulp-css-spriter`都做了修改，所以暂时保留在node_modules中。你可以不必再下载这两个包。

安装依赖包：
`npm install`

开发：
`gulp dev`

发布：
`gulp`

测试爬虫api接口：http://spider.jipaimall.com/spider/apitest/
```
  proxy('/api',  {
      target: 'http://jp.freedaigou.cn',
      changeOrigin:true
  }),
  proxy('/spider', {
      target: 'http://spider.jipaimall.com',
      changeOrigin:true
  })
```
#### api
- `/spider/api/`  爬虫api

  ```
  params:
    op:001019
    item: v544291122
    category: 2084006142
  ```
- `/api/banner/c/9.html` 幻灯片
- `/api/banner/c/10.html` 底部banner
- `/api/category.html` 列表商品类别
- `/api/hotcat.html` 热门推荐类别
- `/api/hotId.html` 热门推荐ID, 参数 c:所属类别id, 不带参数列出所有
- `/api/announce.html` 公告 ， 带参数 i:公告ID显示详情, 不带参数为列表最新20条
- `/api/shipfee.html` 列表运费

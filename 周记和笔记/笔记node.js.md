# node笔记
#### nodemon工具

```javascript
//解决频繁修改数据，要重启服务器的问题
//全局安装
npm install --global nodemon
//使用
nodemon server.js
```




#### 链接mysql数据库

```javascript
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '*********',
    port: '3306',
    database: 'easynote'
});

connection.connect();

connection.query('select content from note;', function(error, results) {
    if (error) throw error;
    console.log('--------------------------SELECT----------------------------');
    console.log(results);
    console.log('------------------------------------------------------------\n\n');

});
```



#### 通过原生http模块实现

```javascript
http
    .createServer((req, res) => {
        var currentUrl = req.url;
        if (currentUrl == '/') {
            fs.readFile('./view/index.html', 'utf8', (err, data) => {
                if (err) {
                    res.end('出错');
                }
                var htmlStr = template.render(data.toString(), {
                    msgs: msgs
                })
                res.end(htmlStr);
            })
        } else if (currentUrl == '/write') {
            fs.readFile('./view/write.html', 'utf8', (err, data) => {
                if (err) {
                    res.end('出错');
                }
                res.setHeader('content-Type', 'text/html;charset=utf-8');
                res.write(data);
                res.end();
            })
        } else if (currentUrl.indexOf('/public') === 0) {
            if (currentUrl.includes('/css')) {
                res.setHeader('content-Type', 'text/css;charset=utf-8')
            }
            fs.readFile('./' + currentUrl, 'utf8', (err, data) => {
                if (err) {
                    res.end('出错');
                }
                res.write(data);
                res.end();
            })
        } else if (currentUrl.indexOf('/dowrite') == 0) {
            if (req.method == 'POST') {

            } else {
                var paramObj = url.parse(req.url, true).query
                console.log(paramObj)
                var msg = { content: paramObj.content }
                msgs.push(msg)
                res.statusCode = 302
                res.setHeader('Location', '/')
                res.end()
            }
        }
    })

.listen(3000, () => {
    console.log('启动成功 访问http://localhost:3000/');
})
```



#### 使用express框架

```javascript
//安装
npm i -S express

//引入
var (express) = require('express')
```



#### 在express中使用art-template渲染引擎

```javascript
//安装
npm install art-template
npm install express-art-template
//两个都要安装

//引入包
(app).engine('html', require('express-art-template'))

//在html文件中
 {{each meseges}}
<li>
   <a href="/delete?id={{$value.id}}" class="delete">X</a>
   <div class="nr">
      <p id="title" class="title">{{$value.title}}</p>
      <p id="content">{{$value.content}}</p>
   </div>
   <a href="/update?id={{$value.id}}" class="update">
   <i class="fa fa-ellipsis-h"></i>
   </a>
</li>
{{/each}}

//在渲染时
res.render('文件名,html', {
  msgs(html文件中的语句): msgs(要替换的内容)
})
```



#### 用第三方包body-parser来获取POST请求体

```javascript
//安装
npm install body-parser

//在代码文件中配置
(app).use(bodyparser.urlencoded({ extended: false }))
(app).use(bodyparser.json())

//配置完后req会多一个body属性
//在express中通过req.body获得数据
var (msg) = req.body

//GET方式在express中是通过req.query获得数据
var (msg) = req.query
```



#### 重定向

```javascript
//在express中
res.redirect('/')

//在原生中
res.setHeader('Location', '/')
```



#### Express中的路由

```javascript
//在入口文件中
var router = require('./routes/router')//请求
(app).use(router)//挂载使用

//在路由js中
//1.创建路由容器
var router = express.Router()
//2.把路由挂载到容器中
//调用封装API

//请求静态资源
router.use('/public', express.static('./public'))

//渲染首页
router.get('/', (req, res) => {})

//渲染发表页面
router.get('/write', (req, res) => {})

//提交并保存数据
router.post('/dowrite', (req, res) => {})

//删除数据
router.get('/delete', (req, res) => {})

//渲染修改页面
router.get('/update', (req, res) => {})

//提交修改
router.post('/doupdate', (req, res) => {})
//3.把router导出 
module.exports = router
```



#### 封装异步API（回调函数，不懂）

```javascript
var fs = require('fs');
var db = './db.json'

//获取所有数据
exports.find = function(callback) {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) {
            console.log('error')
            return callback(err)
        }
        callback(null, JSON.parse(data).meseges)
    })
}

//添加保存数据
exports.save = function(msg, callback) {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) {
            console.log('error')
            return callback(err)
        }
        var meseges = JSON.parse(data).meseges

        //处理id
        if (meseges.length === 0) {
            msg.id = 1
        } else {
            msg.id = meseges[meseges.length - 1].id + 1
        }

        //把新增数据保存到数组中
        meseges.push(msg)

        //把对转换成字符串
        var ret = JSON.stringify({
            meseges: meseges
        })

        //把字符串写入json文件中
        fs.writeFile(db, ret, function(err) {
            if (err) {
                return callback(err)
            }
            callback()
        })
    })
}

//修改数据
exports.update = function(msg, callback) {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) {
            console.log('error')
            return callback(err)
        }
        var meseges = JSON.parse(data).meseges
        msg.id = parseInt(msg.id)
        var con = meseges.find((item) => {
            return item.id === msg.id
        })
        for (var key in msg) {
            con[key] = msg[key]
        }

        //把对转换成字符串
        var ret = JSON.stringify({
            meseges: meseges
        })

        //把字符串写入json文件中
        fs.writeFile(db, ret, function(err) {
            if (err) {
                return callback(err)
            }
            callback()
        })
    })
}

//根据id获取单个数据
exports.findbyID = function(id, callback) {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) {
            console.log('error')
            return callback(err)
        }
        var meseges = JSON.parse(data).meseges
        var ret = meseges.find((item) => {
            return item.id === parseInt(id)
        })
        callback(null, ret)
    })
}

//删除数据
exports.deletebyID = function(id, callback) {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) {
            console.log('error')
            return callback(err)
        }
        var meseges = JSON.parse(data).meseges
        var deleteid = meseges.findIndex(function(item) {
            return item.id === parseInt(id)
        })
        meseges.splice(deleteid, 1)

        var ret = JSON.stringify({
            meseges: meseges
        })

        //把字符串写入json文件中
        fs.writeFile(db, ret, function(err) {
            if (err) {
                return callback(err)
            }
            callback()
        })
    })
}
```



#### 搜索

```javascript
//在.html中的input后面写上onkeyup="myFunction()"
//onkeyup是键盘按键松开时触发事件
/*<ul id="content" class="list">
{{each meseges}}
<li>
<a href="/delete?id={{$value.id}}" class="delete">X</a>
<div class="nr">
<p id="title" class="title">{{$value.title}}</p>
<p id="content">{{$value.content}}</p>
</div>
<a href="/update?id={{$value.id}}" class="update">
<i class="fa fa-ellipsis-h"></i>
</a>
</li>
{{/each}}
</ul>*/

function myFunction() {
    // 声明变量
    var a, i;
    var input = document.getElementById('myInput');
    var filter = input.value.toUpperCase();
    var ul = document.getElementById("content");
    var li = ul.getElementsByTagName('li');

    // 循环所有列表，查找匹配项
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("p")[0];//通过标签名“p”来遍历每个“li”标签里的第一个<p></p>
        b = li[i].getElementsByTagName("p")[1];//通过标签名“p”来遍历每个“li”标签里的第二上个<p></p>
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1 || b.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
```


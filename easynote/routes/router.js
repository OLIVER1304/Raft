var fs = require('fs')

//引入express
var express = require('express')
var method = require('../public/js/method')

//创建路由容器
var router = express.Router()

//请求静态资源
router.use('/public', express.static('./public'))

//渲染首页
router.get('/', (req, res) => {
    // fs.readFile('./db.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.log('error')
    //         return
    //     }
    //     res.render('index.html', {
    //         meseges: JSON.parse(data).meseges
    //     })
    // })

    method.find((err, meseges) => {
        if (err) {
            console.log('error')
            return
        }
        res.render('index.html', {
            meseges: meseges
        })
    })
})

//渲染发表页面
router.get('/write', (req, res) => {
    res.render('write.html')
})

//提交并保存数据
router.post('/dowrite', (req, res) => {
    var msg = req.body
    console.log(msg)
    method.save(msg, (err) => {
        if (err) {
            console.log('error')
            return
        }
        res.redirect('/')
    })
})


//删除数据
router.get('/delete', (req, res) => {
    {
        method.deletebyID(req.query.id, (err) => {
            if (err) {
                console.log('error')
                return
            }
            res.redirect('/')
        })
    }
})

//渲染修改页面
router.get('/update', (req, res) => {
    method.findbyID(parseInt(req.query.id), (err, msg) => {
        if (err) {
            console.log('error')
            return
        }
        console.log(msg)
        res.render('update.html', {
            meseges: msg
        })
    })
})

//提交修改
router.post('/doupdate', (req, res) => {
    var msg = req.body
    console.log(msg)
    method.update(msg, (err) => {
        if (err) {
            console.log('error')
            return
        }
        console.log(msg)
    })
    res.redirect('/')
})

//把router导出 
module.exports = router
    // app.get('/dowrite', (req, res) => {
    //     var msg = req.query
    //     msgs.unshift(msg)
    //     res.redirect('/')
    // })
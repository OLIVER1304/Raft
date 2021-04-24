var fs = require('fs')
var express = require('express')
var bodyparser = require('body-parser')
var router = require('./routes/router')

var app = express()
app.engine('html', require('express-art-template'))

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use(router)

app.listen(3000, () => {
    console.log('启动成功 访问http://localhost:3000/');
})

module.exports = app
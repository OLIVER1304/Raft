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
const mysql2 = require('mysql2')
const db = mysql2.createPool({
    host:'mysql',
    user:'root',
    password:'1234',
    database:'pretest38'
})
module.exports = db.promise()
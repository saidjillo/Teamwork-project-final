const { Pool, Client } = require("pg");


var conString = "postgres://qiuotljj:OhtfHaRTP6ydqghXDcZ6NAEEV1_OE8na@salt.db.elephantsql.com:5432/qiuotljj" 
var client = new Client(conString);

client.connect();

client.query("SELECT * FROM comments", (err, res)=>{
    if(res){
        console.table(res.rows);
    }
})


module.exports = client;

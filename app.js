const express = require("express");
const bodyParser = require("body-parser");

const employeesRoutes = require("./routes/employees");


// create express app
const app = express();

app.use( (req,ress,next)=>{
   
    ress.setHeader('Access-Control-Allow-Origin', '*');
    ress.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    ress.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
    
});

app.use(bodyParser.json());

// routing
app.use('/api/v1/auth', employeesRoutes);


module.exports = app;






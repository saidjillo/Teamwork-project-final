const jwt = require('jsonwebtoken');
const client = require("../database"); 

const Employee = require("../models/employees");


const user  = new Employee();

exports.verifyToken = (req, res, next)=>{

    try {
        const token  = req.headers.token.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;

        if(userId) {

            user.findOneById(userId)
                .then( (item)=>{
                    next();
                })

                .catch( (error)=>{
                    res.status(401).json({
                        status: "error",
                        error:"User does not exist.",  
                    });
                })

        }else{
            res.status(401).json({
                status: "error",
                error:"Please provide a valid token.",  
            });
        }
     
    } catch  {
        res.status(401).json({
            status: "error",
            error:"Invalid Request",  
        });
    }

}

exports.isAdmin = (req, res, next) => {
    try {

        const token  = req.headers.token.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;

        if(userId) {

            user.findOneById(userId)
                .then( (item)=>{
                    
                    if(item.jobrole == 'admin'){
                        next();
                    }else {
                        res.status(401).json({
                            status: "error",
                            error:"Unauthorized Request",  
                        });
                    }
                })

                .catch( (error)=>{
                    res.status(401).json({
                        status: "error",
                        error:"User does not exist.",  
                    });
                })

        }else{
            res.status(401).json({
                status: "error",
                error:"Please provide a valid token.",  
            });
        }

    } catch (error) {
        res.status(401).json({
            status: "error",
            error:"Invalid Request",  
        });
    }
};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employees = require("../models/employees");

const employee = new Employees();


exports.signup = (req, res, next)=>{

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        jobRole: req.body.jobRole,
        department: req.body.department,
        address: req.body.address,
    };
 
    employee.save(user)
        
        .then( (result)=>{
     
            res.status(201).json( {
                status: "success",
                data: {
                    message: "User account successfully created",
                    token: "string",
                    userId: result.userid,
                    firstName: result.firstname,
                    lastName: result.lastName,
                    email: result.email,
                    gender: result.gender,
                    jobRole: result.jobRole,
                    department: result.department,
                    address: result.address,
                    error: false
                }
        
            });
        })

        .catch( (error)=>{
            res.status(500).json({
                status: "unsuccessful",
                data: {
                    error: "Email or password is not correct",
                }
            });
        });

};



exports.login = (req, res, next) =>{

    employee.findOne(req.body.email)
        
        .then( (user)=>{

            if(!user){
                return res.status(401).json({
                    
                    status: "unsuccessful",
                    data: {
                        error: "User not found",
                    }
                })
            }

            bcrypt.compare(req.body.password, user.password)
                .then( (valid)=>{

                    if(!valid){
                      
                        return res.status(401).json({
                            status: "unsuccessful",
                            data: {
                                error: "Email or password is not correct",
                            }
                            
                        });
                        
                    }

                    const token = jwt.sign(
                        {userId: user.userId},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: '24h'});
            
                    res.status(200).json({
                        status: "success",
                        data: {
                            token: token,
                            userId: user.userid
                        }
                    });

                })

                .catch( (error)=>{
                    return res.status(500).json({
                        status: "unsuccessful",
                        data: {
                            error: "Email or password is not correct",
                        }
                    });
                });
        })


        .catch( (error)=>{
            return res.status(500).json({
                status: "unsuccessful",
                data: {
                    error: "Something went wrong. Try again lator",
                }
               
            });
        });



}



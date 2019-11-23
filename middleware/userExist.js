const Employee = require("../models/employees");

const employee = new Employee();


module.exports = (req, res, next)=>{
    try {
        
        employee.findOne(req.body.email)
            .then( (user)=> {
                if(user){
                    return res.status(401).json({
                        status: "error",
                        error:"user with that email address already exist.",          
                    });                 
                }else{       
                    next();
                }
            })

            .catch( (error)=>{
                return res.status(500).json({
                    status: "error",
                    error:"Error processing your request, Please try again later.",          
                });  
            })


    } catch  {
        res.status(401).json({
            status: "error",
            error:"Invalid Request",   
        });
    }
}
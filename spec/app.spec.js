const request = require("request");

describe("Teamwork API", ()=>{


    it("should create an employee", function(done) { 
        const data = {
            firstName: "Saidjillo",
            lastName: "DevC",
            email: "AndelaDevC@gmail.com",
            password: "AndelaDevC2019",
            gender: "male",
            jobRole: "admin",
            department: "Sales",
            address: "2255555555",
        };

        request({ 
        
            method:'POST', 
        
            uri: "http://localhost:3000/api/v1/auth/create-user", 
        
            json:data 
        
        },function(error, response, body){ 
                    expect(response.statusCode ).toBe(201);  
                    done();       
            }); 
        
    }); 
        

});



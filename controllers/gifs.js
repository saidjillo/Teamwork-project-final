const Gif = require('../models/gif');
const client = require("../database"); 
var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'bck-kenya-limited', 
    api_key: '499968837811942', 
    api_secret: 'DzEfICvkWoPGvFGCQ5YHrOsbsNo' 
});

const gif = new Gif();


exports.createGif = (req,res,next) =>{

    let date = new Date();
    let params = [req.body.imageUrl,
        req.body.title, 
        date.toDateString(),
        req.body.userId];

        
    try {

        //upload image to cloudinary
        cloudinary.uploader.upload(req.body.imageUrl, (err, respo)=>{
            if(respo) {
                client.query( 
                    'INSERT into gifs (imageUrl, gifTitle, createdOn, createdBy) VALUES($1, $2, $3, $4) RETURNING gifId', 
                     params)
        
                    .then( (resp)=>{
                        let id =  resp.rows[0].gifid;
                        client.query("SELECT * FROM gifs WHERE gifId = $1", [id])
                            .then( (item)=>{
                                res.status(201).json({
                                    status: "success",
                                    data: {
                                        gifId: item.rows[0].gifid,
                                        message: "Gif image successfully posted",
                                        createdOn: item.rows[0].createdon,
                                        title: item.rows[0].giftitle,
                                        imageUrl: item.rows[0].imageurl,
                                        createdBy: item.rows[0].createdby
                                    }
                                    
                                }); 
                            })
                
                    })
            
                    .catch( (error)=>{
                        res.status(401).json({
                            status: "error",
                            error: "Request was not successful. Please try again later.",  
                        });
                    })
            }
        });
 
    }catch (error) {
        res.status(500).json({
            status: "error",
            error: "Error posting Gif image", 
            })
    };
      
};



exports.getAllGifs = (req,res,next)=>{

    gif.find()

        .then( (items)=>{
            res.status(200).json({
                status: "success",
                data: items        
            });
        })

        .catch( (error)=>{
            res.status(404).json({
                status: "error",
                error: "Error loading gifs from the database."
            })
        });

};

exports.getOneGif = (req, res, next)=>{

    gif.findOne(req.query.gifId)
       
      .then( (item)=>{
          res.status(200).json({
            status: "success",
            data: {
                id: item.gifid,
                createdOn: item.createdon,
                title: item.giftitle,
                url: item.imageurl,
                comments: []          
            }
          });
       })
       
       .catch( (error)=>{
          res.status(404).json({
            status: "error",
            error:"Gif image could not be found",
          });
       });

};


exports.deleteGif = (req, res, next)=>{

    let url = req.body.imageUrl;
    let image_name = req.body.imageUrl.substring(url.lastIndexOf('/')+1);
    let public_id = image_name.split('.')[0];

    // delete gif from cloudinary
    cloudinary.uploader.destroy(public_id, (err, result)=>{
        
        if(result.result == 'ok'){
           
            gif.deleteOne(req.query.gifId)
        
                .then( ()=>{
                    res.status(201).json({
                        status: "success",
                        data: {
                            message: "Gif image successfully deleted",
                        }
                    });
                })
        
                .catch( (error)=>{
                    res.status(404).json({
                        status: "error",
                        error: "Gif image could not be deleted.", 
                    })
                });

        }else {
            res.status(500).json({
                status: "error",
                error: "ERROR deleting Gif image.", 
            })
        }

        if(err) {
            res.status(500).json({
                status: "error",
                error: "ERROR deleting Gif image.", 
            })
        }

    });


};





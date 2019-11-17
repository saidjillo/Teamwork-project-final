const Article = require('../models/articles');
const client = require("../database"); 

const article = new Article();


exports.createArticle = (req,res,next) =>{

    let date = new Date();
    let params = [ req.body.title,
        req.body.article,
        date.toDateString(),
        req.body.userId];

        
    try {
        client.query( 
            'INSERT into articles (title, article, createdOn, createdBy) VALUES($1, $2, $3, $4) RETURNING articleId', 
                params)

        .then( (resp)=>{
            let id =  resp.rows[0].articleid;
            client.query("SELECT * FROM articles WHERE articleid = $1", [id])
                .then( (item)=>{
                    res.status(201).json({
                        status: "success",
                        data: {
                            message: "Article successfully posted",
                            articleId: item.rows[0].articleid,
                            createdOn: item.rows[0].createdon,
                            title: item.rows[0].title,
                            article: item.rows[0].article,
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

           
    
    }catch (error) {
        res.status(500).json({
            status: "error",
            error: "Error posting Article", 
            })
    };
    
     
};


exports.deleteArticle = (req, res, next)=>{
    console.log(req.query.articleId);
    article.deleteOne(req.query.articleId)
        
        .then( ()=>{
            res.status(201).json({
                status: "success",
                data: {
                    message: "Article successfully deleted",
                }
            });
        })

        .catch( (error)=>{
            res.status(404).json({
                status: "error",
                error: "Article could not be deleted.", 
            })
        });
};



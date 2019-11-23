const Article = require('../models/articles');
const Comment = require('../models/commentsArticles');
const client = require("../database"); 

const article = new Article();
const comment = new Comment();


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

exports.getOneArticle = (req, res, next)=>{
    
    article.findOne(req.query.articleId)
       
      .then( (item)=>{

         
            client.query("SELECT * FROM comments WHERE articleId = $1", [item.articleid])
            .then( (full_item)=>{

                console.table(full_item.rows);
                res.status(200).json({
                    status: "success",
                    data: {
                        id: item.articleid,
                        createdOn: item.createdon,
                        title: item.title,
                        article: item.article,
                        comments: full_item.rows              
                    }
                });

            })

       })
       
       .catch( (error)=>{
          res.status(404).json({
            status: "error",
            data: {
                message: "Article could not be found",
            }
          });
       });

};


exports.modifyArticle = (req, res, next)=>{

    let request_article = {
        title: req.body.title,
        article: req.body.article,
        userId: req.body.createdby
    }
  
    try {
        client.query(
            "UPDATE articles SET title=($1), article=($2) WHERE articleId=($3) RETURNING articleId",
            [request_article.title, request_article.article, req.query.articleId])
    
            .then( (modItem)=>{
            
               
                res.status(201).json({
                    status: "success",
                    data: {
                        id: req.query.articleId,
                        title: request_article.title,
                        article: request_article.article,
                        comments: [
                            {
                                commentId:"",
                                comment: "",
                                authorId: ""
                            },
                        ] ,
                        error: false
                    }
                    });
                            
            })
    
            .catch( (error)=>{
                res.status(500).json({
                    status: error,
                    error: "Error fetching the updated article."               
                });
            });

    } catch (error) {
        res.status(401).json({
            status: error,
            error: "Article could not be updated"               
        });
    }
       

};


exports.deleteArticle = (req, res, next)=>{
   
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


exports.getAllArticles = (req,res,next)=>{

    article.find()

        .then( (items)=>{
            res.status(200).json({
                status: "success",
                data: items        
            });
        })

        .catch( (error)=>{
            res.status(404).json({
                status: "error",
                error:  "Error loading articles from the database."
            })
        });

};



exports.getAllArticlesEmployeeSpecific = (req,res,next)=>{

    article.findEmployeeSpecific(req.query.userId)

        .then( (items)=>{
            res.status(200).json({
                status: "success",
                data: items        
            });
        })

        .catch( (error)=>{
            res.status(404).json({
                status: "error",
                data: {
                    message: "Error loading articles from the database.",
                }
            })
        });

};


exports.createComment = (req, res, next)=> {
    
    const comment_obj = {
        authorId: req.body.authorId,
        articleId: req.query.articleId,
        comment: req.body.comment
    };

    let date = new Date();
    let params = [
        comment_obj.comment,
        comment_obj.authorId,
        comment_obj.articleId,        
        date.toDateString()
    ];

    try {
        client.query( 
            'INSERT INTO comments (comment, authorId, articleId, createdOn) VALUES ($1, $2, $3, $4) RETURNING commentId', 
             params)

            .then( (resp)=>{
                let id =  resp.rows[0].commentid;
                client.query("SELECT * FROM comments WHERE commentId = $1", [id])
                    .then( (item)=>{
                        res.status(201).json({
                            status: "success",
                            data: item.rows[0]
                        });  
                    })   
            })

            .catch( (error)=>{
                res.status(500).json({
                    status: "error",
                    error:  "Posted successfully. Please refresh page."
                })
            });


    } catch (error) {
        res.status(404).json({
            status: "error",
            error: "Error posting your comment."
        })
    }
  
};

exports.deleteComment = (req, res, next) =>{

    client.query("DELETE FROM comments WHERE commentId = $1", [req.body.commentId])
        .then( (resp)=>{
            res.status(201).json({
                status: "success",
                data: {
                    message: "Comment deleted successfully."
                }
            })
        })

        .catch( (error)=> {
            res.status(404).json({
                status: "error",
                error: "Error deleting your comment."
            })
        });
        
};

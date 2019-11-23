class Comment {

 
    constructor() {
        this.client = require("../database");      
        this.createTable();
        // this.dropTable();   
    }

    // create table comments if it does not exist
    createTable() {
        this.client.query(
            "CREATE TABLE IF NOT EXISTS comments(commentId SERIAL,comment varchar(255) NOT NULL,authorId int NOT NULL, articleId int NOT NULL, createdOn varchar(255) NOT NULL ,PRIMARY KEY (commentId))");
    }

    // drop table comments ---- ONLY FOR DEVELEOPMENT PURPOSES AND SHOULD NOT BE USED IN PRODUCTION
    dropTable() {
        this.client.query("DROP TABLE comments");
    }


    // // create new comment and save into the databse
    save(comment_obj) {

        let date = new Date();
        let params = [
            comment_obj.comment,
            comment_obj.authorId,
            comment_obj.articleId,        
            date.toDateString()
        ];

        console.table(params);
        this.client.query( 
            'INSERT INTO comments (comment, authorId, articleId, createdOn) VALUES ($1, $2, $3, $4) RETURNING commentId', 
             params)

        .then( (res)=>{
            let id =  res.rows[0].commentid;
            this.client.query("SELECT * FROM comments WHERE commentId = $1", [id])
                .then( (item)=>{
                    console.log(item.rows[0]);
                    return item.rows[0];   
                })   
        })

        .catch( (error)=>{
            console.log(error);
        });
                                          
    }


    // delete one comment from the database with the specified id
    async deleteOne(id) {
        this.client.query("DELETE FROM comments WHERE commentId = $1", [id])
            .the
        return true;
    }

    
    // return all comments from database order by most recent items
    async find(articleId) {
        let comments = await this.client.query("SELECT * FROM comments WHERE articleId= $1 ORDER BY commentId DESC", [articleId]);
        return comments.rows;
    }


}


module.exports = Comment;
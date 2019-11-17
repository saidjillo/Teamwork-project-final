class Articles {

 
    constructor() {
        this.client = require("../database");      
        this.createTable();
        // this.dropTable();   
    }

    // create table articles if it does not exist
    createTable() {
        this.client.query(
            "CREATE TABLE IF NOT EXISTS articles(articleId SERIAL,title varchar(255) NOT NULL,article varchar(3000) NOT NULL,createdOn varchar(255) NOT NULL ,createdBy int NOT NULL,PRIMARY KEY (articleId))");
    }

    // drop table articles ---- ONLY FOR DEVELEOPMENT PURPOSES AND SHOULD NOT BE USED IN PRODUCTION
    dropTable() {
        console.log("DELETING TABLE....");
        this.client.query("DROP TABLE articles");
    }


    // // create new article and save into the databse
    save(article_obj) {

        let date = new Date();
        let params = [article_obj.title,
            article_obj.article, 
            date.toDateString(),
            article_obj.userId];

        this.client.query( 
            'INSERT into articles (title, article, createdOn, createdBy) VALUES($1, $2, $3, $4) RETURNING articleId', 
             params)

        .then( (res)=>{
            let id =  res.rows[0].articleid;
            this.client.query("SELECT * FROM articles WHERE articleid = $1", [id])
                .then( (item)=>{
                    console.log(item.rows[0]);
                    return item.rows[0];   
                })
       
        })
                                          
    }

    // return one article from the database
    async findOne(id){
        let article = await this.client.query("SELECT * FROM articles WHERE articleId= $1", [id]);
        return article.rows[0];
    }

    // delete one article from the database with the specified id
    async deleteOne(id) {
        this.client.query("DELETE FROM articles WHERE articleId = $1", [id]);
        return true;
    }


}


module.exports = Articles;
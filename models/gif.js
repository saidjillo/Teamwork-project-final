class Gif {

 
    constructor() {
        this.client = require("../database");      
        this.createTable();
        // this.dropTable();   
    }

    // create table gifs if it does not exist
    createTable() {
        this.client.query(
            "CREATE TABLE IF NOT EXISTS gifs(gifId SERIAL, gifUrl varchar(255) NOT NULL,gifTitle varchar(3000) NOT NULL,createdOn varchar(255) NOT NULL ,createdBy int NOT NULL,PRIMARY KEY (gifId))");
    }

    // drop table gifs ---- ONLY FOR DEVELEOPMENT PURPOSES AND SHOULD NOT BE USED IN PRODUCTION
    dropTable() {
        this.client.query("DROP TABLE gifs");
    }


    // // create new article and save into the databse
    save(gif_obj) {

        let date = new Date();
        let params = [gif_obj.gifUrl,
            gif_obj.title, 
            date.toDateString(),
            gif_obj.userId];

        this.client.query( 
            'INSERT into gifs (gifUrl, gifTitle, createdOn, createdBy) VALUES($1, $2, $3, $4) RETURNING gifId', 
             params)

        .then( (res)=>{
            let id =  res.rows[0].articleid;
            this.client.query("SELECT * FROM gifs WHERE gifId = $1", [id])
                .then( (item)=>{
                    return item.rows[0];   
                })
       
        })
                                          
    }

    // return one gif from the database
    async findOne(id){
        let gif = await this.client.query("SELECT * FROM gifs WHERE gifId= $1", [id]);
        return gif.rows[0];
    }


    // Update and return one gif from the database
    async updateOne(id, gif){
       
        this.client.query(
            "UPDATE gifs SET gifUrl=($1), gifTitle=($2) WHERE gifId=($3)",
            [gif.title, article.gifUrl, id])

            .then( (result)=> {

                if(result.rowCount > 0) {
                    return true;
                }else {
                    return false
                }
              
            })

            .catch( (error)=>{
                return new Error("Gif item could not be updated.")
            });

    }

    // delete one gif from the database with the specified id
    async deleteOne(id) {
        this.client.query("DELETE FROM gifs WHERE gifId = $1", [id]);
        return true;
    }

    
    // return all gifs from database order by most recent items
    async find() {
        let gifs = await this.client.query("SELECT * FROM gifs ORDER BY gifId DESC");
        return gifs.rows;
    }

    // return all gifs from database belonging to specific employee order by most recent items
    async findEmployeeSpecific(userId) {
        let gifs = await this.client.query("SELECT * FROM gifs WHERE createdBy = $1 ORDER BY gifId DESC", [userId]);
        return gifs.rows;
    }


}


module.exports = Articles;
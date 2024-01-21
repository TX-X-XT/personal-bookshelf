import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"books",
    password: "",
    port:"5432",
});
db.connect();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items = [
    {id:1, title: "A good book", isbn: 11, review: "Good", rating: 5},
    {id:1, title: "A good book", isbn: 11, review: "Good", rating: 5},
];

app.get("/", async (req,res)=>{
   try{

       const result = await db.query("SELECT * FROM books ORDER BY id ASC");
       items = result.rows;
       res.render("index.ejs",{
           listItems: items,
       });

   }
    catch(err){
       console.log(err);
    }
});

app.get("/add", async (req,res)=>{
    try{
        res.render("add.ejs")
    }
    catch(err){
        console.log(err);
    }

});

app.post("/submit", async(req, res)=>{
    let title = req.body.title;
    let isbn = req.body.isbn;
let review = req.body.review;
let rating = req.body.rating;
try{
    await db.query("INSERT INTO books (title, isbn, review, rating) values ($1, $2, $3, $4)", [title, isbn, review, rating]);
    console.log(title);
    console.log(isbn);
    console.log(review);
    console.log(rating);
    res.redirect("/");
}
catch(err){
console.log(err);

}


});


app.post("/delete", async (req, res) => {
    const itemId = req.body.deleteItemId;
    try {
        await db.query("DELETE FROM books WHERE id = $1", [itemId]);
        console.log(`Deleted item with ID: ${itemId}`);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});



    app.listen(port,()=>{
        console.log(`Server running on port ${port}`);
});
//jshint esversion:6
//RESTFUL 

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Mongoose
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

// Creates the schema of posts
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Creates the model for the mongoose
const Article = mongoose.model("Article", articleSchema);


// Route for singular request
// You use the postman to get the article with the title of REST for example or if there's a space, %20 = represents a space for example in Jack Bauer
app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if (foundArticle) {
        res.send(foundArticle)
      } else {
        res.send("No articles matching that title was found.")
      }
  });
})

// the same route as the :articleTitle this is the update / put which overwrites everything for something new
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if (!err){
      res.send("Successfully updated article!")
    }
  }
);
})

// it updates only one part of it - ONLY IF I WANT TO CHANGE ONE PART AN D NOT ALL
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    // this $set: req.body updates only one part of the article, either content or title
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Sucessfully updated article.")
      } else {
        res.send(err);
      }
    }
  )
})

// DELETE request - ONLY ONE
.delete(function(req, res){
  Article.deleteOne(
  {title: req.params.articleTitle},
  function(err){
    if(!err){
      res.send("Sucessfully deleted article")
    } else {
      res.send(err)
    }
  }
);
});


//DOES a lot of things on the same /articles - chaining methods
app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err){
      res.send(foundArticles)
    } else {
      res.send(err)
    }
  })
})

.post(function(req, res){
  // this part is connected to the postman key and value
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  // the callback is necessary so it finishes the process
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Sucessfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});




app.listen(3000, function(){
  console.log("Server started on port 3000")
});

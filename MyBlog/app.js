var express = require("express"),
    methodOverride = require("method-override");
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer");

    mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true});
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));
    mongoose.set('useFindAndModify', false);

    // Mongoose Model config
    var blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created:{type: Date, default:Date.now}
    });

    var Blog = mongoose.model("Blog",blogSchema);

    // Blog.create({
    //     title:"Test Blog",
    //     image:"https://images.unsplash.com/photo-1509515837298-2c67a3933321?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80",
    //     body: "This is a test blog post"
    // });


    // Restful routes

    //Index Route
    app.get("/blogs",function(req,res){
        Blog.find({},function(err,blogs){
            if(err){
                console.log("ERROR!");
            }else{
                res.render("index",{blogs:blogs});
            }
        })
    });

    // New Route
    app.get("/blogs/new", function(req,res){
      
        res.render("new");
    });

    app.post("/blogs",function(req,res){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        // Create a blog
        Blog.create(req.body.blog,function(err,newBlog){
            if(err){
                res.render("new");
            }else{
                res.redirect("/blogs");
            }

        })


    })
    //Show Route
    app.get("/blogs/:id",function(req,res){
     Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
     })

    });

    //Edit Route
    app.get("/blogs/:id/edit",function(req,res){
        Blog.findById(req.params.id,function(err,foundBlog){
            if(err){
                res.redirect("/blogs");
            }else{
                res.render("edit",{blog:foundBlog});
            }
        })
    });

    app.put("/blogs/:id",function(req,res){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
            if(err){
                res.redirect("/blogs");
            }else{
                res.redirect("/blogs/" + req.params.id);
            }
        });
        
    });
// Delete Route
    app.delete("/blogs/:id",function(req,res){
       // Destroy and redirect
       Blog.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/blogs");
            }
            res.redirect("/blogs");
       });

    });
    app.get("/",function(req,res){
        res.redirect("/blogs");
    });

    app.listen(8080,"127.0.0.1",function(){
        console.log("The Blog server has started!");
        });
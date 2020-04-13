var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create({
//     name: "Granite Hill",
//     image: "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c722779d6974dcd51_340.jpg",
//     description: "This is a huge granite hill."

// },function(err,campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Newly created campground: ");
//         console.log(campground);
//     }
// });


app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index",{campgrounds:allCampgrounds});
        }
    })
})


app.get("/",function(req,res){
    res.render("landing");
})



// Create
app.post("/campgrounds",function(req,res){
     // Get data from form and add to camp ground array
    // Redirect back to campgrounds page
    var name = req.body.name;
    var url = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name,image:url,description:desc};
    // Create a new campground and save to database
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }

    });  
});

//NEW - show form to create new campgrounds
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});
// SHOW - shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show",{campground:foundCampground});
        }
    });
    
});

app.listen(8080,"127.0.0.1",function(){
console.log("The YelpCamp server has started!");
});
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Blog = require("./Models/blog");

const cookieParser = require("cookie-parser");
const { checkForAuthenticationToken } = require("./middlewares/authentication");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(e=>console.log("MongoDB connected.."))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationToken("token"))
app.use(express.static(path.resolve("./public"))); //tells express to statically serve all in public..as uploads is not route(as default thought of express)



app.get("/", async(req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, ()=>console.log(`Server started at PORT:${PORT}`));
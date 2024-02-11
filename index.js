const express = require("express");
let app = express();
const path = require("path");
const method = require("method-override");
const mongoose = require("mongoose");
const User = require("./models/schema.js");
app.listen(8080, () => {
    console.log("server is runing");
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(method("_method"));
app.use(express.urlencoded({ extended: true }));
const ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/junaid");
}
main().then(() => {
    console.log("DB_connected");
}).catch((err) => {
    console.log(err);
});
app.get("/", (req, res) => {
    res.send("home page");
});
app.get("/listings", async (req, res) => {
    const list = await User.find({});
    res.render("index.ejs", { list });
});
app.get("/listings/new", (req, res) => {
    res.render("newlist.ejs");
});
app.post("/listings", async (req, res) => {
    const data = req.body;
    const user1 = new User(data);
    await user1.save();
    console.log("data is pushed");
    res.redirect("/listings");

});
app.get("/listings/edit/:id",  async(req,res)=>{
    let {id} = req.params;
    let editlist = await User.findById(id);
    res.render("editlist.ejs", { editlist });

});
app.patch("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const data = req.body;
    await User.findByIdAndUpdate(id,  data ,{new:true , runValidators:true});
    res.redirect("/listings");
});

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const list = await User.findById(id);
    res.render("showlist.ejs", { list });
});
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const list = await User.findByIdAndDelete(id);
    res.redirect("/listings");
});





const express = require("express");
const app = express();
const cookieParser =require("cookie-parser")

app.use(cookieParser("secretcode"));

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "hello"); // try only this line
    res.send("sent you some cookie");
});

// app.get("/getsigned", (req,res)=>{
//     res.cookie("made","indu",{signed:true});
//     res.send("signed cookie")
// })

app.get("/getcookies", (req  ,res)=>{
    res.cookie("greet","hello");
    res.cookie("india","hii");
    res.send("sent you some cookie");
});

app.get("/greet", (req, res) => {
    let { name = "anonymous" } = req.cookies;
    res.send(`hi, ${name}`);
});


app.get("/" ,(req,res)=>{
    res.send("this is the main page")
})

app.listen(3000,()=>{
    console.log("server is ready in 3000")
});
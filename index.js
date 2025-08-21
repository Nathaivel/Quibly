const express = require("express")
const path = require("path");
const utils = require("./utils.js");
const db = require("./databaseops.js");
const cors = require("cors");
const middleware = require("./middlewares.js");
const cookie_parser = require("cookie-parser");

app = express()

app.use(cookie_parser())	
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"./public/")));

app.get("/",middleware.validateToken,(req,res,next) => {
    res.send(`okay user: ${req.uid}`);	
    next();
});

app.get("/user",middleware.validateToken,(req,res,next) => {
	res.json([{"uid":req.uid}]);
	next();
})
app.get("/user/:uid",async (req,res,next) => {
        user = await db.getUser(req.params.uid);
	posts = await db.getPosts(`WHERE person_id=${req.params.uid}`);


	response = `
	<h1>${user[0].username}</h1><div>`

	if (posts[0] != undefined){
		for (p of posts){
			response += `<h3>${p.title}</h3><p>${p.body}</p>`
		}
	}
	response += "</div>"

	res.send(response);
	next()
})
app.get("/api/feed",middleware.validateToken,async (req,res,next) => {
	data = await db.getPosts()
        res.json(data);
	next();
});

app.get("/signup",(req,res,next) => {
	console.log(req.cookies);
	res.sendFile(path.join(__dirname,"./public","signup.html"));
	next();
});

app.post("/api/login",db.validateUser,(req,res ,next) => {
	/*
        data = req.body;
	console.log("hello",data);
	
	hash = utils.createHash(data.username,data.password);
	isValid = db.validateUser(data.username,hash);

	if (isValid[0]){
		console.log('Success');
		res.cookie('token',middleware.generateToken());
		next()

	}else{
		res.send("Log in failure");
		next();
	}
	*/


});

app.get("/api/user/:uid",async (req,res,next) => {
	uid = req.params.uid
	console.log(uid)
	user = await db.getUser(uid);
	res.json(user);
	next();


})
app.post("/api/user",(req,res,next) => {
	data = req.body;
        console.log(data);

	hash = utils.createHash(data.username,data.password);
	db.addUser(data.username,hash);
	next();
});


app.post("/api/post",middleware.validateToken,(req,res,next) => {
	const post = req.body;
	db.addPost(req.uid,post);
	res.send("Added post");
	next();
});

app.put("/api/post",middleware.validateToken,async (req,res,next) => {
	attr = req.query;
	console.log(attr);

	if(attr.like != null){
		pid = attr.like;
		await db.postsAddLike(req.uid,pid);
	}
	next();
})

app.listen(3000,'0.0.0.0',()=>{console.log("running at http://localhost:3000/signup")});

const sqlite3 = require("sqlite3").verbose();
const utils = require("./utils.js");
const middleware = require("./middlewares.js")
const users = new sqlite3.Database("database/users.db");

async function getdbData(select,from){
	return new Promise((reject,resolve) => {
		users.all(`SELECT ${select} FROM ${from};`,(err,data) => {                                                    if (err){
                        reject(err);
                }else{
                    //console.log(data.length);  
	            resolve(data);
		}                                             
	   });
	});
}


async function addUser(username,password){
	last_uid =  await getdbData("*","user").then(last_uid => { return last_uid.length } ).catch(err => {return err});

	last_uid = last_uid.length


	console.log(last_uid);


	users.run("INSERT INTO user(uid,username,password) VALUES (?,?,?);",[last_uid + 1,username,password])

	console.log("Added user: ",username);
}

async function validateUser(req,res,next){
	username = req.body.username
	res.cookie("ready","ready")
	hash = utils.createHash(username,req.body.password)

	lock = await getdbData("password,uid",`user WHERE username LIKE '${username}'`).then(lock => { return lock }).catch(err => {return err});

	console.log("the lock is: ",lock);
	if(lock.length < 1){
		console.log("Username not found");
		res.json({"msg":"Log in failed","code":0});
		//next();
	}else if(hash === lock[0].password){
		console.log("Logged in as:",username)
		token = {"token":middleware.generateToken(lock[0].uid),"uid":lock[0].uid};
		res.cookie("token",token,{
			httpOnly: false,
			secure: true,
			sameSite: 'none'
		});
		res.json({"msg":"Login success","code":1});

		//next();
	}else{
		console.log("Password/Username Incorrect")
		res.json({"msg":"Login failed","code":0});

		//next();
	}

}

async function getUser(user_id){
	user = await getdbData("*",`user WHERE uid=${user_id}`).then(userdata => { return userdata }).catch(err => { return err });
	return user
}

updater = (table,cmd,target) => {
	users.run(`UPDATE ${table} SET ${cmd} WHERE ${target}`);
}

async function postsAddLike(user_id,post_id){
        post_likes = await getdbData("likes",`posts WHERE id=${post_id}`).then(likes => { return likes }).catch(err => { return err });

	post_likes = post_likes[0].likes;

	if(post_likes == null){
		updater("posts",`likes="[${user_id}]"`,`id=${post_id}`);

	}else{
		post_likes = JSON.parse(post_likes);
		post_likes.push(user_id);
		updater("posts",`likes="${JSON.stringify(post_likes)}"`,`id=${post_id}`);
	}


}

async function addPost(user_id,post){
	last_post_id = await getdbData("*","posts").then(last_post_id => { return last_post_id.length }).catch(err => { return err }).then(len => {return len.length });

	time_of_post = new Date()

	
	users.run(`INSERT INTO posts(id,title,body,person_id,timestamp) VALUES (${last_post_id + 1},"${post.title}","${post.body}",${user_id},'${time_of_post.toISOString()}');`);
}

async function getPosts(opcmd = ""){
	get_post_list = await getdbData("*",`posts ${opcmd}`).then(posts => { return posts }).catch(err => { return err });

        new_list = []
	if (get_post_list[0] == undefined){
		return get_post_list
	}

	for (p of get_post_list){
		username = await getUser(p.person_id)
		p["username"] = username[0].username;
		new_list.push(p)

	}

	return new_list;
}

exports.getPosts = getPosts;
exports.addPost = addPost;
exports.postsAddLike = postsAddLike;
exports.getUser = getUser;
exports.addUser = addUser;
exports.validateUser = validateUser;

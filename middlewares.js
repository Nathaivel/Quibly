const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret = "open_sesame";

function generateToken(uid,username){
	//secret = crypto.randomBytes(64).toString('hex');
	token = jwt.sign({"uid":uid},secret);
	return token;
}

function validateToken(req,res,next){
	const token = req.cookies?.token

	if(!token){
		return res.status(401).send("Token not found");
		next();

	}

	jwt.verify(token.token,secret,(err,uid) => {
		if (err){
			res.send(err);
		}
		req.uid = uid.uid
		next();
	});
}

exports.generateToken = generateToken;
exports.validateToken = validateToken;

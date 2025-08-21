const crypto = require("crypto");

function createHash(username,password){
	hash = crypto.scryptSync(password,username,64).toString('hex');
	return hash;
}

exports.createHash = createHash


pass = document.getElementById("password");
user = document.getElementById("username");

async function postData(password,username){
	await fetch("/api/user",{
		method: "POST",
		headers : {
			'Content-Type':'application/json'
		},
		body: JSON.stringify({"username":username,"password":password})
	});

	alert("Signup success");
}

document.getElementById("signup").addEventListener("submit",(e) => {
	alert(pass.value + user.value);
	postData(pass.value,user.value);
	window.location.href = "/login.html";

})

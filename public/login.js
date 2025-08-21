const username = document.getElementById("username");
const password = document.getElementById("password");

document.getElementById("login-form").addEventListener("submit",async (e) => {
	//alert("Hello "+username.value);

	u = await fetch("/api/login",{
		method: "POST",
		headers: {
			"Content-Type":"application/json"
		},
		body: JSON.stringify({"username":username.value,"password":password.value})
	}).then(response => {return response.json()}).catch(err => {return err});

	alert(u.msg);

	if(u.code == 1){
		
		window.location.href = "/feed.html";
	}

});

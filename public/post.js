const title = document.getElementById("title");
const body = document.getElementById("body");


async function post(){
	data = {"title":title.value,"body":body.value}

        req = await fetch("/api/post",{
		method: "POST",
		headers: {
			'Content-Type':'application/json'
		},
		body: JSON.stringify(data)
	}).then(res => { return res.text() }).catch(err => { return err })

	alert(`Post saved as ${req}`);
	window.location.href = "/feed.html";
}

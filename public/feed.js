hexpool = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']




svg = {
	like_active: `<svg height="25" width="25" viewBox="0 0 640 640"><path fill="#d166ce" d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"/></svg>`,
	like_inactive: `<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#d166ce" d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/></svg>`

}

function warp(i){
  return i % 15
}

function turn(name){
  hex = "#"
  
  
  for(x=0;x < 6;x++){
    charcode = name.charCodeAt(x % name.length)
    hex += hexpool[warp(charcode)]
  }
  return hex
}

async function getuser(){
        uid = await fetch("/user").then(res => { return res.json() }).catch(err => { return err }).then(user => {return user[0].uid});                                                                     return uid;                                                                                         }


async function like(id){
	like_button = document.getElementById('like' + id);
	
	if(like_button.innerHTML >= svg.like_inactive){
		like_button.innerHTML = svg.like_active;

		re = await fetch(`/api/post?like=${id}`,{method: "PUT"});

	}else{
		like_button.innerHTML = svg.like_inactive
	}
}
liked = (list,user_id) => {                                    if(list.indexOf(user_id) == -1){
                                return svg.like_inactive;
                        }else{
                                return svg.like_active;
                        }                             }

feed = document.getElememtById("feed");

async function getfeed(){
		dat = await fetch("/api/feed").then(res => { return res.json() }).catch(err => { return err });

	       user_id = await getuser();

	for (d of dat){

		if(d.likes == null){
			d.likes = "[]"
		}

		d.likes = JSON.parse(d.likes)

		post = `<div class="post" style="background: ${turn(d.username) + '1f'};" id="${d.id}">
		<a href="/user/${d.person_id}">${d.username}</a>
		<h3>${d.title}</h3>
		<p>${d.body}</p>
		<div class="post-info">
		<span id="like${d.id}" onclick="like(${d.id})">${liked(d.likes,user_id)}</span><label>${d.likes.length}</label>
		</div>
		</div>`;
		feed.innerHTML += post;

	}
}

getfeed();
/*async function waitfeed(){
	r = await getfeed().then(res => return res)
	return r;

}*/


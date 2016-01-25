$(function(){
	var body = $.cookie("id");
	var obj = JSON.parse(body.substr(2));
	console.log(body);
	$('#send').click(function(event) {
		var $newEl = $("<article>"+$('#area').val()+"</article>");
		var $time = $("<time></time>");
		$time.txt("");
		$('#messages').prepend($newEl);
		$.post("/message",{message:$('#area').val(),date:new Date().toLocaleFormat("%B %e %Y"),from:obj.body.username}).promise().fail(function(){
			console.log('Fail');
		}).done(function(){
			console.log("success");
		});
	});
	$('#exit').click(function(event){
		$.get("/logout");
	});
});
$(document).ready(function() {
	//localStorage.removeItem("pos");
	//localStorage.removeItem("users");
    var pos = JSON.parse(localStorage.getItem("pos"));
    console.log(pos);
    pos = pos || {id:0};
    console.log(pos.id);
    var users = JSON.parse(localStorage.getItem("users"));
    users = users || {};
    $('#reg').hide();
    document.getElementById("reg_btn").addEventListener("click", function(e){
        $('#reg').toggle("blind");
    }, false);
    document.getElementById("reg_cancel").addEventListener("click", function(e) {
        $('#reg').toggle("blind");
    });
    var elements = document.getElementsByClassName("check");
    for(var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('blur', function(e) {
            if (e.target.value.length < 5) {
                e.target.style.border = "1px solid #ff0000";
        } else {
            e.target.style.border = "1px solid #32cd32";
    }
        }, false)   
}
    document.getElementById("reg_accept").addEventListener("click", function(e) {
        var login = document.getElementById("login");
        var pass = document.getElementById("pass");
        var rpass = document.getElementById("rpass");
        var exit = true;
            if (login.value.length < 5) {
                login.style.border = "1px solid #ff0000";
                exit = false;
            }
            if (pass.value.length < 5) {
                pass.style.border = "1px solid #ff0000";
                exit = false;
            }
            if (rpass.value.length < 5) {
                rpass.style.border = "1px solid #ff0000";
                exit = false;
            }
            if(!exit)
                return exit;
            if (pass.value != rpass.value) {
                alert("Пароли не совпадают");
                return false;
            }
	    var tempData = {
		id: pos.id,
		login: login.value,
		passwrd: pass.value,
		tasks: {}
	    };
	    users[pos.id] = tempData;
	    console.log(tempData.login+" "+tempData.passwrd);
	    $.each(users, function(ind, param){
		console.log(ind+" "+param.login);
	    });
	    pos.id = pos.id+1;
	    console.log(users[0] + " " + pos.id);
	    localStorage.setItem("pos",JSON.stringify(pos));
	    localStorage.setItem("users",JSON.stringify(users));
        console.log(login.value+":"+pass.value+"=>"+rpass.value);
$('#reg').toggle("blind");
    }, false);
    $('#ent_btn').click(function(){
        var login = document.getElementById("ent_login");
        var pass = document.getElementById("ent_passw");
        var exit = true;
        console.log(login.value+" "+pass.value);
        if (!login.value) {
            login.style.border = "1px solid #ff0000";
            exit = false;
        } else {
            login.style.border = "none";
        }
        if (!pass.value) {
            pass.style.border = "1px solid #ff0000";
            exit = false;
        } else {
            pass.style.border = "none";
        }
	if (!exit)
        	return exit;
	var accept = false;
	console.log(localStorage.getItem("users"));
	$.each(users, function(index, param){
		console.log(index + " " + param.login + " " + param.passwrd);
		if (param.login == login.value && param.passwrd == pass.value) {
			console.log("enter:User is exist");
			accept = true;	
			localStorage.setItem("mainUser",JSON.stringify({login: login.value, pass: pass.value}));
			document.location.href="main.html";	
		}
	});
	if (!accept) 
		$( "#shake_box" ).effect( "shake" );
	return accept;
    });
});

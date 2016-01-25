var mainUser = JSON.parse(localStorage.getItem("mainUser"));
var users = JSON.parse(localStorage.getItem("users"));
console.log(mainUser.login + " " + mainUser.pass);
$.each(users, function(index, param){
		if (param.login == mainUser.login && param.passwrd == mainUser.pass) {
			console.log("todo:User is exist");
			mainUser = param;	
		}
	});
var todo = todo || {},
    data = mainUser.tasks;
data = data || {};

(function(todo, data, $) {
    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
            todoDate: "task-date",
            todoDescription: "task-description",
            taskId: "task-",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div"
        }, codes = {
            "1" : "#pending",
            "2" : "#inProgress",
            "3" : "#completed"
        };

	document.getElementById("nickname").textContent = mainUser.login;
	console.log(document.getElementById("nickname").textContent);

    todo.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function (index, params) {
            generateElement(params);
        });

        $.each(codes, function (index, value) {
            $(value).droppable({
                drop: function (event, ui) {
                        var element = ui.helper,
                            css_id = element.attr("id"),
                            id = css_id.replace(options.taskId, ""),
                            object = data[id];

                            removeElement(object);

                            object.code = index;
							
			    data = sortData(data);
                            data[id] = object;
			    saveUser(data);
                            $("#" + defaults.deleteDiv).toggle("blind");
                    }
            });
        });

        $("#" + options.deleteDiv).droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = data[id];

                removeElement(object);

                delete data[id];
				data = sortData(data);
                //localStorage.setItem("todoData", JSON.stringify(data));
		        saveUser(data);
                $("#" + defaults.deleteDiv).toggle("blind");
            }
        })

    };

	var saveUser = function(data) {
		//var users = JSON.parse(localStorage.getItem("users"));
		mainUser.tasks = data;
		users[mainUser.id] = mainUser;
		console.log("Save data user");
		localStorage.setItem("users", JSON.stringify(users));
	}

    var generateElement = function(params){
        var parent = $(codes[params.code]), wrapper;
        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class" : defaults.todoTask,
            "id" : defaults.taskId + params.id,
            "data" : params.id
        }).appendTo(parent);
		
		var one = $("<div />");
		one.html('<img src="./img/priority_'+params.priority+'.png" alt="'+params.priority+'" /><br/><br/>')
		/*one.css("width", "32");
		one.css("margin", "0 auto");*/
		one.css("float", "right");
		one.appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoDate,
            "text": params.date
        }).appendTo(wrapper);

        var text = params.description;
        var description = "";
        for(var i = 0; i < text.length; i++) {
            if (i!= 0 && i % 29 == 0) {
                description += "\n";
            }
            description += text[i];
        }
        
        $("<div />", {
            "class" : defaults.todoDescription
        }).text(description).appendTo(wrapper);
	    
        wrapper.draggable({
            start: function() {
                $("#" + defaults.deleteDiv).toggle("blind");
            },
            stop: function() {
                $("#" + defaults.deleteDiv).toggle("blind");
            },
	        revert: "invalid",
	        revertDuration : 200
        });

    };

    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };

    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, date, tempData, priority;

        if (inputs.length !== 4) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;
		priority = $( "#slider" ).slider("option","value");
		console.log($( "#slider" ).slider("option","value"));

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

	if(!date) {
	    document.getElementById("datepicker").style.border = "1px solid #ff0000";
	    generateDialog("Date cannot be empty");
            return;
	}
	if (title.length > 20) title = title.substr(0,20);

        id = new Date().getTime();

        tempData = {
            id : id,
            code: "1",
            title: title,
            date: date,
            description: description,
	    priority: priority
        };

        data[id] = tempData;
	data = sortData(data);
        //localStorage.setItem("todoData", JSON.stringify(data));
        //generateElement(tempData);
	saveUser(data);

        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
	$( "#slider" ).slider("option","value",1);
    };
	
	var sortData = function(data) {
		var dataToArr = [];
		$.each(data, function (index, params) {
            dataToArr.push(params);
        });
		dataToArr.sort(function(one, that) {
			return one.priority-that.priority;
		});
		data = {};
		$.each(dataToArr, function (index, params) {
            data[params.id] = params;
			todo.refresh(params);
        });
		return data;
	}

    var generateDialog = function (message) {
        var responseId = "response-dialog",
            title = "Message",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                    title: title,
                    id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);

        buttonOptions = {
            "Ok" : function () {
                responseDialog.dialog("close");
            }
        };

	    responseDialog.dialog({
            autoOpen: true,
            width: 400,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    todo.clear = function () {
        data = {};
        saveUser(data);
        $("." + defaults.todoTask).remove();
    };
	
	todo.refresh = function(params) {
		removeElement(params);
		generateElement(params);
	};

})(todo, data, jQuery);

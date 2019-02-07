/*
	Introspect by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	$(function() {

		var authToken = localStorage.getItem('authToken');
		var userId = localStorage.getItem('userId');

		$.ajax({
			url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152/user/newcontentpage',
			beforeSend: function(request) {
				request.setRequestHeader("authToken", authToken);
				request.setRequestHeader("content-type", 'application/json');
			},
			type: 'GET',
			success: function(data) {
				var source   = $("#contenttags-template").html();
				var template = Handlebars.compile(source);
				console.log('content tags success: ', data);
				var context = { "tagdatas": {"contenttagdata": data.contentTags, "htmltagdata": data.htmlTags, "topictagdata": data.topicTag } };
				var reporthtml = template(context);
				$('.tags-dropdown').html(reporthtml);
			},
			error: function(data) {
				alert('content tags error');
				console.log('content tags failure: ', data);
			}
		});

		$(document).on("click", '#submitQuestion', function() {
			var tagtype = $('#inputState-tag  option:selected').val();
			var htmltype = $('#inputState-html  option:selected').val();
			var topictype = $('#inputState-topic  option:selected').val();
			var question = $('#question').val();
			var weight = $('#question-weight').val();
			
			var answerarray = [],
				rightAnswerArray = [];

			$('#answer-choice input[type="text"]').each(function (i, ele) {
				answerarray.push(ele.value);
			});

			$('#answer-choice input[type="checkbox"]').each(function (i, ele) {
				rightAnswerArray.push($(ele).prop("checked"));
			});

			var submitQuestion = {
				"htmlTypeId": htmltype,
				"associatedImgs": "",
				"question": question,
				"answer": answerarray.join('|'),
				"rightAnswer": rightAnswerArray.join('|'),
				"weight": weight,
				"crUserEmail": userId,
				"contentTag": tagtype,
				"topicTag": topictype
			}
			console.log('asdjkhasjkdhjkas', submitQuestion);



			$.ajax({
				url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152/user/content',
				beforeSend: function(request) {
					request.setRequestHeader("authToken", authToken);
					request.setRequestHeader("content-type", 'application/json');
				},
				data: JSON.stringify(submitQuestion),
				type: 'POST',
				success: function(data) {
				  console.log('success: ', data);
				  var popupStatus =  data.Status;
				  var popupMsg =  data.Message;
				  $('#myModal .modal-body').text(data);
				  $('#myModal').modal('show');
				},
				error: function(data) {
					alert('Submit Question failed');
					console.log('Submit Question failure: ', data);
				}
			});

		});//submit question ends

		$(document).on("click", '.add-answer-choice', function() {
			var index = $('.ans-choice-group').length +1;
			var inputhtml = '<div class="input-group ans-choice-group">' +
			'<input type="text" class="form-control" aria-label="Text input with dropdown button">'+
			'<div class="form-check">'+
				'<input class="form-check-input" type="checkbox" id="answer'+ index +'" value="option1">'+
				'<label class="form-check-label" for="answer'+ index +'">correct</label>'+
			'</div>'+
			'</div>';
			$("#answer-choice").append(inputhtml);

		});

		$(document).on("click", '.remove-answer-choice', function() {
			$( "#answer-choice .ans-choice-group:last-child" ).remove();
		});

		$(document).on("click", '#searchSuccess-close', function() {
			window.location.href="editquestion.html";
		});


	});

})(jQuery);

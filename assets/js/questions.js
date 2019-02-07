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
			url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152/user/contenttags',
			beforeSend: function(request) {
				request.setRequestHeader("authToken", authToken);
				request.setRequestHeader("content-type", 'application/json');
			},
			type: 'GET',
			success: function(data) {
				var source   = $("#contenttags-template").html();
				var template = Handlebars.compile(source);
				console.log('content tags success: ', data);
				var context = { "reportdata": data };
				var reporthtml = template(context);
				$('.tags-dropdown').html(reporthtml);
			},
			error: function(data) {
				alert('content tags error');
				console.log('content tags failure: ', data);
			}
		});

		$(document).on("change", 'select[name="dropdown"]', function() {
			var contenttag = $(this).val();
			getQuestionsByLevel(contenttag);
		});

		$(document).on("click", '.submit-comment', function(evt) {
			var questionId = $(evt.target).closest('.comment-group').find('.question-id').val();
			var contentLevel = $("#inputState option:selected").val()
			var commentEntered = $(evt.target).closest('.comment-group').find('.comment-text').val();
			
			var commentJson = {
				"contentID" : questionId,
				"contentLevel": contentLevel,
				"comment": commentEntered,
				"commenterEmail" : userId
			}
			
			console.log('clicked button commentJson', commentJson);

			$.ajax({
				url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152//user/comment',
				beforeSend: function(request) {
					request.setRequestHeader("authToken", authToken);
					request.setRequestHeader("content-type", 'application/json');
				},
				type: 'POST',
				data: JSON.stringify(commentJson),
				success: function(data) {
					console.log('comment sent success: ', data);
					getQuestionsByLevel(contentLevel);
				},
				error: function(data) {
					alert('content tags error');
					console.log('comment sent failure: ', data);
				}
			});
		});

		$(document).on("click", '.approve-question', function(evt) {
			var questionId = $(evt.target).closest('.card-body').find('.question-id').val();
			var contentLevel = $("#inputState option:selected").val()
			
			var approveJson = {
				"contentLevel" : contentLevel,
				"contentId" : questionId,
				"aprEmail" : userId
			};
			
			console.log('clicked button approvecontent', approveJson);

			$.ajax({
				url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152/user/approvecontent',
				beforeSend: function(request) {
					request.setRequestHeader("authToken", authToken);
					request.setRequestHeader("content-type", 'application/json');
				},
				type: 'POST',
				data: JSON.stringify(approveJson),
				success: function(data) {
					console.log('approveJson sent success: ', data);
					getQuestionsByLevel(contentLevel);
				},
				error: function(data) {
					alert('content tags error');
					console.log('comment sent failure: ', data);
				}
			});
		});

		$(document).on("click", '.edit-question-mySubmitted', function(evt) {
			
			var questionId = $(evt.target).closest('.card-body').find('.question-id').val();
			var questionText = $(evt.target).closest('.card-body').find('.question-p-tag').text();
			var weightText = $(evt.target).closest('.card-body').find('.weight-value').text();
			// var contentLevel = $("#inputState option:selected").val();
			choiceAnsLength = $(evt.target).closest('.card-body').find('.form-check').length;
			
			var ans = [], rightans = [];
			for(var i=0; i< choiceAnsLength; i++) {
				ans.push($(evt.target).closest('.card-body').find('.form-check-label').eq(i).text().trim());
				rightans.push($(evt.target).closest('.card-body').find('.form-check-input').eq(i).is(":checked"));
			}

			var array1 = ans || [], 
			array2 = rightans || [],
			combined = array1.map(function(v, k, a){ return {ansOption: v, isRightAns: array2[k] }; });
			
			
			// const ansRightAnsCombinedObj5 = ansRightAnsCombine(allApproveddQues);
			console.log('edity clicked question ===', questionText);
			$('#edit-question').val(questionText);
			$('#edit-question-weight').val(weightText);
			$('#edit-question-id').val(questionId);


			var editChoiceQuesSource   = $("#edit-choice-answer-template").html();
			var editChoiceTemplate = Handlebars.compile(editChoiceQuesSource);
			var editChoiceAnswerContext = { "questionsdata": combined };
			var editChoicehtml = editChoiceTemplate(editChoiceAnswerContext);
			$('#answer-choice').html(editChoicehtml);
			
			$('#editQuestionModal').modal('show');
			
		});

		$(document).on("click", '#edit-submitQuestion', function() {
			var questionId = $('#edit-question-id').val();
			var question = $('#edit-question').val();
			var weight = $('#edit-question-weight').val();
			var contentLevel = $("#inputState option:selected").val();
			
			var answerarray = [],
				rightAnswerArray = [];

			$('#answer-choice input[type="text"]').each(function (i, ele) {
				answerarray.push(ele.value);
			});

			$('#answer-choice input[type="checkbox"]').each(function (i, ele) {
				rightAnswerArray.push($(ele).prop("checked"));
			});

			var submitQuestion = {
				"id": questionId,
				"associatedImgs": "",
				"question": question,
				"answer": answerarray.join('|'),
				"rightAnswer": rightAnswerArray.join('|'),
				"weight": weight
			}
			console.log('edit question JSON', submitQuestion);

			$.ajax({
				url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152/user/updatecontent',
				beforeSend: function(request) {
					request.setRequestHeader("authToken", authToken);
					request.setRequestHeader("content-type", 'application/json');
				},
				data: JSON.stringify(submitQuestion),
				type: 'POST',
				success: function(data) {
					$('#editQuestionModal').modal('hide');
					console.log('success: ', data);
					var popupStatus =  data.Status;
					var popupMsg =  data.Message;
					$('#myModal .modal-body').text(data);
					$('#myModal').modal('show');
					getQuestionsByLevel(contentLevel);
				},
				error: function(data) {
					alert('Update Question failed');
					console.log('Update Question failure: ', data);
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

		$(document).on("click", '.delete-my-submitted-question', function(evt) {
			var r = confirm("Are you sure you want to delete the question?");
			if (r == true) {
				var questionId = $(evt.target).closest('.card-body').find('.question-id').val();
				var contentLevel = $("#inputState option:selected").val();

				var deleteJson = {
					"contentLevel" : contentLevel,
					"contentId" : questionId,
					"aprEmail" : userId
				};

				console.log('clicked button deletecontent', deleteJson);

				$.ajax({
					url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152/user/deletecontent',
					beforeSend: function(request) {
						request.setRequestHeader("authToken", authToken);
						request.setRequestHeader("content-type", 'application/json');
					},
					type: 'POST',
					data: JSON.stringify(deleteJson),
					success: function(data) {
						console.log('deleteJson sent success: ', data);
						var popupStatus =  data.Status;
						var popupMsg =  data.Message;
						$('#myModal .modal-body').text(data);
						$('#myModal').modal('show');
						getQuestionsByLevel(contentLevel);
					},
					error: function(data) {
						alert('delete question error :' + data);
						console.log('delete question failure: ', data);
					}
				});
			} else {
				alert("Question not deleted!");
			}
		});



	function getQuestionsByLevel(level) {
		$.ajax({
			url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152/user/allcontentbytype?&contentType=' + level,
			beforeSend: function(request) {
				request.setRequestHeader("authToken", authToken);
				request.setRequestHeader("content-type", 'application/json');
			},
			type: 'POST',
			success: function(data) {
				console.log('content by tags success: ', data);
				if (data.length === 0) {
					alert('Presently content is empty for selected option. Please choose other option.');
				}
				const pendingOnly = data.filter(({aprStatus}) => (aprStatus === 'S'));
				const pendingOnlyDifferentUser = pendingOnly.filter(({crUserEmail}) => (crUserEmail !== userId));
				const ansRightAnsCombinedObj1 = ansRightAnsCombine(pendingOnlyDifferentUser);
				var pendingApprovalSource   = $("#pending-approval-questions-template").html();
				var pendingTemplate = Handlebars.compile(pendingApprovalSource);
				
				var pendingContext = { "questionsdata": ansRightAnsCombinedObj1 };
				var pendingQuestionshtml = pendingTemplate(pendingContext);
				$('.pending-approval-questions-content').html(pendingQuestionshtml);

				const approvedQues = data.filter(({aprStatus}) => aprStatus === 'A');
				const approvedQuesSameUser = approvedQues.filter(({crUserEmail}) => crUserEmail === userId);
				const ansRightAnsCombinedObj2 = ansRightAnsCombine(approvedQuesSameUser);
				var approvedSource   = $("#approved-questions-template").html();
				var approvedTemplate = Handlebars.compile(approvedSource);
				var approvedContext = { "questionsdata": ansRightAnsCombinedObj2 };
				var approvedQuestionshtml = approvedTemplate(approvedContext);
				$('.approved-questions-content').html(approvedQuestionshtml);

				const mySubmittedQues = data.filter(({aprStatus}) => aprStatus === 'S');
				const mySubmittedQuesSameUser = mySubmittedQues.filter(({crUserEmail}) => crUserEmail === userId);
				const ansRightAnsCombinedObj3 = ansRightAnsCombine(mySubmittedQuesSameUser);
				var mySubmittedQuesSource   = $("#my-submitted-questions-template").html();
				var mySubmittedQuesTemplate = Handlebars.compile(mySubmittedQuesSource);
				var mySubmittedQuesContext = { "questionsdata": ansRightAnsCombinedObj3 };
				var mySubmittedQueshtml = mySubmittedQuesTemplate(mySubmittedQuesContext);
				$('.my-submitted-questions-content').html(mySubmittedQueshtml);

				
				const allApproveddQues = data.filter(({aprStatus}) => aprStatus === 'A');
				// const mySubmittedQuesSameUser = allApproveddQues.filter(({crUserEmail}) => crUserEmail === userId);
				const ansRightAnsCombinedObj4 = ansRightAnsCombine(allApproveddQues);
				var allApprovedQuesSource   = $("#all-approved-questions-template").html();
				var allApprovedQuesTemplate = Handlebars.compile(allApprovedQuesSource);
				var allApprovedQuesContext = { "questionsdata": ansRightAnsCombinedObj4 };
				var allApprovedQueshtml = allApprovedQuesTemplate(allApprovedQuesContext);
				$('.all-approved-questions-content').html(allApprovedQueshtml);
			},
			error: function(data) {
				alert('content tags error');
				console.log('content by tags failure: ', data);
			}
		});
	}

	function ansRightAnsCombine(allContentByType) {
		for (var i=0; i < allContentByType.length; i++) {
			var array1 = allContentByType[i].answer || [], 
			array2 = allContentByType[i].rightAnswer || [],
			combined = array1.map(function(v, k, a){ return {ansOption: v, isRightAns: array2[k] === "true" ? true : false }; });
			
			allContentByType[i].ans = combined;
		}
		return allContentByType;
	}



	});

})(jQuery);

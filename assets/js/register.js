/*
	Introspect by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	$(function() {

		$("#register-id").click(function() {
			var registerData = {
				"email": $('#email').val(),
				"name": $('#username').val(),
				"password": $('#password').val()
			 };

			$.ajax({
				url: 'http://ec2-13-232-25-67.ap-south-1.compute.amazonaws.com:8152/register',
				type: 'POST',
				data: JSON.stringify(registerData),
				beforeSend: function(request) {
					request.setRequestHeader("content-type", 'application/json');
				  },
				success: function(data) {
					// alert('Isotope: Login Success');
				  console.log('success: ', data);
				  var popupStatus =  data.Status;
				  var popupMsg =  data.Message;
				  $('#myModal .modal-body').text(data.Message);
				  $('#myModal').modal('show');
				},
				error: function(data) {
					// alert('login error');
					console.log('failure: ', data);
				}
			  });
		});


		$("#createSuccess-close").click(function() {
			window.location.href="login.html";
		});

	});

})(jQuery);

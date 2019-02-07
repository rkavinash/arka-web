/*
	Introspect by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	$(function() {
		
		var authToken = localStorage.getItem('authToken');
		if (authToken == "" || authToken == null) {
			$('#menu-createorder-id').hide();
			$('#menu-order-id').hide();
			// $('#menu-search-id').hide();
			$('#menu-logout-id').hide();
			$('#menu-login-id').show();
		} else {
			$('#menu-createorder-id').show();
			$('#menu-order-id').show();
			// $('#menu-search-id').show();
			$('#menu-login-id').show();
			$('#menu-logout-id').hide();
		}
	});

})(jQuery);
// ====================================================
// FRONTPAGE EVENTS
// ====================================================

var signupButton;
var postUrl = {
	signup:'/invitation/signup'
};
var signAction;
var message = $('#message-wrapper .message');
var registerWidget = $('.register-widget');
var email = $('#email');
var finishMessage = $('.finished-message');


var dateStart = "2016/08/26";

/**
 *  @validatorEmail function.
 */
var IsEmail = function(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

/**
 *	@startCounter
 */
var startCounter = function () {
	if ($(".counter").length > 0) {
		$(".counter")
    	.countdown(dateStart, function(event) {
      	$(this).text(
        	event.strftime('%D days %H:%M:%S')
      	);
  	});
	}
}

var handleCallback = function(data) {
	signAction = false;
	signupButton.removeClass('signup-disabled');

	if (data.status==true) {
		message.fadeOut('fast',function() {
			registerWidget.find('#email, #signupButton').fadeOut('slow',function() {
				finishMessage.html('Done!').fadeIn('slow', function () {
					message.html(data.message).fadeIn('fast');
				});
			});
		})
	}
	else if (data.status == false) {
		message.html(data.message).fadeIn('fast');
	}
	else {
		message.html('Some problem ocurred. Please try again later.').fadeIn('fast');
	}
}


var GetURLParameter = function(sParam) {

  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');

  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
  return false;

}


/**
*	@main event for signup.
*/
var signUpRequest = function() {
// #prevent user post click burst
	if (!signAction) {
    var email_value = $('#email').val();
    if (email_value !== '' && IsEmail(email_value)) {

      var data = jQuery.parseJSON( '{ "email": "'+ email_value +'", "kid": "' + GetURLParameter('kid') + '" }');
		  signupButton.addClass('signup-disabled');
		  signAction = true;
		  message.html('Signing you up..').fadeIn('fast');

		  $.ajax({
			 url: postUrl.signup,
			 type: 'post',
			 dataType: 'json',
			 data: data,
			 success: function(data) {
			 	handleCallback(data);
			 }
		  }); // ajax request.
  
    } 

    else {
			message.fadeOut('fast',function() {
				$(this).html('Please fill a valid email').fadeIn('fast');
	    });
		}
	}

	else {

	}
 			
};


var startDomManipulation = function() {
	$('h3.title').addClass('title-visible');
}


// Main listener.
$( document ).ready(function() {
	startCounter();
	startDomManipulation();
	signupButton = $('#signupButton');
	signAction = false;

	if (signupButton.length > 0) {
		signupButton.click( function() {
 			signUpRequest();
		});
	}
});



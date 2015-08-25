// ====================================================
// MAILMAN
// ====================================================
// Responsible for all mail actions.	
// ☊

var nodemailer = require('nodemailer');
var cfg = require('_/config');
var Q = require('q');
var fs = require('fs');

var mailOptions = {
	service: "Gmail",
	auth: {
		user: cfg.emailUser,
		pass: cfg.emailPassword 
	}
} 

// # You can use the same transporter object for all e-mails ✔
var transporter = nodemailer.createTransport(mailOptions);


// setup e-mail data with unicode symbols
var mailData = {
	from: 'Invite ☊ <invite@example.com>', // sender address
   to:cfg.emailUser, // list of receivers
   subject: 'Invitation page: Confirm your email ', // Subject line
   text: 'Hello world text', // plaintext body
   html: '<div>Empty</div>' // html body
};

/*

*/
exports.sendEmailToUser = function (email, authToken) {
	// send mail with defined transport object
	var authLink = cfg.baseURL + "/invite/confirm/" + authToken;
  var link = '<a href="' + authLink +'">' + authLink+'</a>';
  var deferred = Q.defer();

  /**====================
	
		You can put this data in a template.
	
  =====================**/
  var htmlTemplate = "<div><h3> Invite </h3> </ br><p> Hey there, you got an invitation to purchase Product X </p><p> Click on the following link to confirm: " + link + " </p><p> Send us a mail if you have any questions : info@you.com </p></div>";
	mailData.html = htmlTemplate;
	mailData.to = email;

	transporter.sendMail(mailData, function(error, info){
		if(error){
	  	console.log(error);
	  	deferred.reject(new Error(error));
	  }
		console.log('Message sent: ' + info.response);
		deferred.resolve(true);
	});

	return deferred.promise;

}



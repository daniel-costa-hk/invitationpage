/**
*
*
*/
var mongoMan = require('../model/users');
var mailMan = require('../model/mailman')
var passport = require("passport");
var crypto = require('crypto');
var Q = require('q');
var validator = require('validator');

var messages = {
  mail_exists: "Email already exists. Want to invite your friends? ",
  mail_invalid: "Not a valid email format. Missed a character ?",
  mail_ok: "Invitation mail sent! Any questions let us know info@generic.com.",
  mail_all_ok: "You're already subscribed",
  mail_no_auth: "You have already submitted your mail but no confirmation yet.. Could we be in your spam box?",

  mail_no_invitationuser: "Sorry, it seems this invitation is invalid...",
  mail_invitations_finished: "Sorry, it seems your friend has no more invitations left.. Sorry :-)"
};

/**
* @Inserts a user into the db with a unique token.
*/
exports.signUpAction = function (request, result) {

  var email = request.body.email;
  var kid = request.body.kid;

  if (email !== undefined && validator.isEmail(email)) {   

    var seed = crypto.randomBytes(20);
    var inviteSeed = crypto.randomBytes(3);
    var authToken = crypto.createHash('sha1').update(seed + email).digest('hex');
    var inviteToken = crypto.createHash('sha1').update(inviteSeed + email).digest('hex');


    mongoMan.getUserByEmail(email)
      .then(function(data) {

        if (data.existsUser == false) {
          
          // invited user
          if (kid !== "false") {   
            
            mongoMan.updateOriginalInvitator(email, kid)
            .then(function(data) {

              if (data.hasUser == false) {
                result.send({status:false, message: messages.mail_no_invitationuser});
              }

              else if (data.hasUser == true && data.hasInvitations == false) {
                result.send({status:false, message: messages.mail_invitations_finished});
              }

              
              else {
                 mongoMan.insertUser(email,authToken, inviteToken.substring(0,11), false)
                 .then(mailMan.sendEmailToUser(email,authToken))
                .then(function(data) {
                  result.send({status:true, message: messages.mail_ok});
                })
                .catch(function (error) {
                  // Handle any error from all above steps 
                })
                .done();
              }
            })
            .catch(function (error) {

            })
            .done();

           
          } // kid is not false, so its an invitation/

          // regular user
          else {
            mongoMan.insertUser(email,authToken, inviteToken.substring(0,11), false)
            .then(mailMan.sendEmailToUser(email,authToken))
            .then(function(data) {
              result.send({status:true, message: messages.mail_ok});
            });
          }
          
        } // If the user exists

        // We already have a user.
        else {
          if (data.existsUser && data.isAuthenticated) {
            result.send({status:false, hasemail:true, hasauth:true, message: messages.mail_all_ok});
          }
          else {
            result.send({status:false, hasemail:true, hasauth:false, message: messages.mail_no_auth});
          }
        }

      });

  } // valie email

  else {
    result.send({status:true, message:mail_invalid });
  } 
}


/**
* @User is logged in.
*/
exports.loginUserAction = function (request, result) {

}

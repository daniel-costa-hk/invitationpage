/**
*
*
*
*/

var mongoMan = require('../model/users');
var Q = require('q');
var cfg = require('_/config');
var Cookies = require( "cookies");

exports.index = function (request, response) {
  mongoMan.getUserCount()
  .then(function(userCount) {
    response.render('pages/homepage', {
      title: "Invitation Page",
      confirmed: false,
      numberUsers:userCount,
      shareLink:cfg.baseURL
    });
  });
}

exports.adminRegistrations  = function (request, response) {
  mongoMan.getAllUsers()
  .then(function(object) {
    response.render('admin/registrations', {
      title: "Invitation Page - Registrations",
      users:object
    });
  });
}


/**
 *
 */
exports.confirmedAuth = function (request, response) {

  var kolidURL = '';
  if (request.query.kolid) {
    kolidURL = '?kid=' + request.query.kolid;
      // To Write a Cookie
  }
  var cookies = new Cookies(request, response);

  mongoMan.getUserCount()
  .then(function(userCount) {
    response.render('pages/homepage', {
      title: "Invitation Page",
      confirmed: true,
      numberUsers: userCount,
      shareLink:cfg.baseURL + kolidURL,
      confirmedUser:cookies.get('invitation_confirmed_user')
    });

  });
}

exports.login = function (request, response) {
   response.render('pages/login', {
    title: "Admin Login home page"
  });
}


exports.viewInvitations = function (request, response) {
  response.render('invitations', {
    title: "Admin Login home page"
  });
}

exports.confirmInvitation = function (request, response) {
  var token = request.params.token_value;

  mongoMan.validateToken(token)
  .then(function(data) {
    if (data.inviteToken) {
      var cookies = new Cookies(request, response);
      cookies.set('invitation_confirmed_user',data.email);
      response.redirect('/confirmed?kolid=' + data.inviteToken);
    }
    else {
      response.redirect('/');
    }
  });

}

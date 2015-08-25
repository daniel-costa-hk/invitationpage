// ====================================================
// USERS DB
// ====================================================

/*=====================================

  Users schema.

  
======================================*/
var mongoose = require('mongoose');
var Q = require('q');
var cfg = require('_/config');
var winston = require("winston");
var dbURI = cfg.mongo_dbURI;

mongoose.connect(cfg.mongo_dbURI);

// Listeners.
mongoose.connection.on("connect", function() {
  winston.info('Mongoose default connection open to ' + dbURI);
});
mongoose.connection.on("error", function() {
  winston.error('Mongoose error connection to ' + dbURI);
});


var Schema = mongoose.Schema;

/**
 *  @userSchema.
 */
var UserSchema = new Schema({

  email: { 
    type: String, 
    required: true, 
    index: { 
      unique: true 
    } 
  },

  invitePosition: {
    type: Number,
    required:true,
  },
  
  authToken: {
    type:String,
    required:true,
    index: {
      unique:true
    }
  },

  inviteToken: {
    type:String,
    required:true,
    index: {
      unique:true
    }
  },

  usersInfo: {
    type:Array
  },

  purchaseItems: {
    type: Number,
    required:true,
  },

  timeStamp : { 
    type : Date, 
    default: Date.now 
  },

  isAuthenticated: {
    type:Boolean,
    required:true,
  },

  numberInvitations: {
    type: Number,
    default: 5
  }

});

var User =  mongoose.model('User', UserSchema );

/**
 *  @insertUser
 */
var insertUser = function(_email, _authToken,_inviteToken,  _isAuthenticated) {

  var deferred = Q.defer();
  var userInstance = new User();

  userInstance.email = _email;
  userInstance.invitePosition = 1;
  userInstance.authToken = _authToken;
  userInstance.inviteToken = _inviteToken;
  userInstance.purchaseItems = 2;
  userInstance.isAuthenticated = _isAuthenticated;
  userInstance.numberInvitations = 5;

  userInstance.usersInfo = [];

  userInstance.save(function(error) {
    if (error) {
      deferred.reject(new Error(error));
    }
    deferred.resolve(true);
  });

  return deferred.promise;
}


/**
 *  @getAllUsers
 */
var getAllUsers = function () {
  var deferred = Q.defer();

  User.find({},  function(error, object) {
    if (error)  {
      deferred.reject(new Error(error));
    }
    if (object == null) {
      deferred.resolve(false);
    }
    else {
      deferred.resolve(object);
    }
    
  });
  return deferred.promise;
}

/**
 *  @validateToken
 */
var validateToken = function (_authToken) {
  var deferred = Q.defer();
  var query = {'authToken':_authToken};

  User.findOneAndUpdate(query, { isAuthenticated: true },  function(error, object) {
    if (error)  {
      deferred.reject(new Error(error));
    }
    if (object == null) {
      deferred.resolve(false);
    }
    else {

      deferred.resolve(object);
    }
    
  });
  return deferred.promise;
}


/**
 *  @getUserCount
 */
var getUserCount = function(_email) {

  var deferred = Q.defer();
  User.find({ }, function (error, object){
     if (error)  {
      deferred.reject(new Error(error));
    }
  
    if (object == null) {
      deferred.resolve(false);
    }
    else {
      deferred.resolve(object.length);
    }
  });
  return deferred.promise;
}


/**
 *  @updateInvitator
 *  Takes care of veryfing the Inviting user, and update concurrently
 */
var updateOriginalInvitator = function(_emailUser, _kid) {

  var output = {};
  var numberInvitations_db;
  var deferred = Q.defer();

  User.findOne({'inviteToken':_kid}, function (error, object) {
    if (error) {
      deferred.reject(new Error(err));
    }
    if (object == null) {
      output.hasUser = false;
      deferred.resolve(output);
    }

    if (object.numberInvitations <= 0) {
      output.hasUser=true;
      output.hasInvitations=false;
      deferred.resolve(output);
    }
    else {
      numberInvitations_db = object.numberInvitations - 1 ;
      this.findOneAndUpdate({'inviteToken':_kid}, 
        { 
          $push: {usersInfo: _emailUser }, 
          $set: {numberInvitations:numberInvitations_db} 
        },  
        function(error, object) {
          if (error) { return error; }
          if (object !== null) {
            output.hasUser = true;
            output.hasInvitations = true;
            deferred.resolve(output);
          }
         
      });

    }
  });


  return deferred.promise;
}

/**
 *  @getUserByName
 */
var getUserByEmail = function(_email) {

  var deferred = Q.defer();
  var query = {'email':_email};

  var data = {
    existsUser:false
  }

  User.findOne({ email: _email}, function (error, object){
     if (error)  {
      deferred.reject(new Error(error));
    }
    if (object == null) {
      deferred.resolve(data);
    }
    else {
      data.isAuthenticated = object.isAuthenticated;
      data.existsUser = true;
      deferred.resolve(data);
    }
  });
  return deferred.promise;
}

/*===========================

  Export it for generic use.

============================*/
module.exports.validateToken = validateToken;
module.exports.insertUser = insertUser;
module.exports.getUserByEmail = getUserByEmail;
module.exports.getUserCount = getUserCount;
module.exports.getAllUsers = getAllUsers;
module.exports.updateOriginalInvitator = updateOriginalInvitator;


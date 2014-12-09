var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

UserProvider = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

UserProvider.prototype.getCollection= function(callback) {
  	this.db.collection('articles', function(error, article_collection) {
    	if( error ) {
    		callback(error);
    	} else  {
    		callback(null, article_collection);
    	}
  	});
};

UserProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

UserProvider.prototype.find = function(access_token, google_id) {
	this.getCollection(function(error, article_collection) {
		if (error) {
			callback(error);
		} else {
			article_collection.findOne({'access_token': access_token, 'google_id': google_id}, function(error, result) {
	          	if( error ) callback(error);
	          	else callback(null, result);
          	});
		}

	});
};

UserProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
      	if( error ) callback(error)
      	else {
	        if( typeof(articles.length)=="undefined") {
	          	articles = [articles];
	        }

	        article_collection.insert(articles, function() {
	          	callback(null, articles);
	        });
      	}
    });
};

exports.UserProvider = UserProvider;
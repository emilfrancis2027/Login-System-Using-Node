var mongoose=require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;
//user schema
var UserSchema=mongoose.Schema({
    username:{
        type: String,
    },
    email:{
        type: String,
        index:true
    },
    password:{
        type: String,
    },
    time:{
        type: String,
    }
})
var User =module.exports=mongoose.model('User',UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}
module.exports.isUsernameTaken = function(username, callback) {
    return User.count({ username })
      .then((count) => {
        if (count > 0) {
          return true;
        }
          return false;
      });
  }

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password= hash;
            newUser.save(callback);
        });
    });
    
}
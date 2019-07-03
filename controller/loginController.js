// Import model
Login = require('./../model/loginModel');
var bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

// Handle index actions
exports.index = function (req, res) {
    Login.get(function (err, logins) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Logins retrieved successfully",
            data: logins
        });
    });
};


exports.new = function (req, res) {
    
    Login.findOne({ username: req.body.username }, function(err, login) {
        if(err) {
           res.send(err);
        }
        if (login) {
            res.json({
                status: 'fail',
                message: 'Username Already exists!!!'
            });
        } 
        else {
            bcrypt.hash(req.body.password, 10, function (err, hash){
                if (err) {
                  return next(err);
                }
            var login = new Login();
            //login.username = req.body.username ? req.body.username : login.username;
            login.firstname = req.body.firstname;
            login.lastname = req.body.lastname;
            login.dob = req.body.dob;
            login.street = req.body.street;
            login.ph = req.body.ph;
            login.email = req.body.email;
            login.username = req.body.username;
            login.password = hash;

            login.save(function (err) {
                if (err)
                    res.json({
                        status: 'fail',
                        message: 'Not Registered Successfully!'
                    });
                else
                    res.json({
                        status: "success",
                        message: 'Registered Successfully!'
                    });
                });

              })
    
        }
     }); 

};






exports.log = function (req, res) {
    
    Login.findOne({ username: req.body.username }, function(err, login) {
        if(err) {
           //handle error here
           res.send(err);
        }
     
        //if a user was found, that means the user's email matches the entered email
        if (login) {
            

            Login.findOne({ username: req.body.username }).then(function (login) {
               if (!login) {
                res.json({
                    message: 'Invalid UsernameP!!!'
                });
               } else {
            bcrypt.compare(req.body.password, login.password, function (err, result) {
              if (result == true) {
                  //res.redirect('/home');

                var token = jwt.sign({
                    loginId: login._id
                  }, 'secret', { expiresIn: 86400 });
                  

                
                res.json({
                    status: "success",
                    message: 'Login success!!!',
                    token: token
                });
                

              } else {
                res.json({
                    status: "failure",
                    message: 'Incorrect password!!!'
                });

              }
            });
           }
        });


        } 
        else {

            res.json({
                status: "fail",
                message: 'Invalid Username!!!'
            });
        }
     }); 

};







exports.tok = function (req, res) {
    Login.get(function (err, logins) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else{
            var token = req.body.to;
            if (token) {

                // verifies secret and checks exp
                jwt.verify(token, 'secret', function(err, decoded) {       
                    if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });       
                } else {
                    // if everything is good, save to request for use in other routes
                    //req.decoded = decoded;         next();
                    //var decoded = jwt.decode(token);
                    res.json({ success: true, message: 'Authenticate success.', token, id: decoded.loginId });
                }
                });
            
              } else {
            
                // if there is no token
                // return an error
                return res.status(403).send({ 
                    success: 'false', 
                    message: 'No token provided.' 
                });
            
              }
            


        }
    });
};














/*

// Handle view contact info
exports.view = function (req, res) {
    Login.findById(req.params.login_id, function (err, login) {
        if (err)
            res.send(err);
        res.json({
            message: 'Login details loading..',
            data: login
        });
    });
};
// Handle update contact info
exports.update = function (req, res) {
Login.findById(req.params.login_id, function (err, login) {
        if (err)
            res.send(err);
login.username = req.body.username ? req.body.username : login.username;
        login.password = req.body.password;
        
// save the contact and check for errors
        login.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Login Info updated',
                data: login
            });
        });
    });
};
// Handle delete contact
exports.delete = function (req, res) {
    Login.remove({
        _id: req.params.login_id
    }, function (err, login) {
        if (err)
            res.send(err);
res.json({
            status: "success",
            message: 'Login deleted'
        });
    });
};

*/
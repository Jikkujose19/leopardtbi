// Import contact model
Login = require('./loginModel');
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
// Handle create contact actions
exports.new = function (req, res) {
    
    Login.findOne({ username: req.body.username }, function(err, login) {
        if(err) {
           //handle error here
           res.send(err);
        }
     
        //if a user was found, that means the user's email matches the entered email
        if (login) {
            /*
              var err = new Error('Username Already exists!!!')
             //err.status = 400;
             return (err);
             */
             res.json({
                message: 'Username Already exists!!!'
            });
        } 
        else {
            //code if no user with entered email was found

            // save the contact and check for errors
            var login = new Login();
            //login.username = req.body.username ? req.body.username : login.username;
            login.firstname = req.body.firstname;
            login.lastname = req.body.lastname;
            login.dob = req.body.dob;
            login.street = req.body.street;
            login.ph = req.body.ph;
            login.email = req.body.email;
            login.username = req.body.username;
            login.password = req.body.password;



            login.save(function (err) {
            if (err)
                res.json({
                    message: 'Not Registered Successfully!'
                });
            else
                res.json({
                message: 'Registered Successfully!',
                data: login
            });
        });
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
            
            Login.findOne({ username: req.body.username , password: req.body.password }, function(err, login) {
                if(err) {
                   //handle error here
                   res.send(err);
                }
             
                //if a user was found, that means the user's email matches the entered email
                if (login) {
                    
                    res.json({
                        message: 'Login success!!!'
                    });


                } 
                else {
        
                    res.json({
                        message: 'Incorrect Password!!!'
                    });
                }

            });

        } 
        else {

            res.json({
                message: 'Invalid Username!!!'
            });
        }
     }); 

};





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
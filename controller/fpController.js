Login = require('./../model/loginModel');
Frpd = require('./../model/fpModel');
var randomstring = require("randomstring");
const jwt=require('jsonwebtoken');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

// Handle index actions
exports.index = function (req, res) {
    Frpd.get(function (err, frgtpwd) {
        if(err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Forgetpwd retrieved successfully",
            data: frgtpwd
        });
    });
};


exports.fpwd = function (req, res) {
    
    Login.findOne({ username: req.body.username, email: req.body.email }, function(err, login) {
        if(err) {
           res.send(err);
        }
     
        //if a user was found, that means the user's email matches the entered email
        if (login) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'mailfromsecab@gmail.com',
                  pass: 'BasilJikkuLithin'
                }
              });
            
            var ld=login._id;
            var emailid=req.body.email;

            Frpd.findOne({ lid: ld }, function(err, f) {
                if(err) {
                    //handle error here
                    res.send(err);
                 }
               
                if(f) {
                    var code = randomstring.generate({
                        length: 5,
                        charset: 'numeric'
                      });
                    
                    
                    //var f = new Frpd();
                    
                    f.code = code;
    
                    f.save(function (err) {
                    if(err)
                        res.json({
                            status: 'fail',
                            message: 'Code Not update Successfully!'
                        });
                    else
                    {
                        var mailOptions = {
                            from: 'mailfromsecab@gmail.com',
                            to: emailid,
                            subject: 'OTP for Account Recovery',
                            html: '<p>Hi ' + login.firstname + ' ' + login.lastname + ',</p><p>We received a request to access your Account through your email address. Your OTP is:</p><br> <p><center><b><font size=10>' + code + '</font></b></center></p><br> <p>If you did not request this code, it is possible that someone else is trying to access your Account. Do not forward or give this code to anyone.</p> <p>You received this message because this email address is listed as the recovery email for the Account.</p> <p>Sincerely yours,</p> <p>The ____ team</p>'
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              res.json({
                                status: "fail",
                                message: 'Mail not send Successfully!'
                            });
                            } else {
                                var token = jwt.sign({
                                    loginId: ld
                                }, 'secret', { expiresIn: 300 });

                                res.json({
                                status: "success",
                                message: 'Code update, Mail send Successfully!',
                                token: token
                                });
                            }
                          });
                    }
                    });

                } else {
                    var code = randomstring.generate({
                        length: 5,
                        charset: 'numeric'
                      });
                   
                    var f = new Frpd();
                    f.lid = ld;
                    f.code = code; 
    
                    f.save(function (err) {
                    if (err)
                        res.json({
                            message: 'Code Not save Successfully!'
                        });
                    else
                    {
                            var mailOptions = {
                            from: 'mailfromsecab@gmail.com',
                            to: emailid,
                            subject: 'OTP for Account Recovery',
                            html: '<p>Hi ' + login.firstname + ' ' + login.lastname + ',</p><p>We received a request to access your Account through your email address. Your OTP is:</p><br> <p><center><b><font size=10>' + code + '</font></b></center></p><br> <p>If you did not request this code, it is possible that someone else is trying to access your Account. Do not forward or give this code to anyone.</p> <p>You received this message because this email address is listed as the recovery email for the Account.</p> <p>Sincerely yours,</p> <p>The ____ team</p>'

                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              //console.log(error);
                              res.json({
                                status: "fail",
                                message: 'Mail not send Successfully!'
                            });
                            } else {
                              //console.log('Email sent: ' + info.response);
                                var token = jwt.sign({
                                    loginId: ld
                                }, 'secret', { expiresIn: 300 });

                                res.json({
                                status: "success",
                                message: 'Code save, Mail send Successfully!',
                                token: token
                                });
                            }
                          });

                    }
                    });
               }
            
            });
           }
       
        else {

            res.json({
                status: 'fail',
                message: 'Invalid Username or email!!!'
            });
        }
     }); 

};



exports.otp = function (req, res) {
    var token = req.body.to;
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'secret', function(err, decoded) {       
        if (err) {
            return res.json({ status: 'false', message: 'Failed to authenticate token.' });       
        } else {

            Frpd.findOne({ lid: decoded.loginId }, function(err, f) {
                if(err) {
                    //handle error here
                    res.send(err);
                 }
                if (f){
                    if(f.code == req.body.code)
                    {
                        res.json({
                            status: "success",
                            message: 'Code Match!'
                        });
                    }
                    else{
                        res.json({
                            status: "fail",
                            message: 'Code Not Match!'
                        });
                    }

                }
                else{
                    
                    res.json({
                        status: "fail",
                        message: 'Try Again!'
                    });
                }
            });

  
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
  
};




exports.rstp = function (req, res) {
    var token = req.body.to;
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'secret', function(err, decoded) {       
        if (err) {
            return res.json({ success: 'false', message: 'Failed to authenticate token.' });       
        } else {

            Login.findOne({ _id: decoded.loginId }, function(err, login) {
                if(err) {
                   //handle error here
                   res.send(err);
                }
             
                //if a user was found, that means the user's email matches the entered email
                if (login) {
                    if(req.body.p1 == req.body.p2)
                    {

                        bcrypt.hash(req.body.p1, 10, function (err, hash){
                            if (err) {
                              return next(err);
                            }

                        login.password = hash;
                    
                        login.save(function (err) {
                        if (err)
                            res.json({
                                status: "fail",
                                message: 'Password Not reset Successfully!'
                            });
                        else
                        {
                            res.json({
                                status: "success",
                                message: 'Password Reset Successfully!'
                            });
                        }

                        });

                        })
                        
                    }
                    else{
                        res.json({
                            status: "fail",
                            message: 'Password Not Match!'
                        });
                    }

                }
                else{
                    
                    res.json({
                        status: "fail",
                        message: 'Try Again!'
                    });
                }
            });
   
        }
        });
    
    } 
    else {
    
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    
    }   

   
};

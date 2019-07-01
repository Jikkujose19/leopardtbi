Up = require('./upModel');
const multer = require('multer');
const jwt=require('jsonwebtoken');
const path   = require('path');

// Handle index actions
exports.index = function (req, res) {
    Up.get(function (err, upload) {
        if(err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Uploads retrieved successfully",
            data: upload
        });
    });
};



var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage,
    limits: { fileSize:900000 },
    fileFilter: function(req, file, callback){
    validateFile(file, callback);
    }
}).array("ph",2);

var validateFile = function(file, cb ){
    allowedFileTypes = /jpeg|jpg|png/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType  = allowedFileTypes.test(file.mimetype);
    if(extension && mimeType){
      return cb(null, true);
    }else{ 
      cb("Invalid file type. Only JPEG, JPG and PNG files are allowed.")
    }
  }
 


exports.upl = function (req, res) {
    var token = req.headers.to;
    if (token) {
        jwt.verify(token, 'secret', function(err, decoded) {       
            if (err) {
                return res.json({ status: 'false', message: 'Failed to authenticate token.' });       
            } 
            else {

                upload(req, res, function(err) {
                    if (err) {
                        res.json({
                            status: 'fail',
                            message: 'Something went wrong!!'
                        });
                        //return res.end("Something went wrong!");
                    }
                    else{
                        var u = new Up();
                        var l = req.files.length;
                        u.lid = decoded.loginId; 
                        u.title =req.body.title;
                        u.amount =req.body.amount;
                        u.category =req.body.category;
                        for(var i=0; i<l; i++)
                            u.filename[i] = req.files[i].path;
                        //u.filename[1] = req.files[1].path;
                                
                        u.save(function (err) {
                        if (err)
                            res.json({
                                //message: 'Image not uploaded Successfully!'
                                status: 'fail',
                                message: 'Not added Successfully!'
                            });
                        else 
                        { 
                            res.json({
                                status: "success",
                                message: 'Added Successfully!'
                            });
                        }
            
                    });
            
                        
                    }
            
                });

            }
        });

    } else {
    
        // if there is no token
        // return an error
        res.json({
            success: 'false', 
            message: 'No token provided.' 
        });
    
      }


};







exports.vw = function (req, res) {
    var token = req.headers.to;
    if (token) {
        jwt.verify(token, 'secret', function(err, decoded) {       
            if (err) {
                return res.json({ status: 'false', message: 'Failed to authenticate token.' });       
            } 
            else {
                Up.find({ lid: decoded.loginId }, { _id: 0, title: 1, amount: 1, category: 1, filename: 1 }, function(err, u) {
                    if(err) {
                        //handle error here
                        res.send(err);
                     }
                    if (u){
                        
                            res.json({
                                status: "success",
                                message: 'Added Items retrieved Successfully!!',
                                data: u
                            });
                        
    
                    }
                    else{
                        
                        res.json({
                            status: "fail",
                            message: 'Try Again!'
                        });
                    }
                }).sort({ create_date: 1 });
                

            }
        });

    } else {
    
        // if there is no token
        // return an error
        res.json({
            success: 'false', 
            message: 'No token provided.' 
        });
    
    }


};



exports.vwall = function (req, res) {
    var token = req.headers.to;
    if (token) {
        jwt.verify(token, 'secret', function(err, decoded) {       
            if (err) {
                return res.json({ status: 'false', message: 'Failed to authenticate token.' });       
            } 
            else {
                Up.find({}, { _id: 0, title: 1, amount: 1, category: 1, filename: 1 }, function(err, u) {
                    if(err) {
                        //handle error here
                        res.send(err);
                     }
                    if (u){
                        
                            res.json({
                                status: "success",
                                message: 'All Items retrieved Successfully!!',
                                data: u
                            });
                        
    
                    }
                    else{
                        
                        res.json({
                            status: "fail",
                            message: 'Try Again!'
                        });
                    }
                }).sort({ create_date: 1 });
                

            }
        });

    } else {
    
        // if there is no token
        // return an error
        res.json({
            success: 'false', 
            message: 'No token provided.' 
        });
    
      }


};




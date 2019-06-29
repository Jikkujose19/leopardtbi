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
    storage: Storage
}).single("ph");





exports.upl = function (req, res) {
    var token = req.body.to;
    if (token) {
        jwt.verify(token, 'secret', function(err, decoded) {       
            if (err) {
                return res.json({ status: 'false', message: 'Failed to authenticate token.' });       
            } 
            else {

                upload(req, res, function(err) {
                    if (err) {
                        return res.end("Something went wrong!");
                    }
                    else{
                        var u = new Up();
                        u.lid = decoded.loginId;
                        u.title =req.body.title;
                        u.amount =req.body.amount;
                        u.category =req.body.category;
                        u.filename = req.file.path;
                                
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




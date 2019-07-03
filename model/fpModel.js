var mongoose = require('mongoose');

// Setup schema

var fpwdSchema = mongoose.Schema({
    lid: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});



// Export Contact model


var Frpd = module.exports = mongoose.model('frgtpwd', fpwdSchema);
module.exports.get = function (callback, limit) {
    Frpd.find(callback).limit(limit);
}
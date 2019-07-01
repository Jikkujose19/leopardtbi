var mongoose = require('mongoose');

var upSchema = mongoose.Schema({
    lid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    filename: {
        type: Array,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});



// Export Contact model


var Up = module.exports = mongoose.model('upload', upSchema);
module.exports.get = function (callback, limit) {
    Up.find(callback).limit(limit);
}
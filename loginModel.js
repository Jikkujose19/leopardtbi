var mongoose = require('mongoose');
// Setup schema
var loginSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    ph: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export Contact model
var Login = module.exports = mongoose.model('login', loginSchema);
module.exports.get = function (callback, limit) {
    Login.find(callback).limit(limit);
}
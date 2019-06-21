// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
// Import contact controller
var loginController = require('./loginController');
// Contact routes
router.route('/logins')
    .get(loginController.index)
    .post(loginController.log);
router.route('/register')
    .post(loginController.new);


/*
    router.route('/logins/:login_id')
    .get(loginController.view)
    .patch(loginController.update)
    .put(loginController.update)
    .delete(loginController.delete);
*/
// Export API routes
module.exports = router;
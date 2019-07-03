// Initialize express router
let router = require('express').Router();
// Set default API response
/*router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
*/
// Import controller
var loginController = require('./controller/loginController');
var fpController = require('./controller/fpController');
var upController = require('./controller/upController');
// Contact routes 
router.route('/logins')
    .get(loginController.index) 
    .post(loginController.log); 
router.route('/register')
    .post(loginController.new);

router.route('/t')
    .get(loginController.tok);

router.route('/up')
    .get(upController.index)
    .post(upController.upl);

router.route('/view')
    .post(upController.vw);

router.route('/viewall')
    .post(upController.vwall);

router.route('/viewit')
    .post(upController.vwit);

router.route('/delete')
    .post(upController.del);


/*
router.route('/lala', sobin); 


async function sobin(req,res){

    console.log('hiii');
}
*/


router.route('/frgtpswd')
    .get(fpController.index)
    .post(fpController.fpwd);
router.route('/otp')
    .post(fpController.otp);
router.route('/rstpwd')
    .post(fpController.rstp);

router.route('/t')
    .get(loginController.tok);


/*
    router.route('/logins/:login_id')
    .get(loginController.view)
    .patch(loginController.update)
    .put(loginController.update)
    .delete(loginController.delete);
*/
// Export API routes
module.exports = router;
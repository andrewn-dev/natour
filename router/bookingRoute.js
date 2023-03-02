const  express =  require('express')
const bookingController  = require('../controler/bookingControler');
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/checkout-session/:tourId',auth,bookingController.getCheckoutSession)
router.get('/',auth,bookingController.getTourBooking)
router.post('/',auth,bookingController.createTourBooking)

module.exports = router 
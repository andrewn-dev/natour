const  express =  require('express')
const reviewCcontroler  = require('../controler/reviewControler');
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/',auth,reviewCcontroler.getAllReviews).post('/',auth,reviewCcontroler.createReview)

module.exports = router 
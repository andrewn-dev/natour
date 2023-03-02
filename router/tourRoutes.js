const express = require('express');
const  tourControler = require('../controler/tourControler')
const auth = require('../middleware/auth')
const router = express.Router();

router
.route('/')
.get(auth, tourControler.getAllTour)
.post(auth,tourControler.createTour)
router.route('/tour-state').get(auth,tourControler.getTourStates);
router
.route('/:id')
.get(auth,tourControler.getTour)
.put(auth,tourControler.uploadTourImages,tourControler.updateTour)
.delete(auth,tourControler.deleteToure);

module.exports  = router;
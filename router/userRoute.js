const express = require('express');
const router = express.Router();
const userControler = require('../controler/userControler');
const authControler = require('../controler/authControler');

router.get('/reset-password',authControler.resetPassword);
router.route('/signup').post(authControler.uploadUserPhoto, authControler.signup);
router.post('/login',authControler.login);
router.post('/forget-password',authControler.forgetPassword);

router.route('/').get(userControler.getAlluser);
router.route('/:id').get(userControler.getUser).put(userControler.updateUser).delete(userControler.deleteUser)



module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
const upload = require('../middleware/upload'); 


router.post('/banners', upload.array('banners', 5), controller.createBanner);
router.get('/getMainBanners', controller.getBanners);

//=========== mid banner==============================================================
router.post('/midbanners', upload.single('banners'), controller.createMidBanners);
router.get('/getmidbanners', controller.getAllBanners);


module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
const upload = require('../middleware/upload'); 

//=========== main banner=================================================================
router.post('/banners', upload.array('banners', 5), controller.createBanner);
router.get('/getMainBanners', controller.getBanners);

//=========== mid banner==================================================================
router.post('/midbanners', upload.single('banners'), controller.createMidBanners);
router.get('/getmidbanners', controller.getAllBanners);

//=========== aboutUs banner==============================================================
router.post('/createAboutUsBanners', upload.single('banners'), controller.createAboutUsBanners);
router.get('/getAboutUsBanners', controller.getAboutUsBanners);

//=========== add  bike =================================================================
router.post('/addBike', upload.single('image'), controller.createBike);
router.get('/getBikes', controller.getBikes);
router.put('/updateBike/:id', upload.single('image'), controller.updateBike);
router.get('/getBikeById/:id', controller.getBikeById);
router.delete('/deleteBike/:id', controller.deleteBike);

//========= vehicle model add ==========================================================
router.post('/createVehicleModel', controller.createVehicleModel);
router.get('/getVehicleModels', controller.getVehicleModels);
router.get('/getVehicleModel/:id', controller.getVehicleModelById);
router.put('/updateVehicleModel/:id', controller.updateVehicleModel);
router.delete('/deleteVehicleModel/:id', controller.deleteVehicleModel);

//================ createVehicleDetails =================================================

router.post('/createVehicleDetails', controller.createVehicleDetails);

//================ createCustomerDetails =================================================
router.post('/createCustomerDetails', controller.createCustomerDetails);








module.exports = router;

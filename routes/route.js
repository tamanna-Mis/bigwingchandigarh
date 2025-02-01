const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
const upload = require('../middleware/upload'); 

//=========== main banner=================================================================
router.post('/banners', upload.array('banners', 5), controller.createBanner);
router.get('/getMainBanners', controller.getBanners);

//=========== mid banner==================================================================
router.post('/midbanners', upload.single('banners'), controller.createMidBanners);
router.get('/getMidAllBanners', controller.getMidAllBanners);

//=========== aboutUs banner==============================================================
router.post('/createAboutUsBanners', upload.single('banners'), controller.createAboutUsBanners);
router.get('/getAboutUsBanners', controller.getAboutUsBanners);

//=========== add  bike =================================================================
//==============upload  Image ==========================================================
router.post("/uploadImage", upload.single("image"), controller.uploadImage);
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.post('/addBikes', controller.createBikes);                                   
router.get('/getAllBikes', controller.getAllBikes);                                  
router.get('/getAllMotorCycle', controller.getAllMotorCycle);                                  
router.get('/getBikeById/:id', controller.getBikeById);                                    
router.post('/updateBike', controller.updateBike);                                   
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

// ============= Contact us ==============================================================

router.post('/addContactUs', controller.addContactUs);

// =========== Finance ===================================================================

router.post('/financeDetails', controller.financeDetails);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//=============================== fully dynamic api table ===================================================================
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/createBikesWithDetails', controller.createBikesWithDetails);
router.get('/getBikesWithDetails', controller.getBikesWithDetails);
router.get('/getBikeByIdWithDetails/:bikeId', controller.getBikeByIdWithDetails);








module.exports = router;

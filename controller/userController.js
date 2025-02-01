const conn = require('../config/conn');

exports.createBanner = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    const sql = 'INSERT INTO mainbanner (banners) VALUES ?';
    const values = imageUrls.map(url => [url]);

    conn.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(201).json({ message: 'Banners uploaded successfully', imageUrls });
    });
};

exports.getBanners = (req, res) => {
    const sql = 'SELECT * FROM mainbanner';

    conn.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch banners' });
        }
        res.json({message:"get images",results});
    });
};


// = =============== mid banners ================================================

exports.createMidBanners = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required for the midBanner' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const sql = 'INSERT INTO midbanners (banners, name) VALUES (?, ?)';
    const values = [imageUrl, name];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(201).json({ message: 'MidBanner uploaded successfully', imageUrl, name });
    });
};

exports.getMidAllBanners = (req, res) => {
    const sql = 'SELECT * FROM midbanners';
    conn.query(sql, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database retrieval failed' });
        }
        res.status(200).json({ message: 'All banners retrieved successfully', banners: result });
    });
};
// = =============== aboutUs banners ================================================

exports.createAboutUsBanners = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const sql = 'INSERT INTO aboutus (banners) VALUES (?)';
    const values = [imageUrl];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(201).json({ message: 'Banner uploaded successfully', imageUrl });
    });
};
exports.getAboutUsBanners = (req, res) => {
    const sql = 'SELECT * FROM aboutus';  
    conn.query(sql, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database retrieval failed' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No banners found' });
        }

        res.status(200).json({ message: 'Banners retrieved successfully', banners: result });
    });
};

//======= Image upload for add bike api ======================================================================

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(201).json({
            message: "Image uploaded successfully",
            imageUrl: imageUrl
        });
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({ error: "Image upload failed" });
    }
};

// ==== Add bike api =================================================================================
exports.createBikes = async (req, res) => {
    try {
        
        const { bikeName, desc, title, priceInCity, engine, power, transmission, specification, colours, image, moreImages } = req.body;

        
        if (!bikeName || !desc || !image || !priceInCity || !specification) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const findBikeName = `SELECT * FROM  bikes WHERE ${bikeName}`;
        if(findBikeName){
            return res.send({ message:"bikeName Already exist . "})
        }

  
        const priceInCityStr = JSON.stringify(priceInCity);
        const specificationStr = JSON.stringify(specification);
        const moreImagesStr = JSON.stringify(moreImages);
        const coloursImagesStr = JSON.stringify(colours);

        // Insert into the database
        const sql = `INSERT INTO bikes 
                    (bikeName, image, description, title, priceInCity, engine, power, transmission, specification, colours, moreImages) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [bikeName, image, desc, title, priceInCityStr, engine, power, transmission, specificationStr, coloursImagesStr, moreImagesStr];

        const [result] = await conn.promise().query(sql, values);

        // Respond with structured JSON
        res.status(201).json({
            bikeName,
            image,
            desc,
            title,
            moreImages: JSON.parse(moreImagesStr),
            priceInCity: JSON.parse(priceInCityStr),
            engine,
            power,
            transmission,
            specification: JSON.parse(specificationStr),
            colours: JSON.parse(coloursImagesStr),
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Database insertion failed" });
    }
};
exports.getAllBikes = async (req, res) => {
    try {
        const sql = "SELECT * FROM bikes";
        const [rows] = await conn.promise().query(sql);
        const bikes = rows.map(bike => ({
            ...bike,
            priceInCity: JSON.parse(bike.priceInCity),
            specification: JSON.parse(bike.specification),
            moreImages: JSON.parse(bike.moreImages)
        }));

        res.status(200).json({ bikes });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Database retrieval failed" });
    }
};

// =====================================================================================================
exports.getAllMotorCycle = async (req, res) => {
    try {
        const sql = 'SELECT id ,    bikeName, image, description FROM bikes';

        conn.query(sql, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }

            // Send the query result as JSON
            res.status(200).json({
                message: 'Bikes retrieved successfully',
                bikes: result,
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getBikeById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM bikes WHERE id = ?";
        const [rows] = await conn.promise().query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Bike not found" });
        }

        const bike = rows[0];
        bike.priceInCity = JSON.parse(bike.priceInCity);
        bike.specification = JSON.parse(bike.specification);
        bike.moreImages = JSON.parse(bike.moreImages);

        res.status(200).json({ bike });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Database retrieval failed" });
    }
};
exports.updateBike = async (req, res) => {
    try {
        const { id } = req.params;
        const { bikeName, desc, title, priceInCity, engine, power, transmission, specification, colours, image, moreImages } = req.body;

        // Convert JSON fields to string
        const priceInCityStr = JSON.stringify(priceInCity);
        const specificationStr = JSON.stringify(specification);
        const moreImagesStr = JSON.stringify(moreImages);

        const sql = `UPDATE bikes SET bikeName=?, image=?, description=?, title=?, priceInCity=?, engine=?, power=?, 
                     transmission=?, specification=?, colours=?, moreImages=? WHERE id=?`;
        const values = [bikeName, image, desc, title, priceInCityStr, engine, power, transmission, specificationStr, colours, moreImagesStr, id];

        const [result] = await conn.promise().query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Bike not found" });
        }

        res.status(200).json({ message: "Bike updated successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Database update failed" });
    }
};
exports.deleteBike = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM bikes WHERE id = ?";
        const [result] = await conn.promise().query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Bike not found" });
        }

        res.status(200).json({ message: "Bike deleted successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Database deletion failed" });
    }
};

//========= vehicle model add ===========================================================================
exports.createVehicleModel = (req, res) => {
    const { vehicleModel } = req.body;
    if (!vehicleModel) {
        return res.status(400).json({ error: 'Vehicle model is required' });
    }

    // SQL query to insert vehicle model data
    const sql = 'INSERT INTO vehicle_models (vehicleModel) VALUES (?)';
    const values = [vehicleModel];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(201).json({ message: 'Vehicle model created successfully', vehicleModel });
    });
};
exports.getVehicleModels = (req, res) => {
    const sql = 'SELECT * FROM vehicle_models';

    conn.query(sql, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database retrieval failed' });
        }
        res.status(200).json({ message: 'Vehicle models retrieved successfully', vehicleModels: result });
    });
};
exports.getVehicleModelById = (req, res) => {
    const vehicleModelId = req.params.id;

    const sql = 'SELECT * FROM vehicle_models WHERE id = ?';
    conn.query(sql, [vehicleModelId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database retrieval failed' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Vehicle model not found' });
        }

        res.status(200).json({ message: 'Vehicle model retrieved successfully', vehicleModel: result[0] });
    });
};
exports.updateVehicleModel = (req, res) => {
    const vehicleModelId = req.params.id;
    const { vehicleModel } = req.body;

    if (!vehicleModel) {
        return res.status(400).json({ error: 'Vehicle model is required' });
    }

    const sql = 'UPDATE vehicle_models SET vehicleModel = ? WHERE id = ?';
    const values = [vehicleModel, vehicleModelId];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vehicle model not found' });
        }

        res.status(200).json({ message: 'Vehicle model updated successfully' });
    });
};
exports.deleteVehicleModel = (req, res) => {
    const vehicleModelId = req.params.id;

    const sql = 'DELETE FROM vehicle_models WHERE id = ?';
    conn.query(sql, [vehicleModelId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database deletion failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vehicle model not found' });
        }

        res.status(200).json({ message: 'Vehicle model deleted successfully' });
    });
};

//================ createVehicleDetails ==================================================================

exports.createVehicleDetails = (req, res) => {
    const { vehicleModel, otherModel, yearOfPurchase, serviceType, registrationNo } = req.body;
    
    if ((!vehicleModel && !otherModel) || !yearOfPurchase || !serviceType || !registrationNo) {
        return res.status(400).json({ error: 'Either vehicleModel or otherModel is required, along with all other fields' });
    }

    const createdAt = new Date();
    const updatedAt = new Date();

    const safeVehicleModel = vehicleModel || "";
    const safeOtherModel = otherModel || "";

    const sql = `INSERT INTO vehicle_details (vehicleModel, otherModel, yearOfPurchase, serviceType, registrationNo, createdAt, updatedAt) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [safeVehicleModel, safeOtherModel, yearOfPurchase, serviceType, registrationNo, createdAt, updatedAt];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(201).json({ message: 'Vehicle details created successfully' });
    });
};

exports.createVehicleDetailsRRRRRRR = async (req, res) => {
    const { vehicleModel, otherModel, yearOfPurchase, serviceType, registrationNo } = req.body;
    if ((!vehicleModel && !otherModel) || !yearOfPurchase || !serviceType || !registrationNo) {
        return res.status(400).json({ error: 'Either vehicleModel or otherModel is required, along with all other fields' });
    }

    const createdAt = new Date();
    const updatedAt = new Date();

    // Ensure empty string instead of NULL for non-nullable columns
    const safeVehicleModel = vehicleModel || "";
    const safeOtherModel = otherModel || "";

    const sql = `INSERT INTO vehicle_details (vehicleModel, otherModel, yearOfPurchase, serviceType, registrationNo, createdAt, updatedAt) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [safeVehicleModel, safeOtherModel, yearOfPurchase, serviceType, registrationNo, createdAt, updatedAt];
    
    try {
        const [result] = await conn.query(sql, values);
        res.status(201).json({ message: 'Vehicle details created successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database insertion failed' });
    }
};



//================ createCustomerDetails ==================================================================
exports.createCustomerDetails = (req, res) => {
    const { userName, email, mobile, comment } = req.body;
    if (!userName || !email || !mobile || !comment) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const createdAt = new Date();

    // SQL query to insert customer details
    const sql = `INSERT INTO customer_details (userName, email, mobile, comment, createdAt) 
                 VALUES (?, ?, ?, ?, ?)`;

    const values = [userName, email, mobile, comment, createdAt];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(201).json({ message: 'Customer details created successfully' });
    });
};

// ============= Contact us ==============================================================================

exports.addContactUs = (req,res)=>{
    try {
        const {name , phone , email, message } = req.body ;

         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
    
        const sql = `INSERT INTO contactus (name , phone , email, message) value (?, ?, ?, ?)`;
        const values = [name , phone , email, message ]
         conn.query(sql,values,(err,result)=>{
            if(err){                
                return res.status(500).json({err:"Database insertion failed"})
            }
            res.status(200).json({message:'ContactUs Details add successfully.'})
        })
        
    } catch (error) {
        console.log(">>>",error);        
        
    }

};

// =========== Finance ============================================================================================

exports.financeDetails = (req,res)=>{
    try {
        const {userName, email, phone, loanAmount, bikeModel, comment} = req.body ;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const sql = `INSERT INTO finance (userName, email, phone, loanAmount, bikeModel, comment) value (?, ?, ?, ?, ?, ?)`;
    
        const value = [userName, email, phone, loanAmount, bikeModel, comment]
        conn.query(sql,value,(err,result)=>{
            if (err){
               return res.status(500).json({ err: " Database insertion error"})
            }
          return  res.status(200).json({message :"finance added successfuliy"})
    
        })    
        
    } catch (error) {
        console.log(error);
        
    }
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//=============================== fully dynamic api table ==========================================================
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.createBikesWithDetails = async (req, res) => {
    const conn = require('../config/conn').promise();

    try {
        const { bikeName, desc, image, title, moreImages, priceInCity, engine, power, transmission, specification, colours } = req.body;

        if (!bikeName || !desc || !image || !priceInCity || !specification) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        await conn.beginTransaction();
        const [bikeResult] = await conn.query(
            "INSERT INTO bikesDeatails (bikeName, description, image) VALUES (?, ?, ?)",
            [bikeName, desc, image]
        );
        
        const bikeId = bikeResult.insertId;
        await conn.query(
            "INSERT INTO bike_titles (bikeId, title, moreImages) VALUES (?, ?, ?)",
            [bikeId, title, JSON.stringify(moreImages)]
        );
        for (const price of priceInCity) {
            await conn.query(
                "INSERT INTO bike_prices (bikeId, cityName, bikeModel, exShowroom) VALUES (?, ?, ?, ?)",
                [bikeId, price.cityName, price.model, price.EX_SHOWROOM]
            );
        }
        await conn.query(
            "INSERT INTO bike_engine_specs (bikeId, engine, power, transmission) VALUES (?, ?, ?, ?)",
            [bikeId, engine, power, transmission]
        );
        await conn.query(
            "INSERT INTO bike_specifications (bikeId, specification) VALUES (?, ?)",
            [bikeId, JSON.stringify(specification)]
        );
        for (const colour of colours) {
            await conn.query(
                "INSERT INTO bike_colours (bikeId, bikeName, bikeImage) VALUES (?, ?, ?)",
                [bikeId, colour.bikeName, colour.bikeImage]
            );
        }
        await conn.commit();

        res.status(201).json({
            message: "Bike created successfully",
            bikeId,
            bikeName,
            desc,
            image,
            title,
            moreImages,
            priceInCity,
            engine,
            power,
            transmission,
            specification,
            colours
        });

    } catch (err) {
        console.error("Error:", err);
        await conn.rollback();
        res.status(500).json({ error: "Database insertion failed" });
    }
};

exports.getBikesWithDetails = async (req, res) => {
    try {
        const sql = `
            SELECT b.bikeId, b.bikeName, b.image, b.description, 
                bt.title, bt.moreImages, 
                be.engine, be.power, be.transmission, 
                bs.specification 
            FROM bikesDeatails b
            LEFT JOIN bike_titles bt ON b.bikeId = bt.bikeId
            LEFT JOIN bike_engine_specs be ON b.bikeId = be.bikeId
            LEFT JOIN bike_specifications bs ON b.bikeId = bs.bikeId
        `;

        const [bikes] = await conn.promise().query(sql);
        for (const bike of bikes) {
            const [prices] = await conn.promise().query(
                `SELECT cityName, bikeModel, exShowroom FROM bike_prices WHERE bikeId = ?`,
                [bike.bikeId]
            );
            const [colours] = await conn.promise().query(
                `SELECT colour FROM bike_colours WHERE bikeId = ?`,
                [bike.bikeId]
            );

            bike.priceInCity = prices;
            bike.colours = colours.map(c => c.colour); 
        }

        res.status(200).json({ bikes });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to fetch bike details" });
    }
};

exports.getBikeByIdWithDetails = async (req, res) => {
    try {
        const { bikeId } = req.params;
        const sql = `
            SELECT b.bikeId, b.bikeName, b.image, b.description, 
                bt.title, bt.moreImages, 
                be.engine, be.power, be.transmission, 
                bs.specification 
            FROM bikesDeatails b
            LEFT JOIN bike_titles bt ON b.bikeId = bt.bikeId
            LEFT JOIN bike_engine_specs be ON b.bikeId = be.bikeId
            LEFT JOIN bike_specifications bs ON b.bikeId = bs.bikeId
            WHERE b.bikeId = ${bikeId}
        `;

        const [bikes] = await conn.promise().query(sql, [bikeId]);

        if (bikes.length === 0) {
            return res.status(404).json({ error: "Bike not found" });
        }

        let bike = bikes[0];
        const [prices] = await conn.promise().query(
            `SELECT cityName, bikeModel, exShowroom FROM bike_prices WHERE bikeId = ?`,
            [bikeId]
        );
        const [colours] = await conn.promise().query(
            `SELECT colour FROM bike_colours WHERE bikeId = ?`,
            [bikeId]
        );

        bike.priceInCity = prices;
        bike.colours = colours.map(c => c.colour);

        res.status(200).json({ bike });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to fetch bike details" });
    }
};






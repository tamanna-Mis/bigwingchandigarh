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

exports.getAllBanners = (req, res) => {
    const sql = 'SELECT * FROM mainbanner';
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

//=========== add  bike =================================================================
exports.createBikeRRRRRRRRRRR = (req, res) => {
    const { bikeName, desc } = req.body;
    if (!bikeName || !desc || !req.file) {
        return res.status(400).json({ error: 'Missing required fields (bikeName, desc, or image)' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // SQL query to insert the new bike into the database
    const sql = 'INSERT INTO bikes (bikeName, image, description) VALUES (?, ?, ?)';
    const values = [bikeName, imageUrl, desc];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }

        res.status(201).json({ message: 'Bike created successfully', bike: { bikeName, imageUrl, desc } });
    });
};
exports.createBike = async (req, res) => {
    try {
        const { bikeName, desc } = req.body;

        if (!bikeName || !desc || !req.file) {
            return res.status(400).json({ error: 'Missing required fields (bikeName, desc, or image)' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const sql = 'INSERT INTO bikes (bikeName, image, description) VALUES (?, ?, ?)';
        const values = [bikeName, imageUrl, desc];
        const [result] = await conn.promise().query(sql, values);
        res.status(201).json({ message: 'Bike created successfully', bike:{bikeName, imageUrl, desc}  });
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ER_BAD_FIELD_ERROR') {
            return res.status(400).json({ error: 'Invalid field(s) in the request' });
        }
        res.status(500).json({ error: 'Database insertion failed' });
    }
};
exports.getBikes = (req, res) => {
    const sql = 'SELECT * FROM bikes'; 
    conn.query(sql, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database retrieval failed' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'No bikes found' });
        }
        res.status(200).json({ message: 'Bikes retrieved successfully', bikes: result });
    });
};
exports.updateBike = (req, res) => {
    const { bikeName, desc } = req.body;
    const bikeId = req.params.id;

    if (!bikeName || !desc) {
        return res.status(400).json({ error: 'Missing required fields (bikeName, desc)' });
    }

    let updateQuery = 'UPDATE bikes SET bikeName = ?, description = ?';
    let values = [bikeName, desc];

    if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        updateQuery += ', image = ?';
        values.push(imageUrl);
    }

    updateQuery += ' WHERE id = ?';
    values.push(bikeId);

    conn.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }
        res.status(200).json({ message: 'Bike updated successfully' });
    });
};
exports.getBikeByIdssss = (req, res) => {
    const bikeId = req.params.id;
    const sql = 'SELECT * FROM bikes WHERE id = ?';
    conn.query(sql, [bikeId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database retrieval failed' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        res.status(200).json({ message: 'Bike retrieved successfully', bike: result[0] });
    });
};

exports.deleteBike = (req, res) => {
    const bikeId = req.params.id;

    const sql = 'DELETE FROM bikes WHERE id = ?';
    
    conn.query(sql, [bikeId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database deletion failed' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        res.status(200).json({ message: 'Bike deleted successfully' });
    });
};
///////////////////////////////////////////////////
//=======
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Generate Image URL
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

exports.createBikes = async (req, res) => {
    try {
        // console.log("Request Body:", req.body);
        const { bikeName, desc, title, priceInCity, engine, power, transmission, specification, colours, image, moreImages } = req.body;

        // Validation: Ensure required fields exist
        if (!bikeName || !desc || !image || !priceInCity || !specification) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Convert JSON fields into string before saving to MySQL
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
            // colours
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







//========= vehicle model add ==========================================================
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
    if (!vehicleModel || !otherModel || !yearOfPurchase || !serviceType || !registrationNo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const createdAt = new Date();
    const updatedAt = new Date();
    const sql = `INSERT INTO vehicle_details (vehicleModel, otherModel, yearOfPurchase, serviceType, registrationNo, createdAt, updatedAt) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [vehicleModel, otherModel, yearOfPurchase, serviceType, registrationNo, createdAt, updatedAt];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(201).json({ message: 'Vehicle details created successfully' });
    });
};

//================ createCustomerDetails ==================================================================
exports.createCustomerDetails = (req, res) => {
    const { userName, email, mobile, comment } = req.body;

    // Validate required fields
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




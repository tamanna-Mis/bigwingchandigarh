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


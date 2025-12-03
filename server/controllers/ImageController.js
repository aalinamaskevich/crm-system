const Category = require("../models/Category");
const Item = require("../models/Item");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads/');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

exports.create = async (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'FILE', message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'FILE', message: 'No file uploaded' });
        }

        const filename = req.file.filename;
        res.status(200).json({ message: filename });
    });
}

exports.readByName = async (req, res) => {
    const name = req.params.name;
    if (!name) {
        res.status(400).json({ keyword: "NAME", message: "Недостаточно данных" });
        return;
    }

    try {
        const imagePath = path.join(__dirname, 'uploads', name);

        fs.access(imagePath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                res.status(404).json({ keyword: "IMAGE_NAME", message: "Изображение не найдено" });
                return;
            }

            res.sendFile(imagePath);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
const express = require('express');
const multer = require('multer');
const {
    uploadFile,
    deleteFile,
    processImageWithSharp
} = require('../controllers/fileController');

const upload = require('../middleware/upload');

const router = express.Router();

// Configure multer for memory storage
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

router.post('/upload', upload, uploadFile);

// Route for processing image with sharp
router.post('/process-sharp', uploadMemory.single('file'), processImageWithSharp);

router.delete('/:filename', deleteFile);

module.exports = router;

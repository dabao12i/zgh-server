const express = require('express');
const {
    uploadFile,
    deleteFile
} = require('../controllers/fileController');

const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload', uploadFile);

router.delete('/:filename', deleteFile);

module.exports = router;

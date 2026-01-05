const asyncHandler = require('../middleware/asyncHandler');
const upload = require('../middleware/upload');
const codes = require('../config/codes');
const fs = require('fs').promises;
const path = require('path');

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Public
exports.uploadFile = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            const error = new Error(err.message || err);
            error.code = codes.INVALID_PARAMS;
            error.isOperational = true;
            return next(error);
        }
        if (req.file === undefined) {
            const error = new Error('Please select a file to upload.');
            error.code = codes.MISSING_PARAMS;
            error.isOperational = true;
            return next(error);
        }

        const fileData = {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            url: `/uploads/${req.file.filename}`
        };

        res.cc(fileData, 'File uploaded successfully');
    });
};

// @desc    Delete a file
// @route   DELETE /api/files/:filename
// @access  Public
exports.deleteFile = asyncHandler(async (req, res, next) => {
    const filename = req.params.filename;
    // Basic validation to prevent path traversal
    if (!filename || filename.includes('..') || filename.includes(path.sep)) {
        const error = new Error('Invalid filename.');
        error.code = codes.INVALID_PARAMS;
        error.isOperational = true;
        return next(error);
    }

    const filePath = path.join(__dirname, '..', 'uploads', filename);

    try {
        await fs.access(filePath); // Check if file exists (throws if not)
    } catch (error) {
        const notFoundError = new Error('File not found.');
        notFoundError.code = codes.NOT_FOUND;
        notFoundError.isOperational = true;
        return next(notFoundError);
    }

    try {
        await fs.unlink(filePath);
        res.cc({ filename }, 'File deleted successfully.');
    } catch (err) {
        const deleteError = new Error('Could not delete the file.');
        deleteError.code = codes.SERVER_ERROR;
        // Let the default error handler log the original error stack
        return next(deleteError);
    }
});

const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// On Vercel the filesystem is read-only (except /tmp), so uploads go to
// Vercel Blob storage instead of local disk in that environment.
const isVercel = !!process.env.VERCEL;

// Make sure upload directory exists (local dev only)
const uploadDir = path.join(__dirname, '../uploads');
if (!isVercel && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        // Unique filename with timestamp and random numbers
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'image-' + uniqueSuffix + ext);
      }
    });

// Image filter validation
const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'));
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/upload - Upload an image (requires auth)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    if (isVercel) {
      const { put } = require('@vercel/blob');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(req.file.originalname).toLowerCase();
      const blob = await put(`image-${uniqueSuffix}${ext}`, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype,
      });

      return res.status(200).json({
        message: 'Image uploaded successfully.',
        url: blob.url,
        filename: blob.pathname,
      });
    }

    // Construct relative URL for database portability
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Image uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server upload error.' });
  }
}, (err, req, res, next) => {
  // Multer error handling
  res.status(400).json({ message: err.message });
});

module.exports = router;

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      const orderId = req.body.orderId || `temp_${Date.now()}`;
      return `ravigraphics/${orderId}`;
    },
    public_id: (req, file) => {
      const timestamp = Date.now();
      const name = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      return `${timestamp}_${name}`;
    },
    resource_type: "auto", // Automatically detects file type
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'psd', 'ai', 'eps', 'svg', 'xls', 'xlsx', 'doc', 'docx', 'txt']
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload endpoint
router.post('/file', upload.array('file', 10), async (req, res) => {
  try {
    const files = req.files;
    const orderId = req.body.orderId || `temp_${Date.now()}`;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    console.log(`📤 Uploading ${files.length} file(s) to Cloudinary for: ${orderId}`);
    
    const uploadedFiles = files.map(file => ({
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      driveLink: file.path, // Cloudinary URL
      downloadLink: file.path,
      fileId: file.filename,
      publicId: file.filename,
      format: file.format,
      bytes: file.bytes
    }));
    
    console.log(`✅ Uploaded ${uploadedFiles.length} file(s) to Cloudinary`);
    
    res.json({ 
      success: true, 
      files: uploadedFiles,
      fileLinks: uploadedFiles.map(f => f.driveLink),
      downloadLinks: uploadedFiles.map(f => f.downloadLink),
      driveLink: uploadedFiles[0]?.driveLink,
      downloadLink: uploadedFiles[0]?.downloadLink
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete file from Cloudinary
router.delete('/file/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    provider: 'cloudinary',
    cloudinaryConfigured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
  });
});

export default router;
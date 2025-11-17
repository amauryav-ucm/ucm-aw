import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Set up Multer storage
const storage = multer.memoryStorage();

// Add file filter to only accept images
const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.json$/)) {
    return cb(new Error('Only JSON files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limtis: {
        fileSize: 1024 * 1024 * 5,
        files: 1
    }
});
app.get("/", (req, res) => {
  res.send(`
    <h1>Image Upload Demo</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
[]
      <input type="file" name="uploadedFile" />
[highlight
      <p>Note: Only JPG, JPEG, PNG, and GIF files under 2MB are allowed</p>
      <button type="submit">Upload</button>
    </form>
  `);
});

app.post("/upload", upload.single('uploadedFile'), (req, res) => {
  // File is available as a buffer in req.file.buffer
    const text = req.file.buffer.toString();  // convert bytes → string

  // If the file is JSON:
  try {
    const json = JSON.parse(text);
    console.log(json);
  } catch (err) {
    console.error("File is not valid JSON:", err);
  }
  res.send(`File uploaded to memory. Size: ${req.file.size} bytes`);
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File too large. Maximum size is 5MB.');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).send('Too many files uploaded.');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).send('Unexpected field name for file upload.');
    }
    // For any other Multer error
    return res.status(400).send(`Upload error: ${err.message}`);
  }

  // For non-Multer errors
  console.error(err);
  res.status(500).send('Something went wrong during file upload.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
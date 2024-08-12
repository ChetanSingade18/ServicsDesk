import multer from "multer";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const path = require('path');
const fs = require('fs');

let __dirname = path.dirname(new URL(import.meta.url).pathname);

if (process.platform === 'win32') {
    __dirname = __dirname.substring(1);
}

const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        const filename = `image-${Date.now()}.${file.originalname}`;
        callback(null, filename);
    }
});

const fileFilter = (req, file, callback) => {
    if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
        return callback(new Error("Only .png .jpg & .jpeg formatted Allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter
});

export default upload;

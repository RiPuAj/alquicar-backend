import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = `assets/${req.params.uuid}`;
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        req.generatedFilename = filename; // Pasamos el nombre generado al controlador
        cb(null, filename);
    }
});

const upload = multer({ storage });
export { upload };

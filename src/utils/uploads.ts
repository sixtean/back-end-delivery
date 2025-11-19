// src/config/multer.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decide a pasta com base no fieldname
    let dir = "";
    if (file.fieldname === "logo") {
      dir = path.join(__dirname, "../uploads/logo");
    } else if (file.fieldname === "ads") {
      dir = path.join(__dirname, "../uploads/ads");
    } else {
      dir = path.join(__dirname, "../uploads/products");
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Pasta criada: ${dir}`);
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

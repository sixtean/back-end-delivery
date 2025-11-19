import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "./cloudinary.js"

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "learnwithai-documents",
    resource_type: "raw",
    type: "upload",
    access_mode: "public",
    public_id: Date.now() + "-" + file.originalname
  })
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    cb(new Error("Only PDF files allowed"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760
  }
})

export default upload
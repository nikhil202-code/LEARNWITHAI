import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "./cloudinary.js"

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => ({
//     folder: "learnwithai-documents",
//     resource_type: "raw",
//     type: "upload",
//     access_mode: "public",
//     public_id: Date.now() + "-" + file.originalname
//   })
// })

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Sanitize filename - remove all special characters
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_')  // replace special chars with _
      .replace(/_{2,}/g, '_')              // collapse multiple underscores
      .replace(/\.pdf$/i, '')              // remove .pdf extension
      .toLowerCase()

    return {
      folder: "learnwithai-documents",
      resource_type: "raw",
      type: "upload",
      access_mode: "public",
      public_id: `${Date.now()}-${sanitizedName}`
    }
  }
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
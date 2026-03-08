import Document from "../models/Document.js"
import { extractTextFromPDF } from '../utils/pdfParser.js'
import { chunkText } from '../utils/textChunker.js'
import fs from 'fs/promises'
import mongoose from "mongoose"
import Flashcard from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'
import axios from "axios"
import fs from "fs"
import path from "path"


export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: 'Please upload a PDF file',
                    statusCode: 400
                })
        }
        const { title } = req.body
        if (!title) {
            await fs.unlink(req.file.path)
            return res
                .status(400)
                .json({
                    success: false,
                    error: 'Please provide a document title',
                    statusCode: 400
                })
        }

        // const baseUrl = `http://localhost:${process.env.PORT || 8000}`
        // const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`

        const document = await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname,
            //filePath: fileUrl,
            filePath: req.file.path,
            fileSize: req.file.size,
            status: 'processing'

        })

        processPDF(document._id, req.file.path).catch(err => {
            console.error('PDF processing error:', err)
        })

        res
            .status(201)
            .json({
                success: true,
                data: document,
                message: 'Document uploaded successfully,processing in progress,'
            })
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { })
        }
        next(error)
    }
}

// //helper function 
// const processPDF = async (documentId, filePath) => {
//     try {
//         const { text } = await extractTextFromPDF(filePath)
//         const chunks = chunkText(text, 500, 50)
//         await Document.findByIdAndUpdate(documentId, {
//             extractedText: text,
//             chunks: chunks,
//             status: 'ready'
//         })
//         console.log(`Document ${documentId} processed successfully`)
//     } catch (error) {
//         console.error(`Error processing document ${documentId}:`, error)
//         await Document.findByIdAndUpdate(documentId, {
//             status: 'failed'
//         })
//     }
// }



const processPDF = async (documentId, fileUrl) => {
    try {

        const tempPath = path.join("temp", `${documentId}.pdf`)

        const response = await axios({
            url: fileUrl,
            method: "GET",
            responseType: "stream"
        })

        const writer = fs.createWriteStream(tempPath)
        response.data.pipe(writer)

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve)
            writer.on("error", reject)
        })

        const { text } = await extractTextFromPDF(tempPath)

        const chunks = chunkText(text, 500, 50)

        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks,
            status: "ready"
        })

        fs.unlinkSync(tempPath)

        console.log(`Document ${documentId} processed successfully`)

    } catch (error) {
        console.error(`Error processing document ${documentId}:`, error)

        await Document.findByIdAndUpdate(documentId, {
            status: "failed"
        })
    }
}




export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'flashcardSets'

                }
            },
             {
                $lookup: {                        // ✅ Add missing quizzes lookup
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'quizzes'
                }
            },
            {
                $addFields: {
                    flashcardCount: { $size: '$flashcardSets' },
                    quizCount: { $size: '$quizzes' }
                }
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0

                }
            },
            {
                $sort: { uploadDate: -1 }
            }
        ])
        res
            .status(200)
            .json({
                success: true,
                count: documents.length,
                data: documents
            })
    } catch (error) {
     next(error)
    }
}


export const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,

        })
        if (!document) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'No document found',
                    statusCode: 404

                })
        }
        // get count of assoiated flashcard and quizzes
        const flashcardCount = await Flashcard.countDocuments({
            documentId: document._id,
            userId: req.user._id
        })

        const quizCount = await Quiz.countDocuments({
            documentId: document._id,
            userId: req.user._id
        })


        //update last accessed 
        document.lastAccessed = Date.now()
        await document.save()

        //combine document data with counts 
        const documentData = document.toObject()
        documentData.flashcardCount = flashcardCount
        documentData.quizCount = quizCount

        res
            .status(200)
            .json({
                success: true,
                data: documentData
            })


    } catch (error) {
        next(error)
    }
}


export const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        })
        if (!document) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: 'Document not found',
                    statusCode: 404
                })
        }
        //delete file from filesystem
       // await fs.unlink(document.filePath).catch(() => { })

        //delete doc
        await document.deleteOne()

        res
            .status(200)
            .json({
                success: true,
                message: 'Document deleted',

            })


    } catch (error) {
        next(error)
    }
}


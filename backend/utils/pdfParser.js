import fs from 'fs/promises'
import { PDFParse } from 'pdf-parse'

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath)

    const parser = new PDFParse(new Uint8Array(dataBuffer))
    const data = await parser.getText()

    return {
      text: data.text,
      numPages: data.numPages,
      info: data.info
    }

  } catch (error) {
    console.error("PDF parsing error", error)
    throw new Error("Failed to extract text from PDF")
  }
}



































// import fs from 'fs/promises'
// import { PDFParse } from 'pdf-parse'

// export const extractTextFromPDF=async(filePath)=>{
//     try {
//         const dataBuffer= await fs.readFile(filePath)
//         console.log(dataBuffer); // looks like gibberish
//         const parser= new PDFParse(new Uint8Array(dataBuffer))
//         const data =await parser.getText()

//         return{
//             text:data.text,
//             numPages:data.numPages,
//             info:data.info

//         }
//     } catch (error) {
//         console.error("PDF parsing error",error);
//         throw new Error("Failed to extract text from PDF")
//     }
// }

/* 
PDF file on disk
   ↓
fs.readFile()
   ↓
Buffer (raw bytes) The entire PDF file is loaded into memory as a Buffer.
   ↓               (Raw binary data (bytes),not text,not json , just 0s and 1s )
Uint8Array
   ↓
PDF parser
   ↓
Extracted text


*/
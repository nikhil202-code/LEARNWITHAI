import express from 'express'
import{
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
} from '../controllers/quizController.js'
import protect from '../middleware/auth.js'

const router= express.Router()
router.use(protect)

//  router.get('/:documentId',getQuizzes)
//  router.get('/quiz/:id',getQuizById)
//  router.post('/:id/submit',submitQuiz)
//  router.get('/:id/results',getQuizResults)
//  router.delete('/:id',deleteQuiz)

router.get('/quiz/:id', getQuizById)
router.get('/quiz/:id/results', getQuizResults)
router.post('/quiz/:id/submit', submitQuiz)
router.delete('/quiz/:id', deleteQuiz)
router.get('/:documentId', getQuizzes)  
 export default router


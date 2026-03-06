import React,{useState,useEffect} from 'react'
import { Plus,Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import aiService from '../../services/aiService.js'
import quizService from  '../../services/quizService.js'
import Spinner from '../common/Spinner.jsx'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import QuizCard from './QuizCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

const QuizManager = ({documentId}) => {
    const[quizzes,setQuizzes]=useState([])
    const[loading,setLoading]=useState(true)
    const[generating,setGenerating]=useState(false)
    const[isGenerateModalOpen,setIsGenerateModalOpen]=useState(false)
    const[numQuestions,setNumQuestions]=useState(5)
    const[isDeleteModalOpen,setIsDeleteModalOpen]=useState(false)
    const[deleting,setDeleting]=useState(false)
    const[selectedQuiz,setSelectedQuiz]=useState(null)

    const fetchQuizzes=async()=>{
        setLoading(true)
        try {
            const data=await quizService.getQuizzesforDocument(documentId)
            setQuizzes(data.data)
        } catch (error) {
            toast.error('Failed to fetch quizzes.')
            console.error(error)            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
     if(documentId){
        fetchQuizzes()
     }
    },[documentId])

    const handleGenerateQuiz= async(e)=>{
        e.preventDefault()
        setGenerating(true)
        try {
            await aiService.generateQuiz(documentId,{numQuestions})
            toast.success('Quiz generated successfully')
        } catch (error) {
            toast.error(error.message || 'Failed to generate Quiz')
        } finally{
            setGenerating(false)
        }
    }

    const handleDeleteRequuest=(quiz)=>{
        setSelectedQuiz(quiz)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete=async()=>{

    }

    const renderQuizContent=()=>{
        if(loading){
            return <Spinner/>
        }
        if(quizzes.length===0){
            return(
                <EmptyState
                title='No Quizzes Yet'
                description='Generate a quiz from your document to test your knowledge'
                />
            )
        }
    }

  return (
    <div className='bg-white border border-neutral-200 rounded-lg p-6'>
       <div className='flex justify-end gap-2 mb-4'>
        <Button onClick={()=>setIsGenerateModalOpen(true)}>
            <Plus size={16}/>
              Generate Quiz
        </Button>
       </div>
    </div>
  )
}

export default QuizManager

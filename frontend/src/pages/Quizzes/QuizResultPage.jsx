import React,{useState,useEffect} from 'react'
import { useParams,Link } from 'react-router-dom'
import quizService from '../../services/quizService.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import toast from 'react-hot-toast'
import { ArrowLeft,CheckCircle2,XCircle,Trophy,Target,BookOpen} from 'lucide-react'

const QuizResultPage = () => {
  return (
    <div>
      Quiz Result Page
    </div>
  )
}

export default QuizResultPage

import React,{useState,useEffect}from 'react'
import flashcardService from '../../services/flashcardService.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard.jsx'
import toast from 'react-hot-toast'
const FlashcardListPage = () => {
  const[flashcardSets,setFlashcardSets]=useState([])
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
       const fetchFlashcardSets=async()=>{
        try {
          const response= await flashcardService.getAllFlashcardSets()
          //console.log('fetchFlashcardSets__',response.data)
          setFlashcardSets(response.data)
        } catch (error) {
          toast.error('Failed to fetch Flashcard Sets')
          console.error(error)
          
        }finally{
          setLoading(false)
        }
       }
       fetchFlashcardSets()
  },[])

  const  renderContent=()=>{
    if(loading){
      return <Spinner/>
    }

    if(flashcardSets.length===0){
      return (
        <EmptyState
        title='No Flashcard Sets Found'
        description='You have not generated any flashcards yet. Go to documents to create new flashcard sets'
        />
      )
    }

    return(
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {flashcardSets.map((set)=>(
          <FlashcardSetCard key={set._id} flashcardSet={set}/>
        ))}
      </div>
    )
  }


  return (
    <div>
      <PageHeader title='All Flashcard Sets'/>
      {renderContent()}
    </div>
  )
}

export default FlashcardListPage

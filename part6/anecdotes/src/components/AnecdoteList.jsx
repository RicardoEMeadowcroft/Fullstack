import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const Anecdote = ({anecdote, handleClick}) => {
	return(
		<div key={anecdote.id}>
			<div>
				{anecdote.content}
			</div>
			<div>
				has {anecdote.votes}
				<button onClick={handleClick}>vote</button>
			</div>
		</div>
	)

}

Anecdote.propTypes = {
	anecdote: PropTypes.object.isRequired,
	handleClick: PropTypes.func.isRequired
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({anecdotes, filter}) => {
      return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const handleVote = (anecdote) => {
    dispatch(addVote(anecdote.id))
    dispatch(setNotification('you voted \'' + anecdote.content + '\''))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return anecdotes.toSorted((a,b) => b.votes - a.votes).map(anecdote =>
    <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => handleVote(anecdote)} />
  )
}

export default AnecdoteList
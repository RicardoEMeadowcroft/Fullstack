import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

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

  return anecdotes.toSorted((a,b) => b.votes - a.votes).map(anecdote =>
    <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => dispatch(addVote(anecdote.id))} />
  )
}

export default AnecdoteList
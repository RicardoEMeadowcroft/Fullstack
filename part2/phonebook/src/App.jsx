import { useState, useEffect} from 'react'
import axios from 'axios'

const Filter = ({value, onChange}) => {
  return (
    <>
      filter shown with: <input value={value} onChange={onChange}/>
    </>
  )
}

const PersonForm = ({name, onNameChange, number, onNumberChange, onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={name} onChange={onNameChange}/>
      </div>
      <div>
        number: <input value={number} onChange={onNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({person}) => {
  return <p>{person.name} {person.number}</p>
}

const Persons = ({persons}) => {
  return (
    <>
      {persons.map(person => 
        <Person key={person.id} person={person} />
      )}
    </>
  )
}

const App = () => {
 const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
  }, [])

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    }
      else {
      setNewName('')
      setNewNumber('')
      const person = { name: newName, number: newNumber, id: persons.length+1 }
      setPersons(persons.concat(person))
    }
  }

  const updateName = (event) => {
    setNewName(event.target.value)
  }

  const updateNumber = (event) => {
    setNewNumber(event.target.value)
  }
  
  const updateFilter = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter value={filter} onChange={updateFilter} />
      
      <h2>add a new</h2>

      <PersonForm name={newName} onNameChange={updateName} number={newNumber} onNumberChange={updateNumber} onSubmit={addPerson} />

      <h2>Numbers</h2>

      <Persons persons={filteredPersons}/>
    </div>
  )
}

export default App
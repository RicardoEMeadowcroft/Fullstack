/* eslint-disable no-unused-vars */
import { useState } from 'react'

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
 const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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
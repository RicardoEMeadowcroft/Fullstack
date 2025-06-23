import { useState, useEffect} from 'react'

import personService from './services/persons'
import Person from './components/Person'
import Notification from './components/Notification'

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

const Persons = ({persons, deleteById}) => {
  return (
    <>
      {persons.map(person => 
        <Person key={person.id} person={person} onDelete={() => deleteById(person.id)}/>
      )}
    </>
  )
}

const App = () => {
 const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(obtainedPersons => {
        console.log('promise fulfilled')
        setPersons(obtainedPersons)
      })
  }, [])

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = { name: newName, number: newNumber }
        const id = persons.find(person => person.name === newName).id
        personService
          .replace(id, person)
          .then(returnedPerson => {
            console.log(returnedPerson)
            setPersons(persons.map(person => person.name === newName ? returnedPerson : person))
            setNewName('')
            setNewNumber('')
            setNotificationMessage(`Changed ${person.name}'s number`)
            setIsError(false)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)
          })
          .catch(() => {
            setNotificationMessage(`${person.name} was already deleted`)
            setIsError(true)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)
            setPersons(persons.filter(n => n.name !== newName))
          })
      }
    }
    else {
      const person = { name: newName, number: newNumber }
      personService
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
            setNotificationMessage(`Added ${person.name}`)
            setIsError(false)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)
        })
        .catch(() => {
          setNotificationMessage(`Invalid Format`)
          setIsError(true)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
      
    }
  }

  const deleteById = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotificationMessage(`Deleted ${person.name}`)
          setIsError(false)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
        .catch(() => {
          setNotificationMessage(`${person.name} was already deleted`)
          setIsError(true)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
          setPersons(persons.filter(n => n.id !== id))
        })
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

      <Notification message={notificationMessage} isError={isError}/>
      
      <Filter value={filter} onChange={updateFilter} />
      
      <h2>add a new</h2>

      <PersonForm name={newName} onNameChange={updateName} number={newNumber} onNumberChange={updateNumber} onSubmit={addPerson} />

      <h2>Numbers</h2>

      <Persons persons={filteredPersons} deleteById={deleteById}/>
    </div>
  )
}

export default App
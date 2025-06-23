const Person = ({person, onDelete}) => {
  console.log(person)
  return (
    <p>
        {person.name} {person.number} <button onClick={onDelete}>delete</button>
    </p>
  )
}

export default Person
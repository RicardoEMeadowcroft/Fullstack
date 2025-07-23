import { useState, forwardRef, useImperativeHandle } from 'react'

const Notification = forwardRef((props, refs) => {

  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const styleClass = isError ? "error" : "notification"
  
  const setNotification = (message, isError) => {
      setMessage(message)
      setIsError(isError)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
  }

  useImperativeHandle(refs, () => {
    return {
      setNotification
    }
  })

  if (message === null) {
    return null
  }

  return (
    <div className={styleClass}>
      {message}
    </div>
  )
})

export default Notification
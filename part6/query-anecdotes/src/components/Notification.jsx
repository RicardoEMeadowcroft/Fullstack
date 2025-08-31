import { useNotificationValue } from "../NotificationContext"

const Notification = () => {
  const { visible, text } = useNotificationValue()
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  // eslint-disable-next-line no-constant-condition
  if (!visible) return null

  return (
    <div style={style}>
      { text }
    </div>
  )
}

export default Notification

import { useSelector } from 'react-redux'

const Notification = () => {
  const text = useSelector(({notification}) => notification.text)
  const visible = useSelector(({notification}) => notification.visible)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: visible ? '' : 'none'
  }
  return (
    <div style={style}>
      {text}
    </div>
  )
}

export default Notification
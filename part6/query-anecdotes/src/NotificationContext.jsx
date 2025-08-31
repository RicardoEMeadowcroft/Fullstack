import { createContext, useReducer, useContext } from 'react'
import PropTypes from 'prop-types';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
        return {
            visible: true,
            text: action.payload
        }
    case "REMOVE_NOTIFICATION":
        return {
            visible: false,
            text: ''
        }
    default:
        return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, { visible: false, text: '' })

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotificationValue = () => {
  const counterAndDispatch = useContext(NotificationContext)
  return counterAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const counterAndDispatch = useContext(NotificationContext)
  return counterAndDispatch[1]
}


export const setNotification = (dispatch, text, timeout) => {
  dispatch({ type: 'ADD_NOTIFICATION', payload: text })
  setTimeout(() => {
    dispatch({ type: 'REMOVE_NOTIFICATION' })
  }, timeout*1000)
}

export default NotificationContext
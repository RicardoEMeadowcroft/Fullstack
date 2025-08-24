import { createSlice, current } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    text: '',
    visible: false
  },
  reducers: {
    addNotification(state, action) {
      console.log(current(state))
      state.visible = true
      state.text = action.payload
    },
    removeNotification(state) {
      state.visible = false
    }
  }
})

export const { addNotification, removeNotification } = notificationSlice.actions

export const setNotification = (text, timeout) => {
  return async dispatch => {
    dispatch(addNotification(text))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout*1000)
  }
}

export default notificationSlice.reducer
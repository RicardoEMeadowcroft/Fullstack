import { createSlice, current } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    text: '',
    visible: false
  },
  reducers: {
    setNotification(state, action) {
      console.log(current(state))
      state.visible = true
      state.text = action.payload
    },
    removeNotification(state) {
      state.visible = false
    }
  }
})

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
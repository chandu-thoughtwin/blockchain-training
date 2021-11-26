export const accountsReducer = (state = {}, { type, payload }) => {
  console.log(type)
  switch (type) {
    case 'ACCOUNT':
      return { ...state, ...payload }
    case 'REMOVE_SELECTED_ACCOUNT':
      return {}
    default:
      return state
  }
}

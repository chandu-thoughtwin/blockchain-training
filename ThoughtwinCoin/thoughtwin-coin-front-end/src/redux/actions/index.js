export const setAccounts = (account) => {
  return {
    type: 'ACCOUNT',
    payload: account,
  }
}

export const removeSelectedAccounts = () => {
  return {
    type: 'REMOVE_SELECTED_ACCOUNT',
  }
}

import { combineReducers } from 'redux'
import { accountsReducer } from './reducers'

const rootReducer = combineReducers({
  accounts: accountsReducer,
})
export default rootReducer

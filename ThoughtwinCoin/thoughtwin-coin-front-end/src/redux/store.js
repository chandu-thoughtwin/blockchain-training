import rootReducer from './rootreducer'
import { createStore } from 'redux'

const store = createStore(rootReducer, {})

export default store

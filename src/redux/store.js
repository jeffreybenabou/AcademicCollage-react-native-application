import { createStore, combineReducers } from 'redux';
import AppReducer from './AppReducer';


const rootReducer = combineReducers({
    appReducer: AppReducer
});

const configureStore = () => createStore(rootReducer);

export default configureStore;

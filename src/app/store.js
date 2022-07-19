import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSaga, rootReducer } from 'saga-slice';

// Bring in all of your saga slices together in whatever file
// you're going to declare your redux store
import AlbumSlice from './sagaSlice.js';

// And add all of your saga slices into an array
const modules = [
    AlbumSlice
];

const sagaMiddleware = createSagaMiddleware();

// Use the `rootReducer` helper function to create a
// main reducer out of the array of saga-slice modules.
// You can optionally pass other reducers to this root
// reducer for cases where you have something outside the
// scope of saga-slice
const appReducer = rootReducer(modules, {
    //myExtraReducer: (state, action) => { /* do stuff */ }
});

// Typicaly redux middleware
const middleware = applyMiddleware(...[
    sagaMiddleware,
    /* redux dev tools, etc*/
])

const store = createStore(appReducer, middleware);

// Use the `rootSaga` helper function to create a generator function
// which will instantiate all sagas using the `*all()` effect based
// on the saga-slice modules array
sagaMiddleware.run(rootSaga(modules));

export default store;
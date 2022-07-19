import { put, select, takeLatest } from "redux-saga/effects";
import { createModule } from 'saga-slice';
import axios from "axios";

const sagaSlice =  createModule({
    // Key name that gets added to combineReducers
    name: 'album',
    initialState: {
        data: null,
        currentAlbumId: 1,
        totalAmount: 0,
        error: null,
        isFetching: false,
    },
    // Defining a reducer also defines a type and action.
    // The type will be `album/fetch`, using the pattern of `{name}/{key}`
    reducers: {
        fetch: (state,payload) => {
            state.isFetching = true;
        },
        delete: (state) => {
            state.isFetching = true;
        },
        upload: (state) => {
            state.isFetching = true;
        },
        save: (state) => {
            state.isFetching = true;
        },
        saveSuccess: (state, payload) => {
            state.isFetching = false;
            const data = state.data;
            data.every((photo,index) => {
                if(photo.id === payload.id) {
                    state.data[index] = payload;
                    return false;//break eq
                }
                return true;
            });
            console.log("saveSuccess");
        },
        fetchSuccess: (state, payload) => {
            state.isFetching = false;
            state.totalAmount = payload.length;
            payload.length = 100;
            state.data = payload;
            console.log("fetchSuccess", state.totalAmount)
        },
        uploadSuccess: (state, payload) => {
            state.isFetching = false;
            state.data.unshift(payload);
            state.totalAmount = state.data.length;
            console.log("uploadSuccess ", state.totalAmount);
        },
        deleteSuccess: (state, payload) => {
            state.isFetching = false;
            const data = state.data;
            data.every((photo,index) => {
                if(photo.id === payload.id) {
                    state.data.splice(index, 1);
                    return false;//break eq
                }
                return true;
            });
            state.totalAmount = state.data.length;
            console.log("deleteSuccess ",state.totalAmount);
        },
        fetchFail: (state, payload) => {
            state.isFetching = false;
            state.error = payload;
            console.log("fetchFail ", state.error);
        }
    },
    // The sagas option is a function that gets passed the Actions object.
    // Actions are converted into strings which are the value of its
    // corresponding type. You can also use the actions object to dispatch
    // actions from sagas using the `put` effect.
    sagas: (actions) => ({
        [actions.fetch]: {
            saga: function* (){
                    try {
                        const { data } = yield axios.get('https://jsonplaceholder.typicode.com/photos');
                        yield put(actions.fetchSuccess(data));
                    }
                    catch (e) {
                        yield put(actions.fetchFail(e));
                    }
            },
            taker: takeLatest
        },[actions.upload]: {
            saga: function* (action){
                    try {
                        const url = action.payload;
                        const photo = {
                            albumId: 100,
                            thumbnailUrl: url,
                            title: "new photo",
                            url
                        }
                        const { data } = yield axios.post('https://jsonplaceholder.typicode.com/photos', photo);
                        console.log("actions.upload", data)
                        yield put(actions.uploadSuccess(data));
                    }
                    catch (e) {
                        yield put(actions.fetchFail(e));
                    }
            },
            taker: takeLatest
        },
        [actions.delete]: {
            saga: function* (action){
                    try {
                        const { data } = yield axios.get(`https://jsonplaceholder.typicode.com/photos/${action.payload}`);
                        console.log("delete saga",data);
                        yield put(actions.deleteSuccess(data));
                    }
                    catch (e) {
                        yield put(actions.fetchFail(e));
                    }
            },
            taker: takeLatest
        },
        [actions.save]: {
            saga: function* (action){
                    try {
                        const photo = action.payload;
                        const { data } = yield axios.put(`https://jsonplaceholder.typicode.com/photos/${photo.id}`, photo);
                        yield put(actions.saveSuccess(data));
                    }
                    catch (e) {
                        yield put(actions.fetchFail(e));
                    }
            },
            taker: takeLatest
        }

    })
});

// Export actions for convenience when importing from other modules
export const { actions } = sagaSlice.actions;
export default sagaSlice;
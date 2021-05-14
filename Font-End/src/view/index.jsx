// import './common/scss/bootstrap/bootstrap.scss';
// import './common/scss/common.scss';
import './common/scss/themes/style.scss';
import './common/scss/custom.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import systemReducer, { getSystemState } from './redux/system.jsx';
// import jobHubReducer from './redux/jobHub';
// import categoryReducer from './redux/category';
// import newsReducer from './redux/news';
// import contactReducer from './redux/contact';
// import notificationReducer from './redux/notification';
import adminReducer from './redux/admin.jsx';
import userReducer, { getLoginUser } from './redux/user.jsx';
import Router from './common/Router.jsx';

// Initialize Redux ----------------------------------------------------------------------------------------------------
const allReducers = combineReducers({
    system: systemReducer,
    // jobHub: jobHubReducer,
    // category: categoryReducer,
    // news: newsReducer,
    // contact: contactReducer,
    // notification: notificationReducer,
    admin: adminReducer,
    user: userReducer,
});
const initStore = {};
const store = createStore(allReducers, initStore, composeWithDevTools(applyMiddleware(thunk)));
store.dispatch(getSystemState());

// getLoginUser()(store.dispatch);
// store.dispatch(updateUser('Thanh Tung'));
// console.log(store.getState());

// Main DOM render -----------------------------------------------------------------------------------------------------
class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Router system={this.props.system} user={this.props.user} />
            </BrowserRouter >
        )
    }
}

const mapStateToProps = state => ({
    system: state.system,
    user: state.user
});
const Main = connect(mapStateToProps)(App);
ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById('app'));
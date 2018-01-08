import ACTION_LIST from '../actions/actions';

const loginReducer = (state = {}, action: any) => {

    console.log('Login reducer called with state ', state, 'and action ', action);

    if (action.type === ACTION_LIST.ADD_TODO) {
        return state;
    } else {
        return state;
    }

};

export default loginReducer;
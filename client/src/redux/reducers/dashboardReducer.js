import ACTION_LIST from "../actions/actions";

const dashboardReducer = (state = {}, action) => {

    console.log("Dashboard reducer called with state ", state, "and action ", action);

    if(action.type==ACTION_LIST.ADD_TODO){
        console.log("Received ADD_TODO, state: ", state)
        console.log("Received ADD_TODO, action data: ", action.data)
        return {
            ...state,
            user: action.data
        }
    }else if(action.type==ACTION_LIST.SUB_TODO) {
        console.log("Received SUB_TODO, state: ", state)
        console.log("Received SUB_TODO, action data: ", action.data)
        return {
            ...state,
            newUser: action.newUser
        }
    }else{
        return state;
    }

};

export default dashboardReducer;
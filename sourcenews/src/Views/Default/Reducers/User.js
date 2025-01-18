"use strict";

/* Package System */
import ActionTypes from '@config/ActionTypes';

const initialState = {}

const User=(state=initialState,action)=>{

	switch(action.type){
		case ActionTypes.SET_USER:
			return action.payload.value
			break;
		case ActionTypes.LOGOUT:
			return initialState
			break;
		default:
			return state;
			break;
	}
}

export default User;
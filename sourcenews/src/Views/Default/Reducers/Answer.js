"use strict";

/* Package System */
import ActionTypes from '@config/ActionTypes';

const initialState = '';

const Answer=(state=initialState,action)=>{

	switch(action.type){
		case ActionTypes.SET_ANSWER:
			return action.payload.value
			break;
		default:
			return state;
			break;
	}
}

export default Answer;
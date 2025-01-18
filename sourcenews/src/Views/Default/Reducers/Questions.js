"use strict";

/* Package System */
import ActionTypes from '@config/ActionTypes';

const initialState = []

const Questions=(state=initialState,action)=>{

	switch(action.type){
		case ActionTypes.SET_QUESTIONS:
			return action.payload.value
			break;
		default:
			return state;
			break;
	}
}

export default Questions;
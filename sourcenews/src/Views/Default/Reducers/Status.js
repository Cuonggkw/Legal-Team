"use strict";

/* Package System */
import ActionTypes from '@config/ActionTypes';

const initialState = {
	loading:false,
	darkMode:true,
	open:{
		search:false,
		notification:false,
		notification_m:false,
		user:false,
		user_m:false,
		question: false,
		ranking: false,
		isJoin: false,
		congrat: false,
		finish: false,
		apply: false,
	},
	modal:{
		open:false,
		page:'signIn'
	},
	otp:{type:'',values:{}},
	status:{
		isSuccessful:false,
		isFailure:false,
		isError:false,
		msg:{
			errors:[],
			text:''
		}
	},
}

const Status = (state = initialState,action) => {

	switch (action.type) {
		case ActionTypes.SET_DARKMODE:
			return {...state,darkMode:action.payload.value}
			break;
		case ActionTypes.RESET_OPEN:
			return {...state,open:{...initialState.open}}
			break;
		case ActionTypes.OPEN_SEARCH:
			return {...state,open:{...initialState.open,search:action.payload.value}}
			break;
		case ActionTypes.OPEN_NOTIFICATION:
			return {...state,open:{...initialState.open,notification:action.payload.value}}
			break;
		case ActionTypes.OPEN_NOTIFICATION_M:
			return {...state,open:{...initialState.open,notification_m:action.payload.value}}
			break;
		case ActionTypes.OPEN_USER:
			return {...state,open:{...initialState.open,user:action.payload.value}}
			break;
		case ActionTypes.OPEN_USER_M:
			return {...state,open:{...initialState.open,user_m:action.payload.value}}
			break;
		case ActionTypes.OPEN_MODAL:
			let _open = state.modal.open;
			if(action.payload.value&&action.payload.value!=state.modal.page) _open=true;
			else _open = !_open;

			return {...state,modal:{...initialState.modal,open:_open,page:action.payload.value}}
			break;
		case ActionTypes.VERIFY_OTP:
			return {...state,otp:{...initialState.otp,type:action.payload.type,values:action.payload.value}}
			break;
		case ActionTypes.OPEN_WELCOME:
			return {...state,open:{...initialState.open,welcome:action.payload.value}}
			break;
		case ActionTypes.OPEN_QUESTION:
			return {...state,open:{...initialState.open,question:action.payload.value}}
			break;
		case ActionTypes.JOIN_GAME:
			return {...state,open:{...initialState.open,welcome:action.payload.value.welcome,question:action.payload.value.question, isJoin: action.payload.value.isJoin}}
			break;
		case ActionTypes.OPEN_RANKING:
			return {...state,open:{...initialState.open,ranking:action.payload.value}}
			break;
		case ActionTypes.OPEN_CONGRAT:
			return {...state,open:{...initialState.open,congrat:action.payload.value}}
			break;
		case ActionTypes.OPEN_FINISH:
			return {...state,open:{...initialState.open,finish:action.payload.value}}
			break;
		case ActionTypes.OPEN_APPLY:
			return {...state,open:{...initialState.open,apply:action.payload.value}}
			break;
		case ActionTypes.SET_STATUS:
			return { ...state, status: { ...initialState.status, ...action.payload.value } }
			break;
		case ActionTypes.RESET_STATUS:
			return { ...state, status: { ...initialState.status} }
			break;
		default:
			return state;
			break;
	}
}

export default Status;
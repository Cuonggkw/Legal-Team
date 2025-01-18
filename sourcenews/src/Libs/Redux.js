"use strict";

/* Package System */
import {createStore,applyMiddleware,combineReducers} from 'redux';
import ReduxThunk from 'redux-thunk';

/* Application */
import Status from '@views/Default/Reducers/Status';
import User from '@views/Default/Reducers/User';
import Questions from '@views/Default/Reducers/Questions';
import Answer from '@views/Default/Reducers/Answer';
class Redux{

	initStore=()=>{
		return createStore(
			this.initReducer(),
			applyMiddleware(ReduxThunk)
		);
	}

	initReducer=asyncReducers=>{
		return combineReducers({
			status:Status,
			user:User,
			questions: Questions,
			answer: Answer,
			...asyncReducers
		});
	}
}

module.exports = new Redux;
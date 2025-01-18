"use strict";

/* Package System */
import ActionTypes from '@config/ActionTypes';
/* Application */
import Cookies from 'js-cookie';
import {fetchApi,postApi,capitalize,urlCDNS3,putApi,deleteApi} from '@helpers/Common';

module.exports = class Action{

	setDarkMode=value=>{
		let _bodyNode = document.getElementsByTagName("body")[0];
		if(value==true){
			_bodyNode.classList.remove('__tt-light-mode');
			_bodyNode.classList.add('__tt-dark-mode');	
		} 
		else{
			_bodyNode.classList.remove('__tt-dark-mode');
			_bodyNode.classList.add('__tt-light-mode');
		} 
			
		return dispatch=>{
			dispatch({type:ActionTypes.SET_DARKMODE,payload:{value}});
		}
	}

	setStatus=(type,value)=>{
		let _bodyNode = document.getElementsByTagName("body")[0];
		if(value==true) _bodyNode.classList.add('ovh');
		else _bodyNode.classList.remove('ovh');

		return dispatch=>{
			dispatch({type,payload:{value}});
		}
	}

	resetOpen=()=>{
		let _bodyNode = document.getElementsByTagName("body")[0];
		_bodyNode.classList.remove('ovh');

		return dispatch=>{
			dispatch({type:ActionTypes.RESET_OPEN});
		}
	}

	setUser=value=>{
		return dispatch=>{
			if(value.access_token && value.id){
				value.accessToken = value.access_token;
				value.refreshToken = value.refresh_token;
				this.updateDataUser(value);
				dispatch({type:ActionTypes.SET_USER,payload:{value:value}});
			}
			else if(value.access_token){
				fetchApi(process.env.API_USER_URL+'me',value.access_token).then(result=>{
					if(result.data.status=='success'){
						let _result = result.data.result;
						if(value?.isAuthEmail)_result.isAuthEmail = value.isAuthEmail;
						_result.accessToken = value.access_token;
						_result.refreshToken = value.refresh_token;
						_result.access_token = value.access_token;
						_result.refresh_token = value.refresh_token;
						this.updateDataUser(_result);
						dispatch({type:ActionTypes.SET_USER,payload:{value:_result}});
					}
				}).catch(e=>{this.handleLogOut()});
			}
		}
	}

	updateDataUser=value=>{
		let _dataUser = value;
		let _avatar = (typeof _dataUser.avatar !== 'undefined' && _dataUser?.avatar && _dataUser.avatar != null)  ? urlCDNS3(_dataUser.avatar) : 'https://cdn.netlove.com.vn/images/637426030003150256_default_person.png';
		_dataUser.avatar = _avatar;
		_dataUser.username = _dataUser?.isAuthEmail ? _dataUser.email : _dataUser.phone;
		this.setCookies({accessToken:value.accessToken,refreshToken:value.refreshToken,username:_dataUser.username});
		return _dataUser;
	}

	setCookies=value=>{
		// let _domain = (process.env.NODE_ENV==='production' || process.env.NODE_ENV ==='staging')?'.casting.datafirst.solutions':'';
		// let secure = (process.env.NODE_ENV==='production' || process.env.NODE_ENV==='staging')?true:false;
		// Cookies.set('username',value.username,{expires:7,path:'/',domain:_domain,sameSite:'strict',secure});
		// Cookies.set('accessToken',value.accessToken,{expires: 1/(288),path:'/',domain:_domain,sameSite:'strict',secure});
		// Cookies.set('refreshToken',value.refreshToken,{expires:7,path:'/',domain:_domain,sameSite:'strict',secure});
		let _info ={
			maxageToken:/*1/(288)*24*60*60*/ 25*60,
			accessToken:value.accessToken,
			username:value.username,
			refreshToken:value.refreshToken
		}
		putApi(process.env.BASE_URL+'/cookie',_info);
	}

	handleLogOut=e=>{
		// let _domain = (process.env.NODE_ENV==='production' || process.env.NODE_ENV ==='staging')?'.staging.casting.datafirst.solutions':'';
		// Cookies.remove('accessToken',{path: "/", domain: _domain});
		// Cookies.remove('refreshToken',{path: "/", domain: _domain});
		// Cookies.remove('username',{path: "/", domain: _domain});
		deleteApi(process.env.BASE_URL+'/cookie');

	}

	setVerifyOTP=(type,values)=>{
		return dispatch=>{
			dispatch({type:ActionTypes.VERIFY_OTP,payload:{type,value:values}});
		}
	}

	setLivestreams=(type,value)=>{
		return dispatch=>{
			dispatch({type,payload:{value}});
		}
	}
	
	setQuestions=(type,value)=>{
		return dispatch=>{
			dispatch({type,payload:{value}});
		}
	}
	setAnswer=(type,value)=>{
		return dispatch=>{
			dispatch({type,payload:{value}});
		}
	}

	setValueStatus=(type,value)=>{
		return dispatch=>{
			dispatch({type,payload:{value}});
		}
	}
	setStatusAlert=(type,value)=>{
		return dispatch=>{
			dispatch({type,payload:{value}});
		}
	}
}
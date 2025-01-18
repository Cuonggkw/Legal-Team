"use strict";

/* Package System */
import React from "react";
import {withRouter} from 'next/router';
import {connect} from 'react-redux';

/* Application */
import Cookies from 'js-cookie';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Action from '@libs/Action';
import Head from '@views/Default/Components/Head';
import Header from '@views/Default/Components/Header';
import Footer from '@views/Default/Components/Footer';
import NavigatorMobile from '@views/Default/Components/NavigatorMobile';
import {isIOS} from 'react-device-detect';
import { Alert, Snackbar } from "@mui/material";
import {fetchApi,deleteApi,postApi,isPhoneNumber} from '@helpers/Common';
var renewTimeout = null;
class Layout extends React.Component{

	constructor(props){
		super(props);
	}

	handleLoadScript=()=>{
		const fpPromise = FingerprintJS.load();
		(async()=>{
			const fp = await fpPromise;
			const result = await fp.get();
			const visitorId = result.visitorId;
			this.setState({visitorId:visitorId});
			localStorage.setItem('visitorId',visitorId);
		})();
	}

	refreshToken = (renew = fasle,username='',refresh_token='') => {
		console.log('Start refresh token')
		let _user = this.props?.auth?.['username'] ?? username;
		let isAuthEmail = true;
		if (renew == false) {
			if(_user && isPhoneNumber(_user)) isAuthEmail = false;
			fetchApi(process.env.API_USER_URL + 'me', this.props?.auth?.['accessToken']).then(result => {
				if (result.data.status == 'success') {
					let _result = result.data.result;
					_result.access_token = this.props.auth['accessToken'];
					_result.refresh_token = this.props.auth?.['refreshToken'];
					this.props.setUser({..._result,isAuthEmail});
				} else this.refreshToken(true)
			}).catch(e => this.refreshToken(true));
		}
		if (renew == true) {
			let _params = {
				"refreshToken": this.props.auth?.['refreshToken'] ?? refresh_token,
				"deviceId": localStorage.getItem('visitorId'),
				"deviceType": "WEB"
			}
			if (isPhoneNumber(_user)) {
				_params.phone = _user;
				isAuthEmail = false;
			} else _params.email = _user;
			postApi(process.env.API_USER_URL + 'auth/token', _params).then(result => {
				if (result.data.status == 'success') {
					let _result = {
						"access_token": result.data.result.access_token,
						"refresh_token": result.data.result.refresh_token
					}
					this.props.setUser({..._result,isAuthEmail});
				}
			}).catch(e => { this.handleLogOut(); });
		}
		if (renewTimeout != null) clearTimeout(renewTimeout);
		renewTimeout = setTimeout(() => this.refreshToken(true,username,refresh_token), 25*60 * 1000);
		console.log('End refresh token.....',renewTimeout)
	}

	componentDidMount(){
		//Redirect open App
		// if(this.props.openApp!=''){
		// 	// let _redirect = (isIOS==true)?'https://apps.apple.com/VN/app/id1545324313?mt=8':'https://play.google.com/store/apps/details?id=vn.com.netlove.app';
		// 	// setTimeout(function(){window.location=_redirect},25);
		// 	// window.location = "netlove-mcv://"+this.props.openApp;
		// }

		this.handleLoadScript();
		if(localStorage && localStorage.getItem('darkMode')){
			let _statusDarkMode = JSON.parse(localStorage.getItem('darkMode'));
			this.props.setDarkMode(_statusDarkMode);
		}else{
			if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
				this.props.setDarkMode(true);
			}else{
				this.props.setDarkMode(false);
			}
		}
		if (this.props?.auth?.['accessToken']) this.refreshToken(false); else if (this.props?.auth?.['refreshToken']) this.refreshToken(true,this.props?.auth?.['username'],this.props?.auth?.['refreshToken']);
		else this.handleLogOut();
	}
	componentWillUnmount() {
		clearTimeout(renewTimeout);
	}

	handleLogOut = e => {
		// let _domain = process.env.NODE_ENV === 'production' ? '.event.datafirst.solutions' : '';
		// Cookies.remove('accessToken', { path: "/", domain: _domain });
		// Cookies.remove('refreshToken', { path: "/", domain: _domain });
		// Cookies.remove('username', { path: "/", domain: _domain });
		deleteApi(process.env.BASE_URL+'/cookie');
	}

	render(){
		let _status = this.props.stateStatus;

		return(
			(this.props.openApp=='')?
			<React.Fragment>
				<Head data={this.props.data} router={this.props.router} />

				<div id="nl-wrapper">
					<Header renewTimeout={renewTimeout} renewToken={this.refreshToken}/>

					{this.props.children}
						{this.props.stateStatus.status.isSuccessful && <Snackbar open={this.props.stateStatus.status.isSuccessful} autoHideDuration={2000} onClose={this.handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
							<Alert severity="success">
								{this.props.stateStatus.status.msg.text}
							</Alert>
						</Snackbar>}
						{this.props.stateStatus.status.isFailure && <Snackbar open={this.props.stateStatus.status.isFailure} autoHideDuration={2000} onClose={this.handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
							<Alert severity="error">
								{this.props.stateStatus.status.msg.text}
							</Alert>
						</Snackbar>}
					<Footer />

					<NavigatorMobile />
				</div>
			</React.Fragment>
			:null
		)
	}
}

const mapStateToProps=state=>{

	return {
		stateStatus:state.status
	}
}

const mapDispatchToProps=dispatch=>{
	let _action = new Action();

	return{
		setDarkMode:val=>{dispatch(_action.setDarkMode(val))},
		setUser:data=>{dispatch(_action.setUser(data))}
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Layout));
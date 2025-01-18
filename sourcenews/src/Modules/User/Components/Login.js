"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import Action from '@libs/Action';
import {fetchApi,postApi,validationForm,getMsg} from '@helpers/Common';
import {OPEN_MODAL} from '@config/ActionTypes';
import {IconButton,Button} from '@mui/material';
import Spinkit from '@views/Default/Components/Spinkit';
import CountryAutocomplete from '@views/Default/Components/CountryAutocomplete';
// import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import dynamic from "next/dynamic";
// import {gapi} from 'gapi-script'
const GoogleLogin = dynamic(() => import("react-google-login"));
import Link from "next/link";
import {phone} from 'phone';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

class Login extends React.Component{

	constructor(props){
		super(props);
		this._isMounted = false;

		this.state={
			status:{
				loading:false,
				showPassword:{}
			},
			msg:'',
			values:{phoneCode:'+84'},
			validation:{},
			type:'otp'
		}
		AppleID.auth.init({
			clientId: process.env.APPLE_CLIENT_ID,
			scope: 'name email',
			redirectURI: process.env.BASE_URL,
			state: 'origin:web',
			usePopup: true
		});
	}

	async componentDidMount() {
		this._isMounted = true;
		const gapi = await import('gapi-script').then((pack) => pack.gapi);
		gapi.load("client:auth2", () => {
			gapi.client.init({
				clientId: process.env.GG_CLIENT_ID,
				plugin_name: "chat",
			});
		});
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	handleTogglePassword=async(e)=>{
		this.setState({status:{...this.state.status,showPassword:{...this.state.status.showPassword,[e]:!this.state.status.showPassword[e]}}});
	}

	handleToggleType=(e)=>{
    	this.setState({type:e});
	}

	currentPage=(e)=>{
		this.props.setStatus(OPEN_MODAL,e);
	}

	handleValues=e=>{
		let _value = e.target.type==="checkbox" ? e.target.checked : e.target.value;
		this.setState({values:{...this.state.values,[e.target.name]:_value}});
	}

	handleChange=val=>{
		this.setState({values:{...this.state.values,['phoneCode']:val}});
	}

	handleCheckReCaptcha = (e) =>{
		e.preventDefault();
		grecaptcha.ready(async() => {
		  const _token = await grecaptcha.execute(process.env.RECAPTCHA_SITE_KEY, {action: 'login'}).then(token=>token);
		  this.handleSubmit(_token);
		});
	}

	handleReLoadVisitorId=async()=>{
		const fpPromise = FingerprintJS.load();
		(async()=>{
			const fp = await fpPromise;
			const result = await fp.get();
			const visitorId = result.visitorId;
			this.setState({visitorId:visitorId});
			localStorage.setItem('visitorId',visitorId);
			return visitorId; 
		})();
	}

	handleSubmit=(_token)=>{
		let _validation = validationForm(this.state.values,this.state.type=='otp'?'signInOTP':'signIn',this.state.type);
		this.setState({validation:_validation.errors,msg:_validation.msg});
		if(this.state.status.loading==false&&_validation.formIsValid==true){
			this.setState({status:{...this.state.status,loading:true}});
			let _phone =  phone(this.state.values.phoneCode+this.state.values.phone).phoneNumber;
			let _visitorId = localStorage.getItem('visitorId');
			let _params = {};
			_params.phone=_phone;
			_params.deviceName='Web';
			_params.deviceId=_visitorId;
			_params.ggToken =_token;
			if(!_params?.deviceId || _params.deviceId == null || _params.deviceId==''){
				_params.deviceId = this.handleReLoadVisitorId();
			}
			if(this.state.type=='password'){
				_params.password=this.state.values.password;
			}
			this._isMounted&&postApi(process.env.API_USER_URL+'auth/login',_params).then(result=>{
				if(result.data.status == 'success'){
					if(this.state.type=='otp'){
						this._isMounted&&this.props.setVerifyOTP('register',{phone:_phone});
						this._isMounted&&this.currentPage('otp');
					}else if(this.state.type=='password') {
						this._isMounted&&this.props.setUser(result.data.result);
						if (this.props.stateStatus.open.apply) {
							this._isMounted&&this.props.setStatus(OPEN_MODAL,'applyCasting')
						} else {
							this._isMounted&&this.props.setStatus(OPEN_MODAL);
						}
						this.props.renewTimeout = setTimeout(() => this.props.renewToken(true,result.data.result?.phone ?? result.data.result?.email,result.data.result.refresh_token), 25*60 * 1000);
					}
				}else{
					this._isMounted&&this.setState({msg:getMsg(result)});
				}
			}).catch(e=>{
				if(e.response){
					let _msg = getMsg(e.response); 
					if(_msg=="Tài khoản của bạn chưa kích hoạt"){
						this._isMounted&&this.props.setVerifyOTP('register',{phone:phone(this.state.values.phoneCode+this.state.values.phone).phoneNumber,email:this.state.values.email});
						this._isMounted&&this.currentPage('otp');
					}
					this.setState({status:{...this.state.status,loading:false},msg:_msg});
				}
			});
		}
	}

	responseGoogle=response=>{
		if(response && response.accessToken != ''){
			const params = {
				"token": response.accessToken,
				"provider": "google",
				"deviceId": localStorage.getItem('visitorId'),
				"deviceName": "Web"
			}
			this._isMounted && postApi(process.env.API_USER_URL + 'oauth/login', params).then(result=>{
				if(result.data.status="success"){
					this._isMounted&&this.props.setUser({...result.data.result,isAuthEmail:true});
					if (this.props.stateStatus.open.apply) {
						this._isMounted&&this.props.setStatus(OPEN_MODAL,'applyCasting')
					} else {
						this._isMounted&&this.props.setStatus(OPEN_MODAL);
					}
					this.props.renewTimeout = setTimeout(() => this.props.renewToken(true,result.data.result?.email,result.data.result.refresh_token), 25*60 * 1000);
				}else{
					this._isMounted&&this.setState({msg:getMsg(result)});
				}
			}).catch(e=>{
				if(e.response){
					this._isMounted&&this.setState({status:{...this.state.status,loading:false},msg:getMsg(e.response)});
				}
			});
		}
	}

	responseFacebook=response=>{
		if(response && typeof response.accessToken !== 'undefined' && response.accessToken != ''){
			const params = {
				"token": response.accessToken,
				"provider": "facebook",
				"deviceId": localStorage.getItem('visitorId'),
				"deviceName": "Web"
			}
			this._isMounted&&postApi(process.env.API_USER_URL + 'oauth/login',params).then(result=>{
				if(result.data.status="success"){
					this._isMounted&&this.props.setUser({...result.data.result,isAuthEmail:true});
					if (this.props.stateStatus.open.apply) {
						this._isMounted&&this.props.setStatus(OPEN_MODAL,'applyCasting')
					} else {
						this._isMounted&&this.props.setStatus(OPEN_MODAL);
					}					this.props.renewTimeout = setTimeout(() => this.props.renewToken(true,result.data.result?.email,result.data.result.refresh_token), 25*60 * 1000);
				}else{
					this._isMounted&&this.setState({msg:getMsg(result)});
				}
			}).catch(e=>{
				if(e.response){
					this._isMounted&&this.setState({status:{...this.state.status,loading:false},msg:getMsg(e.response)});
				}
			});
		}
	}

	handleSignInApple=async()=>{
		let _response = await AppleID.auth.signIn();
		if(_response&&_response?.authorization?.id_token!=''){
			const params = {
				"token": _response?.authorization?.id_token,
				"provider": "apple",
				"deviceId": localStorage.getItem('visitorId'),
				"deviceName": "Web"
			}
			this._isMounted&&postApi(process.env.API_USER_URL+'oauth/login',params).then(result=>{
				if(result.data.status="success"){
					this._isMounted&&this.props.setUser({...result.data.result,isAuthEmail:true});
					if (this.props.stateStatus.open.apply) {
						this._isMounted&&this.props.setStatus(OPEN_MODAL,'applyCasting')
					} else {
						this._isMounted&&this.props.setStatus(OPEN_MODAL);
					}					
					this.props.renewTimeout = setTimeout(() => this.props.renewToken(true,result.data.result?.email,result.data.result.refresh_token), 25*60 * 1000);
				}else{
					this._isMounted&&this.setState({msg:getMsg(result)});
				}
			}).catch(e=>{
				if(e.response){
					this._isMounted&&this.setState({status:{...this.state.status,loading:false},msg:getMsg(e.response)});
				}
			});
		}
	}

	render(){
		let _modal = this.props.stateStatus.modal;
		let _validation = this.state.validation;
		let {loading} = this.state.status;
		let {values} = this.state;
		
		return(
			<React.Fragment>
				<div id="modal-signIn" className={"modal-page animate__animated animate__faster" + ((_modal.page=='signIn')?' show animate__fadeIn':'')}>
					<div className="modal-logo">
						<img src="/images/logomcv.png" />
					</div>
					<div className="nl-tabs">
						<div className="nl-tabs__inner">
							<div className={"tabs-label" + ((this.state.type=='otp')?' active':'')} onClick={()=>this.handleToggleType('otp')}>
								OTP
							</div>
							<div className={"tabs-label" + ((this.state.type=='password')?' active':'')} onClick={()=>this.handleToggleType('password')}>
								Password
							</div>
							<div className={"tabs-indicator" + ((this.state.type=='password')?' tab2':'')}></div>
						</div>
					</div>
					<div className="nl-tabs__panel">
						<form onSubmit={this.handleCheckReCaptcha} autoComplete="off">
							
							<div className={"frm-ctrl"+((_validation.phone)?' error':'')}>
								<label htmlFor="signIn-phone" className="form-label">Phone <span>*</span></label>
								<div className="phone-r">
									<input autoFocus type="number" value={values.phone||''} name="phone" placeholder="Nhập số điện thoại" className="form-control" onChange={this.handleValues} autoComplete="off" tabIndex={1} />
									<CountryAutocomplete funcChange={this.handleChange} id="autoComplete-singIn" />
								</div>
							</div>
							
							{this.state.type=='password'&&
							<>
								<div className={"frm-ctrl"+((_validation.password)?' error':'')}>
									<label htmlFor="password" className="form-label">Mật khẩu <span>*</span></label>
									<div className="pos-r">
										<input 
											type={this.state.status.showPassword['password']?'text':'password'}
											name="password" 
											id="password" 
											placeholder="Nhập mật khẩu" 
											className="form-control"
											value={values.password||''}
											onChange={this.handleValues}
											autoComplete="off"
											tabIndex={2}
										/>

										<IconButton color="primary" aria-label="eye" component="span" onClick={()=>this.handleTogglePassword('password')}>
											{this.state.status.showPassword['password']?(
													<i className="fal fa-eye"></i>
												):(
													<i className="fal fa-eye-slash"></i>
												)
											
											}
										</IconButton>
									</div>
								</div>
								<a className="forgot-pass" onClick={()=>this.currentPage('forgotPass')}>Quên mật khẩu</a>
							</>
							}
							<p className={"text-error"+(this.state.msg==''?' d-none':'')} dangerouslySetInnerHTML={{__html:this.state.msg}}></p>
							<Button type="submit" variant="contained" className="btn btn-primary btn-submit" disabled={(loading==true?true:false)}>
								Đăng Nhập{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
							</Button>
						</form>

						<div className="nl-social">
							<p className="or">Hoặc</p>
							<div className="nl-social__list">
								<FacebookLogin
									appId={process.env.FB_APP_ID}
									callback={this.responseFacebook}
									render={renderProps=>(
										<IconButton onClick={renderProps.onClick} color="primary" aria-label="eye" component="span">
											<img src="/images/icon-face.png" title="Đăng nhập với Facebook" alt="Đăng nhập với Facebook" />
										</IconButton>
									)}
								/>
								<GoogleLogin
									clientId={process.env.GG_CLIENT_ID}
									onSuccess={this.responseGoogle}
									onFailure={this.handleError}
									render={renderProps=>(
										<IconButton onClick={renderProps.onClick} color="primary" aria-label="eye" component="span">
											<img src="/images/icon-google.png" title="Đăng nhập với Google" alt="Đăng nhập với Google" />
										</IconButton>
									)}
								/>
								<IconButton onClick={this.handleSignInApple} color="primary" aria-label="eye" component="span">
									<img src="/images/ic-apple.png" title="Đăng nhập với Apple" alt="Đăng nhập với Apple" />
								</IconButton>
							</div>
						</div>

						<div className="text-footer">
							Bằng cách Đăng ký tham gia, bạn đồng ý với <br />
							<Link href="/terms">
							<a alt="Điều khoản " target="_blank">
								&nbsp;Điều khoản&nbsp;
							</a>
							</Link>
							và
							<Link href="/privacy">
							<a alt="Chính sách riêng tư " target="_blank">
								&nbsp;Chính sách riêng tư&nbsp;
							</a>
							</Link>
							của chúng tôi
						</div>

						{/* <div className="text-footer">
							<p>Bạn chưa có tài khoản? <a onClick={()=>this.currentPage('signUp')}>Đăng ký</a></p>
						</div> */}
					</div>
				</div>
			</React.Fragment>
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
		setStatus:(type,val)=>{dispatch(_action.setStatus(type,val))},
		setUser:data=>{dispatch(_action.setUser(data))},
		setVerifyOTP:(type,val)=>{dispatch(_action.setVerifyOTP(type,val))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);
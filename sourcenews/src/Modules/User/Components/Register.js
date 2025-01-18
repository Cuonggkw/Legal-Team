"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import Action from '@libs/Action';
import {OPEN_MODAL} from '@config/ActionTypes';
import {Button,IconButton} from '@mui/material';
import Spinkit from '@views/Default/Components/Spinkit';
import {postApi,validationForm} from '@helpers/Common';
import CountryAutocomplete from '@views/Default/Components/CountryAutocomplete';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

class Register extends React.Component{

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
			type:'phone'
		}
		AppleID.auth.init({
			clientId: process.env.APPLE_CLIENT_ID,
			scope: 'name email',
			redirectURI: process.env.BASE_URL,
			state: 'origin:web',
			usePopup: true
		});
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

	handleSubmit=e=>{
		e.preventDefault();
		let _validation = validationForm(this.state.values,'signUp',this.state.type);
		this.setState({validation:_validation.errors,msg:_validation.msg});

		if(this.state.status.loading==false&&_validation.formIsValid==true){
			this.setState({status:{...this.state.status,loading:true}});
			let _params = {
				"password": this.state.values.password
			};
			if(this.state.type=='phone') _params.phone = (this.state.values.phoneCode+this.state.values.phone).replace(/^\+840/,'+84');
			else _params.email = this.state.values.email;
			this._isMounted&&postApi(process.env.API_USER_URL+'/register',_params).then(result=>{
				this.setState({status:{...this.state.status,loading:false}});
				if(result.status==201){
					this._isMounted&&this.props.setVerifyOTP('register',{phone:_params.phone,email:_params.email,password:this.state.values.password});
					this._isMounted&&this.currentPage('otp');
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

	componentDidMount(){
		this._isMounted = true;
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	responseGoogle=response=>{
		if(response && typeof response.accessToken !== 'undefined' && response.accessToken != ''){
			const params = {
				"token": response.accessToken,
				"provider": "google",
				"deviceId": localStorage.getItem('visitorId'),
				"deviceType":"Web"
			}
			this._isMounted&&postApi(process.env.API_USER_URL+'/oauth2/login',params).then(result=>{
				if(result.data.status="success"){
					this._isMounted&&this.props.setUser(result.data.result);
					this._isMounted&&this.props.setStatus(OPEN_MODAL);
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
				"deviceType":"Web"
			}
			this._isMounted&&postApi(process.env.API_USER_URL+'/oauth2/login',params).then(result=>{
				if(result.data.status="success"){
					this._isMounted&&this.props.setUser(result.data.result);
					this._isMounted&&this.props.setStatus(OPEN_MODAL);
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
				"deviceType":"Web"
			}
			this._isMounted&&postApi(process.env.API_USER_URL+'/oauth2/login',params).then(result=>{
				if(result.data.status="success"){
					this._isMounted&&this.props.setUser(result.data.result);
					this._isMounted&&this.props.setStatus(OPEN_MODAL);
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
				<div id="modal-signUp" className={"modal-page animate__animated animate__faster" + ((_modal.page=='signUp')?' show animate__fadeIn':'')}>
					<div className="modal-logo">
						<img src="/images/logo.png" />
					</div>

					<div className="nl-tabs">
						<div className="nl-tabs__inner">
							<div className={"tabs-label" + ((this.state.type=='phone')?' active':'')} onClick={()=>this.handleToggleType('phone')}>
								Điện thoại
							</div>
							<div className={"tabs-indicator" + ((this.state.type=='email')?' tab2':'')}></div>
						</div>
					</div>

					<div className="nl-tabs__panel">
						<form onSubmit={this.handleSubmit} autoComplete="off">
							
							{this.state.type=='phone'&&
								<div className={"frm-ctrl"+((_validation.phone)?' error':'')}>
									<label className="form-label">Phone <span>*</span></label>
									<div className="phone-r">
										<input autoFocus type="number" value={values.phone||''} name="phone" placeholder="Nhập số điện thoại" className="form-control" onChange={this.handleValues} autoComplete="off" tabIndex={1} />
										<CountryAutocomplete funcChange={this.handleChange} />
									</div>
								</div>
							}

							<div className={"frm-ctrl"+((_validation.password)?' error':'')}>
								<label className="form-label">Mật khẩu <span>*</span></label>
								<div className="pos-r">
									<input 
										type={this.state.status.showPassword['password']?'text':'password'}
										name="password"
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
							
							<div className={"frm-ctrl"+((_validation.rePassword)?' error':'')}>
								<label className="form-label">Nhập lại mật khẩu <span>*</span></label>
								<div className="pos-r">
									<input 
										type={this.state.status.showPassword['rePassword']?'text':'password'}
										name="rePassword"
										placeholder="Nhập lại mật khẩu"
										className="form-control"
										value={values.rePassword||''}
										onChange={this.handleValues}
										autoComplete="off"
										tabIndex={3}
									/>

									<IconButton color="primary" aria-label="eye" component="span" onClick={()=>this.handleTogglePassword('rePassword')}>
										{this.state.status.showPassword['rePassword']?(
												<i className="fal fa-eye"></i>
											):(
												<i className="fal fa-eye-slash"></i>
											)
										
										}
									</IconButton>
								</div>
							</div>

							<p className={"text-error"+(this.state.msg==''?' d-none':'')} dangerouslySetInnerHTML={{__html:this.state.msg}}></p>
							<Button type="submit" variant="contained" className="btn btn-primary btn-submit" disabled={(loading==true?true:false)}>
								Đăng Ký{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
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
							<p>Bạn đã có tài khoản? <a onClick={()=>this.currentPage('signIn')}>Đăng nhập</a></p>
						</div>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

const mapStateToProps=state=>{
	return {
		stateStatus:state.status,
		stateUser:state.user
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

export default connect(mapStateToProps,mapDispatchToProps)(Register);
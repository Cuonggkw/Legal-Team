"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import Action from '@libs/Action';
import {OPEN_MODAL} from '@config/ActionTypes';
import {IconButton,Button} from '@mui/material';
import Spinkit from '@views/Default/Components/Spinkit';
import {postApi,putApi,validationForm,getMsg} from '@helpers/Common';

class ChangePass extends React.Component{

	constructor(props){
		super(props);
		this._isMounted = false;

		this.state={
			status:{
				loading:false,
				showPassword:{}
			},
			msg:'',
			values:{},
			validation:{}
		}
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	handleTogglePassword=async(e)=>{
		this._isMounted&&this.setState({status:{...this.state.status,showPassword:{...this.state.status.showPassword,[e]:!this.state.status.showPassword[e]}}});
	}

	currentPage=(e)=>{
		this._isMounted&&this.props.setStatus(OPEN_MODAL,e);
		this._isMounted&&this.props.setVerifyOTP('',{});
	}

	handleValues=e=>{
		let _value = e.target.type==="checkbox" ? e.target.checked : e.target.value;
		this.setState({values:{...this.state.values,[e.target.name]:_value}});
	}

	handleSubmit=e=>{
		e.preventDefault();
		if(this._isMounted){
			//FORGOT
			if(this.props.stateStatus.otp.type=='forgot'){
				let _validation = validationForm(this.state.values,'changePass',this.state.type);
				this.setState({validation:_validation.errors,msg:_validation.msg});

				if(this.state.status.loading==false&&_validation.formIsValid==true){
					this.setState({status:{...this.state.status,loading:true}});
					let _params = {
						"password": this.state.values.password,
						"code":this.props.stateStatus.otp.values.recoveryTokenOTP,
						"phone":this.props.stateStatus.otp.values.phone
					}
					
					postApi(process.env.API_USER_URL+'forgot/resetpassword',_params).then(result=>{
						if(result.data.status='success'){
							this._isMounted&&this.currentPage('signIn');
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

			//UPDATE PASS ON FIRST LOGIN
			if(this.props.stateStatus.otp.type=='register'){
				let _validation = validationForm(this.state.values,'changePass',this.state.type);
				this.setState({validation:_validation.errors,msg:_validation.msg});

				if(this.state.status.loading==false&&_validation.formIsValid==true){
					this.setState({status:{...this.state.status,loading:true}});
					let _user = this.props.stateUser;
					let _params = {};
					_params.password = this.state.values.password;
					_params.rePassword = this.state.values.rePassword
					this._isMounted&&putApi(process.env.API_USER_URL+'me',_params,_user.accessToken).then(result=>{
						this._isMounted&&this.setState({status:{...this.state.status,loading:false},values:{...this.state.values,password:'',rePassword:'',is_password:true}});
						if(result.data.status == 'success'){
							this._isMounted&&this.props.setUser({access_token:_user.accessToken,refresh_token:_user.refreshToken,is_password:true});
							this._isMounted&&this.currentPage('noti');
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
		}
	}

	render(){
		let _modal = this.props.stateStatus.modal;
		let _validation = this.state.validation;
		let {loading} = this.state.status;
		let {values} = this.state;
		let _type = this.props.stateStatus.otp.type;
		return(
			<React.Fragment>
				{_type=='forgot'&&
				<div id="modal-changePass" className={"modal-page animate__animated animate__faster" + ((_modal.page=='changePass')?' show animate__fadeIn':'')}>
					<div className="modal-title">
						<h4>Đổi mật khẩu</h4>
						<p>Vui lòng nhập mật khẩu mới</p>
					</div>

					<div className="nl-tabs__panel">
						<form onSubmit={this.handleSubmit}>
							<div className={"frm-ctrl"+((_validation.password)?' error':'')}>
								<label className="form-label">Mật khẩu mới <span>*</span></label>
								<div className="pos-r">
									<input 
										type={this.state.status.showPassword['password']?'text':'password'}
										name="password"
										placeholder="Nhập mật khẩu"
										className="form-control"
										value={values.password||''}
										onChange={this.handleValues}
										autoComplete="off"
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
								<label className="form-label">Nhập lại mật khẩu mới <span>*</span></label>
								<div className="pos-r">
									<input 
										type={this.state.status.showPassword['rePassword']?'text':'password'}
										name="rePassword"
										placeholder="Nhập lại mật khẩu"
										className="form-control"
										value={values.rePassword||''}
										onChange={this.handleValues}
										autoComplete="off"
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
								Xác Nhận{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
							</Button>
						</form>
					</div>
				</div>
				}
				{_type=='register'&&
				<div id="modal-changePass" className={"modal-page animate__animated animate__faster" + ((_modal.page=='changePass')?' show animate__fadeIn':'')}>
					<div className="modal-title">
						<h4>Cập nhật mật khẩu</h4>
						<p>Vui lòng cập nhật mật khẩu</p>
					</div>

					<div className="nl-tabs__panel">
						<form onSubmit={this.handleSubmit}>
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
								Xác Nhận{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
							</Button>
						</form>
					</div>
				</div>
				}
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
		setUser:data=>{dispatch(_action.setUser(data))},
		setStatus:(type,val)=>{dispatch(_action.setStatus(type,val))},
		setVerifyOTP:(type,val)=>{dispatch(_action.setVerifyOTP(type,val))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(ChangePass);
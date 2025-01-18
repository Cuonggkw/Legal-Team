"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import Action from '@libs/Action';
import {OPEN_MODAL} from '@config/ActionTypes';
import Button from '@mui/material/Button';
import Spinkit from '@views/Default/Components/Spinkit';
import {postApi,validationForm, getMsg} from '@helpers/Common';
import CountryAutocomplete from '@views/Default/Components/CountryAutocomplete';

class Forgot extends React.Component{

	constructor(props){
		super(props);
		this._isMounted = false;

		this.state={
			status:{
				loading:false
			},
			msg:'',
			values:{phoneCode:'+84'},
			validation:{},
			type:'phone'
		}
	}

	componentDidMount(){
		this._isMounted = true;
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	currentPage=(e)=>{
		this.props.setStatus(OPEN_MODAL,e);
	}

	handleValues=e=>{
		let _value = e.target.type==="checkbox" ? e.target.checked : e.target.value;
		this.setState({values:{...this.state.values,[e.target.name]:_value}});
	}

	handleToggleType=(e)=>{
    	this.setState({type:e});
	}

	handleChange=val=>{
		this.setState({values:{...this.state.values,['phoneCode']:val}});
	}

	handleSubmit=e=>{
		e.preventDefault();
		let _validation = validationForm(this.state.values,'forgot',this.state.type);
		this.setState({validation:_validation.errors,msg:_validation.msg});

		if(this.state.status.loading==false&&_validation.formIsValid==true){
			this.setState({msg:'',status:{...this.state.status,loading:true}});
			let _params = {};
			if(this.state.type=='phone') {
				_params.phone = (this.state.values.phoneCode+this.state.values.phone).replace(/^\+840/,'+84');
				this._isMounted&&postApi(process.env.API_USER_URL+'forgot',_params).then(result=>{
					this.setState({status:{...this.state.status,loading:false}});
					if(result.data.status=='success'){
						this._isMounted&&this.props.setVerifyOTP('forgot',{phone:(_params.phone?_params.phone:'')});
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
	}

	render(){
		let _modal = this.props.stateStatus.modal;
		let _validation = this.state.validation;
		let {loading} = this.state.status;
		let {values} = this.state;

		return(
			<React.Fragment>
				<div id="modal-forgotPass" className={"modal-page animate__animated animate__faster" + ((_modal.page=='forgotPass')?' show animate__fadeIn':'')}>
					<div className="modal-title">
						<h4 className="primary">Quên mật khẩu</h4>
					</div>

					{/* <div className="nl-tabs">
						<div className="nl-tabs__inner">
							<div className={"tabs-label" + ((this.state.type=='phone')?' active':'')} onClick={()=>this.handleToggleType('phone')}>
								Điện thoại
							</div>
							<div className={"tabs-label" + ((this.state.type=='email')?' active':'')} onClick={()=>this.handleToggleType('email')}>
								Email
							</div>
							<div className={"tabs-indicator" + ((this.state.type=='email')?' tab2':'')}></div>
						</div>
					</div> */}

					<div className="nl-tabs__panel">
						<form onSubmit={this.handleSubmit}>
							{/* {this.state.type=='email'&&
								<div className={"frm-ctrl"+((_validation.email)?' error':'')}>
									<label className="form-label">Email <span>*</span></label>
									<input autoFocus type="text" value={values.email||''} name="email" placeholder="Nhập email" className="form-control" onChange={this.handleValues} tabIndex={1} />
								</div>
							} */}

							{this.state.type=='phone'&&
								<div className={"frm-ctrl"+((_validation.phone)?' error':'')}>
									<label htmlFor="signIn-phone" className="form-label">Phone <span>*</span></label>
									<div className="phone-r">
										<input autoFocus type="number" value={values.phone||''} name="phone" placeholder="Nhập số điện thoại" className="form-control" onChange={this.handleValues} autoComplete="off" tabIndex={1} />
										<CountryAutocomplete funcChange={this.handleChange} id="autoComplete-singIn" />
									</div>
								</div>
							}
							
							<p className={"text-error"+(this.state.msg==''?' d-none':'')} dangerouslySetInnerHTML={{__html:this.state.msg}}></p>
							<Button type="submit" variant="contained" className="btn btn-primary btn-submit" disabled={(loading==true?true:false)}>
								Xác Nhận{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
							</Button>
						</form>

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
		setVerifyOTP:(type,val)=>{dispatch(_action.setVerifyOTP(type,val))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Forgot);
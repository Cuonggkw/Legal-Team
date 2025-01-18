"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import Button from '@mui/material/Button';
import Spinkit from '@views/Default/Components/Spinkit';
import Action from '@libs/Action';
import {OPEN_MODAL} from '@config/ActionTypes';
import {putApi, postApi,validationForm,getMsg} from '@helpers/Common';
import OtpInput from 'react-otp-input';

class Forgot extends React.Component{

	constructor(props){
		super(props);
		this._isMounted = false;

		this.state={
			status:{
				loading:false
			},
			countdown:60,
			msg:'',
			values:'',
			validation:{}
		};
		this.timer=null;
		this.handleValues = this.handleValues.bind(this); 
	}

	currentPage=(e)=>{
		this.props.setStatus(OPEN_MODAL,e);
	}

	handleValues=values=>{
		// let _value = e.target.type==="checkbox" ? e.target.checked : e.target.value;
		// this.setState({values:{...this.state.values,[e.target.name]:_value}});
		this.setState({values:{otp:values}});
	}

	handleCheckReCaptcha = (e) => {
		e.preventDefault();
		grecaptcha.ready(async () => {
		  const _token = await grecaptcha
			.execute(process.env.RECAPTCHA_SITE_KEY, { action: "otp" })
			.then((token) => token);
		  this.handleResendOTP(_token);
		});
	};

	handleResendOTP=(token)=>{
		if (this.state.countdown <= 0) {
			let _propsValues = this.props.stateStatus.otp.values;
			const _params = {};
			if (_propsValues?.phone) _params.phone = _propsValues.phone;
			_params.deviceId = localStorage.getItem('visitorId'),
			_params.deviceName = "Web";
			_params.ggToken = token;
			this._isMounted && postApi(process.env.API_USER_URL + "auth/login",_params).then((result) => {
				if (result.status == "success") {
					this._isMounted && this.setState({ countdown: 60 });
					this._isMounted && setInterval(this.countDownOTP, 1000);
				} else {
					let _msg =
					typeof result.errors.msg !== "undefined"
					? result.errors.msg
					: typeof result.errors[0].msg !== "undefined"
					? result.errors[0].msg
					: "";
					this._isMounted && this.setState({ msg: _msg });
				}
			}).catch((e) => {
				if (e.response) {
				let _msg =
					typeof e.response.data === "string" ? e.response.data :
					typeof e.response.data?.errors?.msg !== "undefined"
					? e.response.data?.errors?.msg
					: typeof e.response.data?.errors[0]?.msg !== "undefined"
					? e.response.data?.errors[0]?.msg
					: "";
				this._isMounted &&
					this.setState({
						status: { ...this.state.status, loading: false },
						msg: _msg,
					});
				}
			});
		}
	}		

	handleSubmit=e=>{
		e.preventDefault();
		let _validation = validationForm(this.state.values,'otp');
		this.setState({validation:_validation.errors,msg:_validation.msg});

		if(this.state.status.loading==false&&_validation.formIsValid==true){
			this.setState({msg:'',status:{...this.state.status,loading:true}});
			let _params = {
				"otp": this.state.values.otp ?? '',
				"deviceId": localStorage.getItem('visitorId'),
				"phone": this.props.stateStatus.otp.values.phone ?? '',
			};
			//OTP FORGOT PASSWORD
			if(this.props.stateStatus.otp.type=='forgot'){
				this._isMounted&&postApi(process.env.API_USER_URL+'forgot/verify',_params).then(result=>{
					if(result.data.status == 'success'){
						this._isMounted&&this.props.setVerifyOTP('forgot',{phone:_params.phone,recoveryTokenOTP:result.data.result.code});
						this._isMounted&&this.currentPage('changePass');
					}else{
						this._isMounted&&this.setState({msg:getMsg(result)});
					}
				}).catch(e=>{
					if(e.response){
						this.setState({status:{...this.state.status,loading:false},msg:getMsg(e.response)});
					}
				});
			}
			//OTP LOGIN BY OTP
			if(this.props.stateStatus.otp.type=='register'){
				this._isMounted&&postApi(process.env.API_USER_URL+'auth/verify',_params).then(result=>{
					if(result.data.status == 'success'){
						this._isMounted&&this.props.setUser(result.data.result);
						// if(result.data.result.is_provider_manual && !result.data.result.is_password){
						// 	this._isMounted&&this.currentPage('changePass');
						// }else{
						// 	if (this.props.stateStatus.open.apply) {
						// 		this._isMounted&&this.props.setStatus(OPEN_MODAL,'applyCasting')
						// 	} else {
						// 		this._isMounted&&this.props.setStatus(OPEN_MODAL);
						// 	}
						// }
						if (this.props.stateStatus.open.apply) {
							this._isMounted&&this.props.setStatus(OPEN_MODAL,'applyCasting')
						} else {
							this._isMounted&&this.props.setStatus(OPEN_MODAL);
						}
						this.props.renewTimeout = setTimeout(() => this.props.renewToken(true,result.data.result?.phone ?? result.data.result?.email,result.data.result.refresh_token), 25*60 * 1000);
					}else{
						this._isMounted&&this.setState({msg:getMsg(result)});
					}
				}).catch(e=>{
					if(e.response){
						this.setState({status:{...this.state.status,loading:false},msg:getMsg(e.response)});
					}
				});
			}
		}
	}

	countDownOTP=()=>{
		let _num = this.state.countdown;
		if(_num>0){
			_num-=1;
			this.setState({countdown:_num});
		}else{
			clearInterval(this.timer);
		}
	}

	componentDidUpdate(prevProps,prevState,snapshot){
		if(this.props.stateStatus.otp.type!=''&&(prevProps.stateStatus.otp.type!=this.props.stateStatus.otp.type)){
			this.timer = setInterval(this.countDownOTP,1000);
		}
	}

	componentDidMount(){
		this._isMounted = true;
	}

	componentWillUnmount(){
		this._isMounted = false;
		clearInterval(this.timer);
	}

	render(){
		let _modal = this.props.stateStatus.modal;
		let _validation = this.state.validation;
		let {loading} = this.state.status;
		let {values} = this.state;

		return(
			<React.Fragment>
				<div id="modal-otp" className={"modal-page animate__animated animate__faster" + ((_modal.page=='otp')?' show animate__fadeIn':'')}>
					<div className="modal-title">
						<p className="modal-text">Vui lòng nhập mã xác nhận</p>
					</div>

					<div className="nl-tabs__panel">
						<form onSubmit={this.handleSubmit}>
							<div className="frm-ctrl d-flex justify-content-between otp-root">
								<OtpInput
							        value={this.state.values.otp}
							        onChange={this.handleValues}
							        numInputs={6}
							        isInputNum
							        inputStyle="otp form-control"
							        placeholder="------"
							    />
							</div>

							<p className="modal-text text-center mb-5 mt-5">Bạn chưa nhận được mã? <a onClick={this.handleCheckReCaptcha} title="Gửi lại mã xác nhận"> Gửi lại</a>{this.state.countdown>0?' ('+this.state.countdown+'s)':''}</p>
							<Button type="submit" variant="contained" className="btn btn-primary btn-submit" disabled={(loading==true?true:false)}>
								Xác Nhận{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
							</Button>
							{this.state.msg!=''&&
							<div className="waring mt-5">
								<i className="fal fa-exclamation-triangle"></i>
								<span dangerouslySetInnerHTML={{__html:this.state.msg}}></span>
							</div>
							}
						</form>
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
		setVerifyOTP:(type,val)=>{dispatch(_action.setVerifyOTP(type,val))},
		setUser:data=>{dispatch(_action.setUser(data))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Forgot);
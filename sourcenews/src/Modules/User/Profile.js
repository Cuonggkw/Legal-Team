"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import Action from '@libs/Action';
import {IconButton,Button, TextField, Stack, Select, MenuItem} from '@mui/material';
import {validationForm,putApi,postApi,capitalize,countryList,getMsg} from '@helpers/Common';
import Spinkit from '@views/Default/Components/Spinkit';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { RESET_STATUS, SET_STATUS } from "@config/ActionTypes";
import { YardRounded } from "@mui/icons-material";
import {phone} from 'phone';
import CountryAutocomplete from '@views/Default/Components/CountryAutocomplete';


class Profile extends React.Component{

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
			msgF2:'',
			is_password:false,
			is_provider_manual:false,
		}
	}

	handleTogglePassword=e=>{
		this.setState({status:{...this.state.status,showPassword:{...this.state.status.showPassword,[e]:!this.state.status.showPassword[e]}}});
	}

	handleValues=e=>{
		let _value = e.target.type==="checkbox" ? e.target.checked : e.target.value;
		this.setState({values:{...this.state.values,[e.target.name]:_value}});
	}

	handleImage=(e)=>{
		if(e.currentTarget?.name){
			this.setState({values:{...this.state.values,avatar:e.currentTarget.files[0],previewAvatar:URL.createObjectURL(e.currentTarget.files[0])}});
			let _reader = new FileReader();
			let _name = e.currentTarget.name;
			_reader.onload=e=>{
				this._isMounted&&this.setState({values:{...this.state.values,isChangeAvatar:true,[_name]:e.target.result}});
			}
			_reader.readAsDataURL(e.currentTarget.files[0]);
		}
	}

	handleSubmit=e=>{
		e.preventDefault();
		if(this._isMounted){
			let _params = {
				id:this.state.values.id,
				full_name:this.state.values.full_name,
				gender:this.state.values.gender,
				dob: this.state.values.dob != null ? moment(this.state.values.dob).format("YYYY-MM-DD") : "",
				email:this.state.values.email,
				phone:this.state.values.phone ? this.state.values.phone :'',
				country:this.state.values.country,
			};
			let _validation = validationForm({..._params,phoneCode: this.state.values.phoneCode},'profile');
			this.setState({validation:_validation.errors});

			if(this.state.status.loading==false&&_validation.formIsValid==true){
				this.setState({status:{...this.state.status,loading:true}});
				let _user = this.props.stateUser;
				_params.fullName = _params.full_name;
				_params.phone = this.state.values.phone ? phone(this.state.values.phoneCode+this.state.values.phone).phoneNumber :'';
				if (this.state.values.avatar != '' && this.state.values.isChangeAvatar == true) _params.avatar = this.state.values.avatar;
				this._isMounted&&putApi(process.env.API_USER_URL+'me',_params,_user.accessToken).then(result=>{
					this._isMounted&&this.setState({status:{...this.state.status,loading:false}});
					if(result.data.status == 'success'){
						this._isMounted&&this.props.setUser({access_token:_user.accessToken,refresh_token:_user.refreshToken,isAuthEmail:this.props.stateUser?.isAuthEmail});
						this.handleSuccess('Cập nhật thành công');
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

	handleUpdatePass=e=>{
		e.preventDefault();
		if(this._isMounted){
			let _validation = validationForm(this.state.values,'updateProfilePass');
			this.setState({validation:_validation.errors});

			if(this.state.status.loading==false&&_validation.formIsValid==true){
				this.setState({status:{...this.state.status,loading:true}});
				let _user = this.props.stateUser;
				let _params = {};
				_params.password = this.state.values.password;
				_params.rePassword = this.state.values.rePassword
				this._isMounted&&putApi(process.env.API_USER_URL+'me',_params,_user.accessToken).then(result=>{
					this._isMounted&&this.setState({status:{...this.state.status,loading:false},values:{...this.state.values,password:'',rePassword:'',is_password:true}});
					if(result.data.status == 'success'){
						this.handleSuccess('Cập nhật mật khẩu thành công');
					}else{
						this._isMounted&&this.setState({msgF2:getMsg(result)});
					}
				}).catch(e=>{
					if(e.response){
						this._isMounted&&this.setState({status:{...this.state.status,loading:false},msgF2:getMsg(e.response)});
					}
				});
			}
		}
	}

	handleChangePass=e=>{
		e.preventDefault();
		if(this._isMounted){
			let _validation = validationForm(this.state.values,'changeProfilePass');
			this.setState({validation:_validation.errors});
			if(this.state.status.loading==false&&_validation.formIsValid==true){
				this.setState({status:{...this.state.status,loading:true}});
				let _user = this.props.stateUser;
				let _params = {};
				_params.password = this.state.values.password;
				_params.rePassword = this.state.values.rePassword;
				_params.oldPassword = this.state.values.currentPassword;
				this._isMounted&&putApi(process.env.API_USER_URL+'me',_params,_user.accessToken).then(result=>{
					this._isMounted&&this.setState({status:{...this.state.status,loading:false},values:{...this.state.values,password:'',rePassword:'',currentPassword:''}});
					if(result.data.status == 'success'){
						this.handleSuccess('Thay đổi mật khẩu thành công');
					}else{
						this._isMounted&&this.setState({status:{...this.state.status,loading:false},msgF2:getMsg(result)});
					}
				}).catch(e=>{
					if(e.response){
						this._isMounted&&this.setState({status:{...this.state.status,loading:false},msgF2:getMsg(e.response)});
					}
				});
			}
		}
	}

	handleChange=val=>{
		this.setState({values:{...this.state.values,['phoneCode']:val}});
	}

	initPage(){
		let _user = this.props.stateUser;
		if(_user.phone){
			const _phoneValidate = phone(_user.phone);
			if (_phoneValidate.isValid == true){
				_user.phoneCode = _phoneValidate.countryCode;
				_user.phone = _phoneValidate.phoneNumber.replace(_user.phoneCode,'');
			}
		}
		this._isMounted&&this.setState({values:{...this.state.values,
			is_password:_user.is_password,
			is_provider_manual:_user.is_provider_manual,
			isChangeAvatar:false,
			..._user
		}});
	}

	componentDidMount(){
		this._isMounted = true;
		if(Object.keys(this.props.stateUser).length>0){
			this.initPage();
		}
	}

	componentDidUpdate(prevProps,prevState,snapshot){
		if(Object.keys(this.props.stateUser).length>0&&Object.keys(this.state.values).length==1){
			this.initPage();
		}
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	handleSuccess = msg => {
		this.props.setStatusAlert(SET_STATUS, { isSuccessful: true, msg: { text: msg } });
		setTimeout(() => {
			this.props.setStatusAlert(RESET_STATUS);
		}, 3000);
	}
	handleFailure = msg => {
		this.props.setStatusAlert(SET_STATUS, { isFailure: true, msg: { text: msg } });
		setTimeout(() => {
			this.props.setStatusAlert(RESET_STATUS);
		}, 3000);
	}

	render(){
		let _user = this.props.stateUser;
		let _userName = '';
		if(_user) _userName = _user.is_provider_manual == false ? (_user?.email??'') : (_user?.phone??'');
		let {loading} = this.state.status;
		let _validation = this.state.validation;
		let {values} = this.state;
		return (
			<React.Fragment>
				{(_user)&&
				<div className="inner">
					<div className="header text-center">
						<h4>Thông tin cá nhân</h4>
					</div>

					<div className="main">
						<form autoComplete="off" onSubmit={this.handleSubmit}>
							<div className="avatar">
								<div className="avatar-upload">
									<div className="img">
										<img src={(values.previewAvatar&&values.previewAvatar!='')?values.previewAvatar:values.avatar} className="img-cover" />
									</div>
									<input accept="image/*" className="input-file" name="avatar" id="icon-button-file" type="file" onChange={this.handleImage} />
									<label htmlFor="icon-button-file">
										<IconButton color="primary" aria-label="upload picture" component="span">
											<i className="fal fa-edit"></i>
										</IconButton>
									</label>
								</div>
							</div>

							<div className="info">
								<div className="row">
									<div className="col-md-6">
										<div className={"frm-ctrl"+((_validation.full_name)?' error':'')}>
											<label htmlFor="lastName" className="form-label">Họ và tên</label>
											<input type="text" name="full_name" className="form-control" value={values.full_name||''} onChange={this.handleValues} />
											{_validation.full_name && <p className="text-error">{_validation.full_name}</p>}
										</div>
									</div>

									<div className="col-md-6">
										<div className={"frm-ctrl"+((_validation.phone)?' error':'')}>
											<label htmlFor="phone" className="form-label">Số điện thoại</label>
											{/* <input type="text" name="phone" className="form-control" value={values.phone||''} onChange={this.handleValues} disabled={!this.state.values?.isAuthEmail}/> */}
											<div className="phone-r div-form-control" disabled={!this.state.values?.isAuthEmail}>
												<input autoFocus type="number" value={values.phone||''} name="phone" placeholder="Số điện thoại" className="form-control" onChange={this.handleValues} autoComplete="off" tabIndex={1} disabled={!this.state.values?.isAuthEmail}/>
												<CountryAutocomplete funcChange={this.handleChange} id="autoComplete-singIn" phoneCode={values.phoneCode} disabled={!this.state.values?.isAuthEmail}/>
											</div>
											{_validation.phone && <p className="text-error">{_validation.phone}</p>}
										</div>
									</div>

									<div className="col-md-6">
									<div className={"frm-ctrl"+((_validation.email)?' error':'')}>
											<label htmlFor="email" className="form-label">Email</label>
											<input type="text" name="email" className="form-control" value={values?.email ?? ''} onChange={this.handleValues} disabled={this.state.values?.isAuthEmail}/>
											{_validation.email && <p className="text-error">{_validation.email}</p>}
										</div>
									</div>
									<div className="col-md-6">
									<div className={"frm-ctrl"+((_validation.gender)?' error':'')}>
											<label htmlFor="gender" className="form-label">Giới tính</label>
											<select name="gender" className="form-control" value={values?.gender ?? ''} onChange={this.handleValues}>
												<option value="">Chọn giới tính</option>
												<option value="Male">Nam</option>
  												<option value="Female">Nữ</option>
												<option value="Undisclosed">Khác</option>
											</select>
											{_validation.gender && <p className="text-error">{_validation.gender}</p>}
										</div>
									</div>
									<div className="col-md-6">
									<div className={"frm-ctrl"+((_validation.dob)?' error':'')}>
											<label htmlFor="dob" className="form-label">Ngày sinh</label>
												<LocalizationProvider dateAdapter={AdapterDateFns}>
													<Stack spacing={3}>
														<DatePicker
															value={values?.dob??''}
															maxDate={moment().endOf('y').subtract(15,'y')}
															minDate={moment().endOf('y').subtract(123,'y')}
															inputFormat="dd/MM/yyyy"
															inputProps={{ placeholder: "dd/MM/yyyy" }}
															onChange={(v) => {
																this.setState({
																	values: { ...this.state.values, dob: v },
																});
															}}
															renderInput={(params) => {
																params.inputProps.disabled=true;
																return <TextField
																name='dob'
																{...params}
															/>
															}}
														/>
													</Stack>
												</LocalizationProvider>
											{_validation.dob && <p className="text-error">{_validation.dob}</p>}
										</div>
									</div>
									<div className="col-md-6">
									<div className={"frm-ctrl"+((_validation.country)?' error':'')}>
											<label htmlFor="country" className="form-label">Quốc gia</label>
											<select name="country" className="form-control" value={values?.country ?? ''} onChange={this.handleValues}>
												<option value="">Chọn quốc gia</option>
												{countryList?.map(country=><option key={country.code} value={country.name}>{country.name}</option>)}
											</select>
											{_validation.country && <p className="text-error">{_validation.country}</p>}			
										</div>
									</div>
								</div>
								<div className={"text-error"+(this.state.msg==''?' d-none':'')} dangerouslySetInnerHTML={{__html:this.state.msg}}></div>
								<Button type="submit" variant="contained" className="btn btn-primary btn-submit" disabled={(loading==true?true:false)}>
									Lưu&nbsp;&nbsp;{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
								</Button>
							</div>
						</form>
						{(values.is_provider_manual)&&
						<>
							{(values.is_password)?(
							<form autoComplete="off" onSubmit={this.handleChangePass}>
								<div className="userSecurity">
									<h4>Đổi mật khẩu</h4>
									<div>
										<div className="_row">
											<div className="text">Mật khẩu hiện tại:</div>
											<div className={"frm-ctrl"+((_validation.currentPassword)?' error':'')}>
												<input
													type={this.state.status.showPassword['currentPassword'] ? 'text' : 'password'}
													name="currentPassword"
													value={values.currentPassword||''}
													className="form-control"
													onChange={this.handleValues}
												/>
												<IconButton color="primary" aria-label="eye" component="span" onClick={() => this.handleTogglePassword('currentPassword')}>
													{this.state.status.showPassword['currentPassword'] ? (
														<i className="fal fa-eye"></i>
													) : (
														<i className="fal fa-eye-slash"></i>
													)

													}
												</IconButton>
											</div>
										</div>
										{_validation.currentPassword && <p className="text-error-detail">{_validation.currentPassword}</p>}
									</div>
									<div>
										<div className="_row">
											<div className="text">Mật khẩu mới:</div>
											<div className={"frm-ctrl"+((_validation.password)?' error':'')}>
												<input
													type={this.state.status.showPassword['password'] ? 'text' : 'password'}
													name="password"
													value={values.password||''}
													className="form-control"
													onChange={this.handleValues}
												/>
												<IconButton color="primary" aria-label="eye" component="span" onClick={() => this.handleTogglePassword('password')}>
													{this.state.status.showPassword['password'] ? (
														<i className="fal fa-eye"></i>
													) : (
														<i className="fal fa-eye-slash"></i>
													)

													}
												</IconButton>
											</div>
										</div>
										{_validation.password && <p className="text-error-detail">{_validation.password}</p>}
									</div>
									<div>
										<div className="_row">
											<div className="text">Nhập lại mật khẩu mới:</div>
											<div className={"frm-ctrl"+((_validation.rePassword)?' error':'')}>
												<input
													type={this.state.status.showPassword['rePassword'] ? 'text' : 'password'}
													name="rePassword"
													value={values.rePassword||''}
													className="form-control"
													onChange={this.handleValues}
												/>
												<IconButton color="primary" aria-label="eye" component="span" onClick={() => this.handleTogglePassword('rePassword')}>
													{this.state.status.showPassword['rePassword'] ? (
														<i className="fal fa-eye"></i>
													) : (
														<i className="fal fa-eye-slash"></i>
													)

													}
												</IconButton>
											</div>
										</div>
										{_validation.rePassword && <p className="text-error-detail">{_validation.rePassword}</p>}
									</div>

									<p className={"text-error"+(this.state.msgF2==''?' d-none':'')} dangerouslySetInnerHTML={{__html:this.state.msgF2}}></p>
									<Button type="submit" variant="contained" className="btn btn-primary btn-submit" disabled={(loading==true?true:false)}>
										Lưu&nbsp;&nbsp;{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
									</Button>
								</div>
							</form>
							):(
							<form autoComplete="off" onSubmit={this.handleUpdatePass}>
								<div className="userSecurity">
									<h4>Cập nhật mật khẩu</h4>
									<div>
										<div className="_row">
											<div className="text">Mật khẩu:</div>
											<div className={"frm-ctrl"+((_validation.password)?' error':'')}>
												<input
													type={this.state.status.showPassword['password'] ? 'text' : 'password'}
													name="password"
													value={values.password||''}
													className="form-control"
													onChange={this.handleValues}
												/>
												<IconButton color="primary" aria-label="eye" component="span" onClick={() => this.handleTogglePassword('password')}>
													{this.state.status.showPassword['password'] ? (
														<i className="fal fa-eye"></i>
													) : (
														<i className="fal fa-eye-slash"></i>
													)

													}
												</IconButton>
											</div>
										</div>
										{_validation.password && <p className="text-error-detail">{_validation.password}</p>}
									</div>
									<div>
										<div className="_row">
											<div className="text">Nhập lại mật khẩu:</div>
											<div className={"frm-ctrl"+((_validation.rePassword)?' error':'')}>
												<input
													type={this.state.status.showPassword['rePassword'] ? 'text' : 'password'}
													name="rePassword"
													value={values.rePassword||''}
													className="form-control"
													onChange={this.handleValues}
												/>
												<IconButton color="primary" aria-label="eye" component="span" onClick={() => this.handleTogglePassword('rePassword')}>
													{this.state.status.showPassword['rePassword'] ? (
														<i className="fal fa-eye"></i>
													) : (
														<i className="fal fa-eye-slash"></i>
													)

													}
												</IconButton>
											</div>
										</div>
										{_validation.rePassword && <p className="text-error-detail">{_validation.rePassword}</p>}
									</div>
									<div className={"text-error"+(this.state.msgF2==''?' d-none':'')} dangerouslySetInnerHTML={{ __html: this.state.msgF2??'' }}></div>
									<Button type="submit" variant="contained" className="btn btn-primary btn-submit" disabled={(loading==true?true:false)}>
										Lưu&nbsp;&nbsp;{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
									</Button>
								</div>
							</form>
							)}
						</>
						}
					</div>
				</div>
				}
			</React.Fragment>
		)
	}
}

const mapStateToProps=state=>{
	return {
		stateUser:state.user
	}
}

const mapDispatchToProps=dispatch=>{
	let _action = new Action();

	return{
		setUser:data=>{dispatch(_action.setUser(data))},
		setStatusAlert:(type,val) => {dispatch(_action.setStatusAlert(type, val))},
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Profile);
"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import Router from 'next/router';
import {connect} from 'react-redux';

/* Application */
import {OPEN_USER,OPEN_USER_M,OPEN_MODAL,LOGOUT,OPEN_APPLY} from '@config/ActionTypes';
import Action from '@libs/Action';
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Cookies from 'js-cookie';
import {isMobile} from 'react-device-detect';
import {postApi,deleteApi} from '@helpers/Common';

/* Component */
import Login from '@modules/User/Components/Login';
import Register from '@modules/User/Components/Register';
import Forgot from '@modules/User/Components/Forgot';
import ChangePass from '@modules/User/Components/ChangePass';
import Otp from '@modules/User/Components/Otp';
import Noti from '@views/Default/Components/Noti';

class User extends React.Component{

	constructor(props){
		super(props);
	}

	handleDarkMode=()=>{
		let _value = !this.props.stateStatus.darkMode;
		this.props.setDarkMode(_value);
		localStorage.setItem('darkMode',_value);
	}

	handleToggle=e=>{
		if(isMobile) this.props.setStatus(OPEN_USER_M,!this.props.stateStatus.open.user_m);
		else this.props.setStatus(OPEN_USER,!this.props.stateStatus.open.user);
	}

	handleToggleModal=(e)=>{
    	let _page = e.currentTarget.dataset.page;
		if ((this.props.stateStatus.modal.page == "noti" || this.props.stateStatus.modal.page == "changePass" )&& this.props.stateStatus.open.apply) {
			this.props.setStatus(OPEN_MODAL,'applyCasting')
		} else {
			this.props.setStatus(OPEN_MODAL,_page);
			this.props.setValueStatus(OPEN_APPLY,false);
		}
		this.props.setVerifyOTP('',{});
	};

	handleLogOut=e=>{
		this.props.resetOpen();
		this.props.logOut();
		// let _domain = process.env.NODE_ENV==='production'?'.event.datafirst.solutions':'';
		// Cookies.remove('accessToken',{path: "/", domain: _domain});
		// Cookies.remove('refreshToken',{path: "/", domain: _domain});
		// Cookies.remove('username',{path: "/", domain: _domain});
		if(this.props.renewTimeout)clearTimeout(this.props.renewTimeout)
		deleteApi(process.env.BASE_URL+'/cookie');

		Router.push('/');
	}

	render(){
		let _status = this.props.stateStatus;
		let _user = this.props.stateUser;
		let _modal = this.props.stateStatus.modal;
		return(
			<React.Fragment>
				<div id="guide-user" className={((_status.open.user==true||_status.open.user_m)?'onUser':'')}>
					<div className={"guide-user__login--no"+(Object.keys(_user).length!=0?' d-none':'')} data-page='signIn' onClick={this.handleToggleModal}>
						<i className="fal fa-user-circle" />
					</div>

					<div className={"user-nav__login--yes"+(Object.keys(_user).length==0?' d-none':'')}>
						<div className="dropdown">
							<div className="img d-none d-lg-block" onClick={this.handleToggle}>
								<img src={_user.avatar} />
							</div>

							{(_status.open.user||_status.open.user_m)&&
							<div className="dropdown-menu animate__animated animate__fadeIn animate__faster dropdown-menu-right mt-4">
								<div className="profile__dropdown profile__dropdown--arrow">
									<div className="headerTitleMb d-lg-none">
										<div className="back d-lg-none posA" onClick={this.handleToggle}><i className="far fa-long-arrow-left"></i></div>
										<h6 className="text-center">Quản lý tài khoản</h6>
									</div>
									<div className="profile__dropdown--header d-flex align-items-center">
										<div className="avatar rounded-circle">
											<img src={_user.avatar} className="img-cover" alt="" />
										</div>

										<div className="info text-center text-white mt-3">
											<h6>{_user?.isAuthEmail ? _user?.email : _user?.phone}</h6>
										</div>
									</div>

									<ul className="profile__dropdown--list">
										<li>
											<Link href="/tai-khoan-bao-mat">
											<a onClick={this.handleToggle}><i className="fas fa-user-circle"></i>Tài khoản và bảo mật
											</a>
											</Link>
										</li>
										{/* <li className="li-noneLink">
											<i className="far fa-eclipse-alt" style={{top:'1px'}}></i>
											<p>Giao diện tối</p>
											<Switch
												size="small"
												checked={_status.darkMode}
												onChange={this.handleDarkMode}
												color="primary"
												name="value"
												inputProps={{ 'aria-label': 'primary checkbox' }}
												className="ms-auto"
											/>
										</li> */}
										<li>
											<Link href="/lich-su-casting">
											<a onClick={this.handleToggle}><i className="far fa-clock"></i>Lịch sử casting</a>
											</Link>
										</li>
										{/* <li>
											<Link href="/video-da-luu">
											<a onClick={this.handleToggle}><i className="far fa-bookmark" style={{left: '2px'}}></i>Danh sách video đã lưu</a>
											</Link>
										</li> */}
										{/* <li>
											<Link href="/dich-vu-da-mua">
											<a onClick={this.handleToggle}><i className="far fa-usd-circle"></i>Dịch vụ đã mua</a>
											</Link>
										</li> */}
										{/* <li>
											<Link href="/ho-tro">
												<a onClick={this.handleToggle}><i className="far fa-user-headset"></i>Hỗ trợ</a>
											</Link>
										</li> */}
										<li><a onClick={this.handleLogOut}><i className="fas fa-sign-out-alt"></i>Đăng xuất</a></li>
									</ul>
								</div>
							</div>
							}
						</div>
					</div>
				</div>

				<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					className="nl-modal modal-user"
					open={_modal.open}
					onClose={this.handleToggleModal}
					closeAfterTransition
					BackdropComponent={Backdrop}
					BackdropProps={{timeout:500}}
				>
					<Fade in={_modal.open}>
						<div className={`modal-container ${this.props.stateStatus?.modal?.page ?? ''}`}>
							<IconButton color="primary" aria-label="eye" component="span" className="close" onClick={this.handleToggleModal}>
								<i className="far fa-times"></i>
							</IconButton>

							<div className="modal-inner">
								<Login renewTimeout={this.props.renewTimeout} renewToken={this.props.renewToken}/>
								<Register />
								<Forgot />
								<ChangePass />
								<Otp renewTimeout={this.props.renewTimeout} renewToken={this.props.renewToken}/>
								<Noti />
							</div>
						</div>
					</Fade>
				</Modal>
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
		setDarkMode:val=>{dispatch(_action.setDarkMode(val))},
		resetOpen:()=>{dispatch(_action.resetOpen())},
		setVerifyOTP:(type,val)=>{dispatch(_action.setVerifyOTP(type,val))},
		setValueStatus:(type,val)=>{dispatch(_action.setValueStatus(type,val))},
		logOut:()=>{dispatch({type:LOGOUT})}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(User);
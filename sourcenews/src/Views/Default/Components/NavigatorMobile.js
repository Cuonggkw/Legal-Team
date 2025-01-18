"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import {withRouter} from 'next/router';
import {connect} from 'react-redux';

/* Application */
import {OPEN_NOTIFICATION_M,OPEN_USER_M,OPEN_MODAL} from '@config/ActionTypes';
import Action from '@libs/Action';


class NavigatorMobile extends React.Component{

	constructor(props){
		super(props);
	}

	handleToggleNoti=()=>{
		this.props.setStatus(OPEN_NOTIFICATION_M,!this.props.stateStatus.open.notification);
	}

	handleToggleDropdownUser=()=>{
		if(Object.keys(this.props.stateUser).length>0){
			this.props.setStatus(OPEN_USER_M,!this.props.stateStatus.open.user);
		}else{
			this.props.setStatus(OPEN_MODAL,'signIn');
			this.props.setVerifyOTP('',{});
		}
	}

	render(){
		return(
			<>
				<div id="nl-navMobile" className="d-lg-none">
					<div className="navMobile-inner">
						<Link href="/">
							<a title="Trang chủ" className={this.props.router.query.pages[0]=='homepage'?'active':''}>
								<i className="fal fa-home"></i>
								<p>Trang chủ</p>
							</a>
						</Link>

						<Link href="/casting">
							<a title="casting" className={(this.props.router.query.pages&&this.props.router.query.pages[0]=='casting')?'active':''}>
								<i className="fal fa-globe-africa"></i>
								<p>Casting</p>
							</a>
						</Link>

						<a title="Cá nhân" onClick={this.handleToggleDropdownUser} className={(this.props.router.query.pages&&(this.props.router.query.pages[0]=='tai-khoan-bao-mat'))?'active':''}>
							<i className="fal fa-user-circle" />
							<p>Cài đặt</p>
						</a>
					</div>
				</div>
			</>
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
		resetOpen:()=>{dispatch(_action.resetOpen())},
		setVerifyOTP:(type,val)=>{dispatch(_action.setVerifyOTP(type,val))}
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(NavigatorMobile));
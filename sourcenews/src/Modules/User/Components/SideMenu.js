"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import {withRouter} from 'next/router';
import {connect} from 'react-redux';

/* Application */


class SideMenu extends React.Component{

	constructor(props){
		super(props);
	}

	render(){

		return(
			<React.Fragment>
				<div className="user-layout__left d-none d-lg-block">
					<div className="inner">
						<ul>
							{Object.keys(this.props.stateUser).length>0&&<>
							<li>
								<Link href="/tai-khoan-bao-mat">
								<a className={(this.props.router.query.pages&&this.props.router.query.pages[0]=='tai-khoan-bao-mat')?'active':''}><i className="fas fa-user-circle"></i>Tài khoản và bảo mật
								</a>
								</Link>
							</li>
							<li>
								<Link href="/lich-su-casting">
								<a className={(this.props.router.query.pages&&this.props.router.query.pages[0]=='lich-su-casting')?'active':''}><i className="fas fa-user-circle"></i>Lịch sử casting
								</a>
								</Link>
							</li>
							</>}
							{/* <li>
								<Link href="/ho-tro">
									<a className={(this.props.router.query.pages&&this.props.router.query.pages[0]=='ho-tro')?'active':''}><i className="far fa-user-headset"></i>Hỗ trợ</a>
								</Link>
							</li> */}
						</ul>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

const mapStateToProps=state=>{
	return {
		stateUser:state.user
	}
}

export default withRouter(connect(mapStateToProps)(SideMenu));
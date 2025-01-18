"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import { withRouter } from 'next/router';
import {connect} from 'react-redux';

/* Application */
import Action from '@libs/Action';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import HideOnScroll from '@views/Default/Components/HideOnScroll';
import Search from '@views/Default/Components/Search';
import Image from "next/image";
//import Notification from '@views/Default/Components/Notification';
import User from '@views/Default/Components/User';
import Button from '@mui/material/Button';

/* Package style */
import CssBaseline from '@mui/material/CssBaseline';

class Header extends React.Component{

	constructor(props){
		super(props);
		this.state={
			bgTransparent: true,
			isOpenFlag: false,
		}
		this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount() {
	    window.addEventListener("scroll", this.handleScroll);
	}

	componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

	handleScroll=()=>{
		if(window.pageYOffset>0){
			this.setState({bgTransparent:false})
		}else{
			this.setState({bgTransparent:true})
		}
	}

	handleClickOutSide=()=>{
		let _status = this.props.stateStatus.open;
		if(_status.search==true||_status.notification==true||_status.user==true){
			this.props.resetOpen();
		}
	}

	handleIsOpenFlag = () => {
		this.setState({
			isOpenFlag: !this.state.isOpenFlag,
		})
	}

	render(){
		let { isOpenFlag } = this.state;
		return(
			<React.Fragment>
				<CssBaseline />
					<AppBar id="nl-header" color="inherit" className={this.state.bgTransparent == true ? 'transparent':''}>
						<Toolbar>
							<div id="nl-header__mastehead" className={this.state.bgTransparent == true ? 'transparent' : ''}>
								<div className="d-flex">
									<div id="guide-nav" className="guide-render d-none d-lg-flex">
										<nav id="guide-menu">
												<div className="logo">
													<Link href="/">
														<a title="MCV">
															<img alt="Logo" src="/images/logo_legal.png"/>
														</a>
													</Link>
												</div>
												<ul>
													<li>
														<Link href="/">
															<a title="Trang chủ" className={this.props.router.query.pages[0]=='homepage'?'active':''}>Trang chủ</a>
														</Link>
													</li>
													<li>
														<Link href="/news">
															<a title="Legal In-House" className={(this.props.router?.query?.pages&&(this.props.router.query.pages[0]=='news'))?'active':''}>Legal In-House</a>
														</Link>
													</li>
													<li>
														<Link href="#">
															<a title="Tax In-House" className={(this.props.router?.query?.pages&&(this.props.router.query.pages[0]=='news'))?'active':''}>Tax In-House</a>
														</Link>
													</li>
													<li>
														<Link href="#">
															<a title="Biểu mẫu" className={(this.props.router?.query?.pages&&(this.props.router.query.pages[0]=='news'))?'active':''}>Biểu mẫu</a>
														</Link>
													</li>
													<li>
														<Link href="#">
															<a title="Diễn đàn" className={(this.props.router?.query?.pages&&(this.props.router.query.pages[0]=='news'))?'active':''}>Diễn đàn</a>
														</Link>
													</li>
												</ul>
												<div className="right">
													<div className="flags" onClick={this.handleIsOpenFlag}>
														<div className="flags__icon">
															<a className="flags__icon-vi" title="MCV"><img alt="Logo" src="/images/flag-vi.png"/></a>
														</div>
														<p className="flags__icon-header">Tiếng Việt</p>
													</div>
													<button className="nl-button">
														<p>Đăng nhập</p>
													</button>
												</div>
										</nav>
									</div>
								</div>
								{isOpenFlag &&
									<div className="nation">
										<div className="nation-vi">
											<div className="nation-vi-icon">
												<a className="nation-vi-flag" title="MCV"><img alt="Logo" src="/images/flag-vi.png"/></a>
												<p className="nation-vi-header">Tiếng Việt</p>
											</div>
										</div>
										<div className="nation-en">
											<div className="nation-en-icon">
												<a className="nation-en-flag" title="MCV"><img alt="Logo" src="/images/flag-en.png"/></a>
												<p className="nation-en-header">Tiếng Anh</p>
											</div>
										</div>
									</div>
								}
							</div>
						</Toolbar>
					</AppBar>
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
		resetOpen:()=>{dispatch(_action.resetOpen())}
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Header));
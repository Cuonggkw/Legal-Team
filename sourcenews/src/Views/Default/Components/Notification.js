"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import PerfectScrollbar from 'react-perfect-scrollbar';
import Card from '@views/Default/Components/Card';
import {OPEN_NOTIFICATION,OPEN_NOTIFICATION_M} from '@config/ActionTypes';
import Action from '@libs/Action';


class Notification extends React.Component{

	constructor(props){
		super(props);
	}

	handleToggle=e=>{
		let _type = e.currentTarget.dataset.type;
		if(_type=='mobile') this.props.setStatus(OPEN_NOTIFICATION_M,!this.props.stateStatus.open.notification_m);
		else this.props.setStatus(OPEN_NOTIFICATION,!this.props.stateStatus.open.notification);
	}

	render(){
		let _status = this.props.stateStatus.open;

		return(
			<React.Fragment>
				<div id="guide-noti" className={((_status.notification==true||_status.notification_m)?'onNoti':'')}>
					<div className="noti-icon notification d-none d-lg-block" onClick={this.handleToggle}>
						<i className="fal fa-bell"></i>
					</div>

					{(_status.notification==true||_status.notification_m==true)&&
					<div className="guide-noti__ctn animate__animated animate__fadeIn animate__faster">
						<div className="nl-scroll">
							<div className="headerTitleMb">
								<div className="back d-lg-none posA" data-type="mobile" onClick={this.handleToggle}><i className="far fa-long-arrow-left"></i></div>
								<h6 className="text-center">Thông báo</h6>
							</div>

							<div className="lineDM d-none d-lg-block"></div>

							<div className="guide-noti__list">
								<PerfectScrollbar >
									<Card 
										title="Noti ... "
										image={"/images/img1.png"}
										time="1 tiếng trước"
										type="horizontal"
										link="/ten-show/slug"
									/>
								</PerfectScrollbar>
							</div>
						</div>
					</div>
					}
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
		setStatus:(type,val)=>{dispatch(_action.setStatus(type,val))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Notification);
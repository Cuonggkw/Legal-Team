"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import Button from '@mui/material/Button';
import Spinkit from '@views/Default/Components/Spinkit';
import Action from '@libs/Action';
import {OPEN_MODAL} from '@config/ActionTypes';
class Noti extends React.Component{

	constructor(props){
		super(props);
		this._isMounted = false;

		this.state={
			status:{
				loading:false
			},
			countdown:5,
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
		this.setState({values:{otp:values}});
	}

	handleSubmit=e=>{
		e.preventDefault();
	}

	countDownTime=()=>{
		let _num = this.state.countdown;
		if(_num>0){
			_num-=1;
			this.setState({countdown:_num});
		}else{
			clearInterval(this.timer);
		}
	}

	componentDidUpdate(prevProps,prevState){
		this._isMounted = true;
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
		let {loading} = this.state.status;
		let {values} = this.state;

		return(
			<React.Fragment>
				<div id="modal-noti" className={"modal-page animate__animated animate__faster" + ((_modal.page=='noti')?' show animate__fadeIn':'')}>
					<div className="modal-title">
						<h4>Thành công !</h4>
						<p>Cập nhật mật khẩu thành công</p>
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
}

export default connect(mapStateToProps,mapDispatchToProps)(Noti);
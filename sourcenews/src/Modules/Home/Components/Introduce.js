"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';
import Action from '@libs/Action';

/* Package Application */
import {fetchApi, changeToSlug} from '@helpers/Common';

/* Package style */
class Introduce extends React.Component{

	constructor(props) {
		super(props);
		this._isMounted = false;

		this.state = {
			dataPage: [],
			isSort: "asc",
			isSorting: (props.sort) ? props.sort : 'created_at',
		}
	}

	async componentDidMount() {
		this._isMounted = true;
		// this.getData();
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps, prevState) {
		if(this.state.dataPage.length == 0){
			// this.getData();
		}
	}


	render() {
		let _data = typeof(this.state.dataPage[0]) !== 'undefined' ? this.state.dataPage[0] :[];
		return (
			<React.Fragment>
				<>
				<div id="nl-main">
					<section className="sl-section">
           <div className="sl-section_introduce">

           </div>
					</section>
				</div>
				</>
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
		setValueStatus:(type,val)=>{dispatch(_action.setValueStatus(type,val))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Introduce);
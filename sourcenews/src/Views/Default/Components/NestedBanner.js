"use strict";

/* Package System */
import React from "react";

/* Application */
import Banner from './Banner';

export default class extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<div id="nl-main">
				<Banner />
				{this.props.children}
			</div>
		)
	}
}
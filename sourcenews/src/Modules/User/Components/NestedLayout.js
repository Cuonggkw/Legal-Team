"use strict";

/* Package System */
import React from "react";

/* Application */
import SideMenu from './SideMenu';


export default class extends React.Component{

	constructor(props){
		super(props);
	}

	render(){

		return(
			<React.Fragment>
				<div className="user-layout">
					<div className="container">
						<div className="d-flex">
							<SideMenu />

							<div className="user-layout__right">
								{this.props.children}
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		)
	}
}
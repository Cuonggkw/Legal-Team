"use strict";

/* Package System */
import React from "react";
import {urlCDN} from '@helpers/Common';
/* Application */



class UserChat extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<React.Fragment>
				<div className="chat-user">
					<div className="avatar">
						{this.props.image&&this.props.image!=""&&this.props.image!="https://cdn.netlove.com.vn/"? (
							<img src={this.props.image} alt="user" />
						) : (
							<img src={'https://cdn.netlove.com.vn/images/637613588386667156_avatarImage'} alt="user" />
						)}
					</div>

					<div className="content">
						<p><strong>{(this.props.username.trim()==''||this.props.username.trim()=='null null')?'Ẩn danh':this.props.username.replace(/null/i,'')}</strong> {this.props.chat}</p>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default UserChat;
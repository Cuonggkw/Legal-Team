"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';

/* Application */
import {putApi,urlCDN} from '@helpers/Common';
import IconButton from '@mui/material/IconButton';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
timeago.register('vi', vi);


class Comment extends React.Component{

	constructor(props){
		super(props);
		this.state={
			value:props.text
		}
		this.old = props.text;
	}

	handleValues=e=>{
		this.setState({value:e.target.value});

	}
	
	handleCancel=e=>{
		let _id = e.currentTarget.dataset.id;
		this.setState({value:this.old});
		this.props.funcCancel(_id);
	}

	handleSave=e=>{
		let _id = e.currentTarget.dataset.id;
		putApi(process.env.API_URL+'/comments/'+_id,{
			"content":this.state.value			
		},this.props.stateUser.accessToken).then(resp=>{
			if(resp.data.status=="success"){
				this.props.funcCancel(_id);
				this.old = this.state.value;
			}else console.log(resp.data.errorMessage);
		}).catch(e=>console.log(e));
	}

	render(){
		return(
			<React.Fragment>
				<div className="comment-list__item">
					<div className="author-thumbnail">
						{this.props.image&&this.props.image!=""? (
							<div className="avatar author-thumbnail__yes">
								<img src={urlCDN(this.props.image)} alt="user" />
							</div>
						) : (
							<div className="avatar author-thumbnail__yes">
								<img src={'https://cdn.netlove.com.vn/images/637426030003150256_default_person.png'} alt="user" />
							</div>
						)}
					</div>

					<div className="text">
						<div className="name">{(this.props.username?.trim()==''||this.props.username?.trim()=='undefined undefined')?'Ẩn danh':this.props.username?.replace(/null/i,'')}</div>
						<div className="text-inner">
							<TextField
								multiline
								disabled={((this.props.isEditComment==true)?false:true)}
								variant="filled"
								name="comment"
								value={this.state.value}
								onChange={this.handleValues}
							/>
						</div>
						{this.props.isEditComment==true?(
							<div className="editComment-buttons">
								<Button className="btn-cancel" data-id={this.props.id} onClick={this.handleCancel}>Hủy</Button>
								<Button variant="contained" className="btn-save" data-id={this.props.id} onClick={this.handleSave}>Lưu</Button>
							</div>
						): (
							<div className="time"><TimeAgo datetime={this.props.time} locale='vi' />{this.props.editable==true&& this.props.user_id==this.props.stateUser.id?(<>
							&nbsp;| <a data-id={this.props.id} onClick={this.props.funcEdit} title="Sửa">Sửa</a> - <a data-id={this.props.id} onClick={this.props.funcDel} title="Xóa">Xóa</a>
							</>):('')}</div>
						)}
					</div>

					<div className="action-menu" style={{display:'none'}}>
						<IconButton className="sent-comment" color="primary" aria-label="upload picture" component="span">
							<i className="fal fa-ellipsis-v"></i>
						</IconButton>
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

export default connect(mapStateToProps)(Comment);
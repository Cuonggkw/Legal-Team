"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import Router from 'next/router';
import {connect} from 'react-redux';
import Action from '@libs/Action';

import Button from '@mui/material/Button';
import {OPEN_MODAL,OPEN_APPLY} from '@config/ActionTypes';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
timeago.register('vi', vi);
/* Application */
import Skeleton from '@mui/material/Skeleton';

/* Package style */
 

class Card extends React.Component{

	constructor(props){
		super(props);
	}

	handleToggle=(e)=>{
		if(Object.keys(this.props.stateUser).length<=0){
			this.props.setStatus(OPEN_MODAL,'signIn');
			this.props.setValueStatus(OPEN_APPLY,this.props.onClickValue);
		}else{
			if(this.props.onClickValue && this.props.onClick && this.props.onClick == "handleToggleModalApply"){
				this.props.setStatus(OPEN_MODAL,'applyCasting');
				this.props.setValueStatus(OPEN_APPLY,this.props.onClickValue);
			}
			if(this.props.onClickValue && this.props.onReview && this.props.onReview == "handleToggleModalReview"){
				this.props.setStatus(OPEN_MODAL,'reviewCasting');
				this.props.setValueStatus(OPEN_APPLY,this.props.onClickValue);
			}
		}
	}

	handleToggleCancel=(e)=>{
		if(Object.keys(this.props.stateUser).length<=0){
			this.props.setStatus(OPEN_MODAL,'signIn');
		}else{
			if(this.props.onClickValue && this.props.onReview && this.props.onReview == "handleToggleModalReview"){
				this.props.setStatus(OPEN_MODAL,'cancelCasting');
				this.props.setValueStatus(OPEN_APPLY,this.props.onClickValue);
			}
		}
	}

	render(){
		const {loading} = this.props;
		return(
			<>
				<div className={"nl-card " + ((this.props.type&&this.props.type=="horizontal")?' horizontal':'') + ((this.props.backgroundBody)?(this.props.backgroundBody+' bg'):'')}>
	    			<div className="nl-card__img">
						{this.props.onClick ? (
						<>
							{loading ? (
								<Skeleton animation="wave" variant="rect" width="100%">
								<div style={{ paddingTop: "57%" }} />
							</Skeleton>
							) : (
								<>
									<img src={this.props.image} className="img-fluid" alt={this.props.title} />
									<div onClick={this.handleToggle}>
										<Button type="submit" variant="contained" className={"btn btn-primary btn-submit"+(this.props.openCasting == 1 ? "" :" disabled")} disabled={(loading==true ? true : (this.props.openCasting != 1 ? true : false ))}>
											{this.props.openCasting == 1 ? 'OK': "Disable"}{loading==true&&<Spinkit name="sk-fading-circle" color="white" />}
										</Button>
									</div>
								</>
							)} 
						</>
						) : this.props.noImglink ? (
							<>
							{loading ? (
								<Skeleton animation="wave" variant="rect" width="100%">
									<div style={{ paddingTop: "57%" }} />
								</Skeleton>
							) : (
								<img src={this.props.image} className="img-fluid" alt={this.props.title} />
							)}
							</>
						) : (
							<>
							{loading ? (
								<Skeleton animation="wave" variant="rect" width="100%">
									<div style={{ paddingTop: "57%" }} />
								</Skeleton>
							) : (
								<Link href={{pathname: this.props.link,}}>
									<a target={this.props.target?this.props.target:'_self'} title={this.props.title}>
										<img src={this.props.image} className="img-fluid" alt={this.props.title} />
									</a>
								</Link>
							)}
							</>
						)
	    				}
	    			</div>
	    			
	    			<div className="nl-card__body">
	    				{this.props.date&&
	    				<div className="date">
	    					{loading ? (
	    						<Skeleton animation="wave" variant="text" width="20%" />
	    					) : (
	    						<>
									{this.props.date && <span><TimeAgo datetime={this.props.date} locale='vi' /></span>}
									{this.props.views &&<span> | {this.props.views}</span>}
	    						</>
	    					)}
	    				</div>

	    				}

	    				<h4>
	    					{loading ? (
	    						<>
	    							<Skeleton animation="wave" variant="text" />
	    							<Skeleton animation="wave" variant="text" />
	    						</>
	    					) : (
								<>
								{this.props.onClick ? (
	    						<Link href={{pathname: this.props.link??'/'}} >
		    						<a target={this.props.target?this.props.target:'_self'} title={this.props.title}>{this.props.title}</a>
		    					</Link>
								):(
								<Link href={{pathname: this.props.link??'/'}} >
		    						<a target={this.props.target?this.props.target:'_self'} title={this.props.title}>{this.props.title}</a>
		    					</Link>
								)}
								</>
	    					)}
	    				</h4>

	    				{this.props.programme&&
	    				<div className="programme">
	    					{(loading)?(
    							<Skeleton animation="wave" variant="text" width="70%" />
	    					):(
	    						<>
	    							<i className="fas fa-heart"></i>{this.props.programme}
									{this.props.eps&&<span>{this.props.eps}</span>}
								</>
	    					)}
	    				</div>
	    				}

	    				{this.props.views &&
	    				<div className="views">
	    					{(loading)?(
    							<Skeleton animation="wave" variant="text" width="70%" />
	    					):(
	    						<>
									{this.props.views&&<span>{this.props.views}</span>}
									{this.props.createdTime&&<span><TimeAgo datetime={this.props.createdTime} locale='vi' /></span>}
								</>
	    					)}
	    				</div>
	    				}

	    				{this.props.episode&&
	    				<div className="programme">
							{loading ? (
	    						<Skeleton animation="wave" variant="text" width="70%" />
	    					) : (
	    						<>
		    						<i className="fas fa-heart"></i>
									{this.props.episode}
								</>
	    					)} 
	    				</div>
	    				}

	    				{this.props.process&&
	    				<div className={"process " + ((loading)&&'hasSke')}>
	    					{loading ? (
	    						<Skeleton animation="wave" variant="text" />
	    					) : (
	    						<div style={{width:this.props.process}}></div>
	    					)}
	    				</div>
	    				}

						{this.props.category&&
	    				<div className="category">
						{loading ? (
							<Skeleton animation="wave" variant="text" width="70%" />
						) : (
							<>
								{this.props.category}
							</>
						)} 
					</div>
	    				}

						{this.props.onReview&&
						<div className="review">
							{loading ? (
								<Skeleton animation="wave" variant="text" width="20%" />
							) : (
								<>
								<div style={{display:'flex', justifyContent: 'space-between'}}>
									<div onClick= {this.handleToggle} className="detail">
										<>
											Xem chi tiết
										</>									
									</div>
									{/* <div onClick= {this.handleToggleCancel} className="cancel">
										<>
											Hủy apply
										</>									
									</div> */}
								</div>
								</>
							)}
						</div>
						}
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
		setValueStatus:(type,val)=>{dispatch(_action.setValueStatus(type,val))},
		setVerifyOTP:(type,val)=>{dispatch(_action.setVerifyOTP(type,val))},
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Card);
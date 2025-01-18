import React from "react";
import Image from "next/image";
// nodejs library to set properties for components
import {withRouter} from 'next/router';
import {connect} from 'react-redux';
// @material-ui/core components
import { Button, Tooltip } from "@mui/material";
import moment from "moment"
import { OPEN_MODAL } from "../../../Config/ActionTypes";
import Action from '@libs/Action';

class CardBody extends React.Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
      <React.Fragment>
			<div className="cardInfoD">
				{(this.props?.start_date || this.props?.end_date) && <div className="cardFromTo">
					{this.props?.start_date && <div className="cardForm">
						<span>Từ</span><p>{moment(this.props.start_date, "YYYY-MM-DD[T]HH:mm:SS[Z]").format('DD/M/YYYY')}</p>
					</div>}
					{this.props?.end_date && <div className="cardTo">
						<span>Đến</span><p>{moment(this.props.end_date, "YYYY-MM-DD[T]HH:mm:SS[Z]").format('DD/M/YYYY')}</p>
					</div>}
				</div>}
				<div className="cardCount">
					<div>
						<span>Lượng tương tác</span>
					</div>
					<div className="cardCountItem">
						<Image alt="" src="/images/vote.png" width={20} height={20} quality={100} />
						<p>{this.props.count_vote}</p>
						<div style={{ width: 15 }} />
						{!this.props.hiddenCountCmt && <>
							<Image alt="" src="/images/cmd.png" width={20} height={20} quality={100} />
							<p>{this.props.count_comment}</p>
						</>}
					</div>
				</div>
				<div className="cardCreator">
					<span>Người tạo</span>
					<p>{this.props?.created_by}</p>
				</div>
				{
					this.props?.url && <div className="cardCreator">
						<span>Url</span>
						<Tooltip
							onClick={() => {
								this.setState({ ...this.state, textClipBoard: 'Copied' });
								setTimeout(() => {
									this.setState({ ...this.state, textClipBoard: undefined });
								}, 1000);
								return navigator.clipboard.writeText(this.props?.url);
							}}
							title={this.state?.textClipBoard ?? this.props?.url}><p className="url">{this.props?.url}</p></Tooltip>
					</div>
				}
				{
					(this.props?.video_embbed && new RegExp('^<iframe .*</iframe>$','i').test(this.props?.video_embbed) ) && <div className="cardCreator" dangerouslySetInnerHTML={{__html:`<span>Video Embbed</span> ${this.props.video_embbed}`}}>
					</div>
				}
				{this.props.vote && <div style={{ paddingTop: 15 }}>
					<Button
						className={`btn ${this.props.isVote ? 'btn-success' : ''}`}
						variant="contained"
						onClick={(e) => Object.keys(this.props.stateUser).length<=0
							 ? this.props.setStatus(OPEN_MODAL,'signIn'): this.props.handleVote()}
					>
						{this.props.isVote ? 'Đã bình chọn' : 'Bình chọn'}
					</Button>
				</div>}
			</div>
			{
				this.props?.description && <div className="cardCreator">
					<span>Mô tả</span>
					<p>{this.props?.description}</p>
				</div>
			}
      </React.Fragment>
    );
  }
}const mapStateToProps=state=>{
	return {
		stateStatus:state.status,
		stateUser:state.user
	}
}
const mapDispatchToProps=dispatch=>{
	let _action = new Action();

	return{
		setStatus:(type,val)=>{dispatch(_action.setStatus(type,val))},
		setVerifyOTP:(type,val)=>{dispatch(_action.setVerifyOTP(type,val))},
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CardBody));

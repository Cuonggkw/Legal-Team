"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';
import {withRouter} from 'next/router';

/* Application */
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import {FacebookShareButton,FacebookMessengerShareButton,TwitterShareButton} from "react-share";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

class ModalShare extends React.Component{

	constructor(props){
		super(props);
		this.state={
			valueCopied:process.env.BASE_URL+props.router.asPath,
			copied:false,
			snackbar:false
		}
	}

	handleToggleModal=()=>{
		this.props.funcToggle();
	}

	handleCopied=()=>{
		this.setState({copied:true});
		this.setState({snackbar:true})
	}

	handleCloseSnackbar=()=>{
		this.setState({snackbar:false})
	}

	handleShare=e=>{
		let _type = e.currentTarget.dataset.type;
		if(_type=='viber') window.location = "viber://forward?text="+process.env.BASE_URL+this.props.router.asPath;
	}

	render(){

		return(
			<React.Fragment>
				<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					className="nl-modal"
					open={this.props.status}
					onClose={this.handleToggleModal}
					closeAfterTransition
					BackdropComponent={Backdrop}
					BackdropProps={{timeout:500}}
				>
					<Fade in={this.props.status}>
						<div className="modal-container modal-share">
							<h4 className="modal-head-title">Chia sẻ</h4>
							<IconButton color="primary" aria-label="eye" component="span" className="close" onClick={this.handleToggleModal}>
								<i className="far fa-times"></i>
							</IconButton>

							<div className="modal-share__list">
								<div className="once">
									<FacebookShareButton url={process.env.BASE_URL+this.props.router.asPath} hashtag={"#MCV"}>
										<IconButton aria-label="eye" component="span" className="btn-share fb">
											<i className="fab fa-facebook-f"></i>
										</IconButton>
										<p>Facebook</p>
									</FacebookShareButton>
								</div>
								<div className="once">
									<FacebookMessengerShareButton appId={process.env.FB_APP_ID} url={process.env.BASE_URL+this.props.router.asPath} redirectUri={process.env.BASE_URL+this.props.router.asPath}>
										<IconButton aria-label="eye" component="span" className="btn-share mes">
											<i className="fab fa-facebook-messenger"></i>
										</IconButton>
										<p>Facebook Messenger</p>
									</FacebookMessengerShareButton>
								</div>
								{/*<div className="once">
									<IconButton aria-label="eye" component="span" className="btn-share">
										<img alt="Chia sẻ Zalo" src="/images/oa_logo.png" />
									</IconButton>
									<p>Zalo</p>
								</div>*/}
								<div className="once">
									<TwitterShareButton url={process.env.BASE_URL+this.props.router.asPath} hashtags={["MCV"]}>
										<IconButton aria-label="eye" component="span" className="btn-share twt">
											<i className="fab fa-twitter"></i>
										</IconButton>
										<p>Twitter</p>
									</TwitterShareButton>
								</div>
								<div className="once" onClick={this.handleShare} data-type="viber">
									<IconButton aria-label="eye" component="span" className="btn-share">
										<img alt="Chia sẻ Viber" src="/images/icon-viber.png" />
									</IconButton>
									<p>Viber</p>
								</div>
							</div>

							<div className="modal-share__copy">
								<p>{this.state.valueCopied}</p>
								<CopyToClipboard text={this.state.valueCopied} onCopy={this.handleCopied}>
					          		<Button>Copy</Button>
					        	</CopyToClipboard>
							</div>
						</div>
					</Fade>
				</Modal>

				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					open={this.state.snackbar}
					onClose={this.handleCloseSnackbar}
					autoHideDuration={3000}
					message="Đã sao chép"
				/>
			</React.Fragment>
		)
	}
}

export default withRouter(ModalShare);
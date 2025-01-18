"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import BackToTop from '@views/Default/Components/BackToTop';
import Fab from '@mui/material/Fab';
import {fetchApi, changeToSlug} from '@helpers/Common';

class Footer extends React.Component{
	constructor(props){
		super(props);
		this._isMounted = false;

		this.state = {
			dataPage: [],
		}
	}

		componentDidMount() {
			this._isMounted = true;
			this._isMounted && fetchApi(process.env.API_URL + 'footers-all?fqnull=deleted_at').then(result=>this._isMounted&&this.setState({
				dataPage: result.data.data,
			})).catch(e=>console.log(e));
		}

	componentWillUnmount(){
		this._isMounted = false;
	}

	handleScrollTop=()=>{
		window.scrollTo({top:0,behavior:'smooth'})
	}


	render(){
		let _data = typeof(this.state.dataPage[0]) !== 'undefined' ? this.state.dataPage[0] :[];
		return(
			<>
				<footer id="nl-footer">
					<div className="nl-footer__left">
					<img
            className="logo_footer"
            src={_data.logo != null ? `${process.env.CDN_URL_S3}/${_data.logo}` : ``}
          />
					</div>

					<div className="nl-footer__right">
						<div className="left">
							<div className="nl-footer__email">
								<a className="email_icon" title="MCV"><img alt="Logo" src="/images/mail-02.png"/></a>
								<div className="email_footer">{_data.email}</div>
							</div>
							<div className="nl-footer__web">
								<a className="web_icon" title="MCV"><img alt="Logo" src="/images/globe-02.png"/></a>
								<div className="wev_footer">{_data.web}</div>
							</div>
						</div>

						<div className="right">
							<div className="nl-footer__phone">
								<a className="phone_icon" title="MCV"><img alt="Logo" src="/images/phone-call-01.png"/></a>
								<div className="phone_footer">{_data.phone_number}</div>
							</div>
						</div>
					</div>
				</footer>

				<BackToTop {...this.props}>
					<Fab color="secondary" size="small" aria-label="scroll back to top" onClick={this.handleScrollTop}>
						<i className="fas fa-angle-up"></i>
					</Fab>
				</BackToTop>
			</>
		)
	}
}

export default Footer;
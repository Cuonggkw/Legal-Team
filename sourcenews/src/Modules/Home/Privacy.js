"use strict";

/* Package System */
import React from "react";

/* Package Application */
import {fetchApi} from '@helpers/Common';

class Privacy extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state={content:''}
	}

	componentDidMount() {
		this._isMounted = true;
		this._isMounted&&fetchApi(process.env.BASE_URL+'/contents/chinh-sach-bao-mat.txt').then(result=>this._isMounted&&this.setState({
			content:result.data
		})).catch(e=>console.log(e))
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	render(){

		return(
			<React.Fragment>
				<div className="page-privacy">
					<div className="container">
						<div className="page-privacy__title">
							<h2>Chính sách quyền riêng tư</h2>
							<p>Cập nhật lần cuối ngày: 15/06/2021</p>
						</div>

						<div className="page-privacy__main" dangerouslySetInnerHTML={{ __html:this.state.content}}></div>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default Privacy;
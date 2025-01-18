"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';

/* Package Application */
import Card from '@views/Default/Components/Card';
import {fetchApi,changeToSlug} from '@helpers/Common';

/* Package style */
export default class extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;

		this.state = {
			dataPage: []
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this._isMounted&&fetchApi(process.env.API_URL+'news?fqnull=deleted_at').then(result=>this._isMounted&&this.setState({
			dataPage: result.data.data
		})).catch(e=>console.log(e));
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	render() {		
		return (
			<React.Fragment>
				{(this.state.dataPage&&this.state.dataPage.length>0)&&<>
				<section className="sl-section">
					<div className="container">
						<div className="sl-section__content swpBtn-center">
							<div className="row">
								{this.state.dataPage.map(item=>
									<div key={item.id} className="col-lg-4 col-md-4 col-sm-6">
										<Card
											title={item.name}
											image={item.image != null ? `${process.env.CDN_URL_S3}${item.image}` : ``}
											backgroundBody="gray"
											onClickValue={item.id}
											link={"news/"+ item.slug }
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
				</>}
			</React.Fragment>
		)
	}
}
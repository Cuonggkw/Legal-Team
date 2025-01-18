"use strict";

import { it } from "date-fns/locale";
/* Package System */
import React from "react";
import {fetchApi,changeToSlug} from '@helpers/Common';
import LegalHome from "@modules/Home/Components/LegalHome";
/* Package Application */

export default class extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			dataPage: [],
			dataSolution: [],
			isSort: "asc",
			isSorting: (props.sort) ? props.sort : 'created_at',
		}
	}

	componentDidMount () {
		this._isMounted = true;
		this.getData();
		this.getSolutions();
	}

	componentWillUnmount () {
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps, prevState) {
		if(this.state.dataPage.length == 0){
			this.getData();
		}
		if(this.state.dataSolution.length == 0){
			this.getSolutions();
		}
	}

		getData = () =>{
			try{
				this._isMounted && fetchApi(process.env.API_URL + `/all-overviews?sort=${this.state.isSorting}`).then(result=>this._isMounted&&this.setState({
					dataPage: result.data.data,
				})).catch(e=>console.log(e));
			} catch (e) {
				console.log(e);
				}
		}

		getSolutions = () =>{
			try{
				this._isMounted && fetchApi(process.env.API_URL + `/all-solutions?sort=${this.state.isSorting}`).then(result=>this._isMounted&&this.setState({
					dataSolution: result.data.data,
				})).catch(e=>console.log(e));
			} catch (e) {
				console.log(e);
				}
		}

	render() {
		let _data = typeof(this.state.dataPage[0]) !== 'undefined' ? this.state.dataPage[0] :[];
		console.log(_data);
		return (
			<React.Fragment>
				<section className="sl-section">
					<div className="sl-section_home">
						{this.state.dataPage && this.state.dataPage.length > 0 &&
						this.state.dataPage.slice(0, 3).map(item => (
							<div key={item.id} className="container_overviews">
								<div className="overviews">
									<div className="overviews_id">
										<p>{item.id}</p>
									</div>
									<div className="overviews_content">
										<div className="headers">{item.header}</div>
										<div className="contents">{item.content}</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="sl-section_solutions">
						{this.state.dataSolution && this.state.dataSolution.length > 0 &&
						this.state.dataSolution.map(item => (
							<div key={item.id} className="container_solutions">
								<div className="solutions_content">
									<div className="solutions_headers">{item.header}</div>
									<div className="solutions_contents" dangerouslySetInnerHTML={{__html: item.content}}></div>
								</div>
								</div>
						))}
					</div>
					<LegalHome />
				</section>
			</React.Fragment>
		)
	}
}
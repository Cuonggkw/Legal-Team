"use strict";

/* Package System */
import React from "react";
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

/* Application */
import { OPEN_SEARCH } from '@config/ActionTypes';
import Action from '@libs/Action';
import { fetchApi, changeToSlugSearch } from '@helpers/Common';

class Search extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			value: '',
			suggestion: [],
			linkSubmit: '',
		}
	}

	handleToggle=()=>{
		this.props.setStatus(OPEN_SEARCH,!this.props.stateStatus.open.search);
	}
	handleChangeValue = e => {
		let _value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		fetchApi(process.env.API_URL+'/search?s='+_value+'&limit=12').then(result=>{
			let _result = [];
			if(result.data.status == 'success' && result.data.total > 0){
				result.data.items.forEach(e=>{
					_result.push(e.video_title);
				});
			}
			this._isMounted&&this.setState({suggestion:_result});
		}).catch(e=>console.log(e))
		this.setState({value:_value,linkSubmit:_value.length>=3?'/tim-kiem/'+encodeURIComponent(_value):''});
	}

	handleClear=()=>{
		this.setState({value:''});
	}

	handleSubmit=e=>{
		e.preventDefault();
		this.setState({...this.init});
		this.handleToggle();
		if(this.state.value.length>3) Router.push('/tim-kiem/'+encodeURIComponent(this.state.value));
	}

	resetForm=e=>{
		let _url = e.target.dataset.sg;
		this.setState({...this.init});
		this.handleToggle();
		Router.push('/tim-kiem/'+encodeURIComponent(_url));
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	render() {
		let _status = this.props.stateStatus.open.search;

		return (
			<React.Fragment>
				<div id="guide-search" className={"guide-render" + (_status == true ? ' onSearch' : '')}>
					<span className="ic-search" onClick={this.handleToggle}>
						<i className="fal fa-search"></i>
					</span>

					{_status &&
						<div className="guide-search__inner">
							<form noValidate autoComplete="off" className="headerTitleMb" onSubmit={this.handleSubmit}>
								<div className="back d-lg-none" onClick={this.handleToggle}><i className="far fa-long-arrow-left"></i></div>
								<input autoFocus type="text" name="search" placeholder="Tìm kiếm" onChange={this.handleChangeValue} value={this.state.value || ''} />
								{this.state.value != '' &&
									<button onClick={this.handleClear} type="reset" className="d-lg-none"><i className="fal fa-times"></i></button>
								}
								<input type="submit" />
								<span className="ic-search">
									<i className="fal fa-search"></i>
								</span>
							</form>
							{this.state.suggestion && this.state.suggestion.length > 0 &&
								<div className="guide-search__Autocomplete animate__animated animate__fadeIn animate__faster">
									<div className="nl-scroll">
										<div className="suggestedKeywords">
											<div className="suggestedKeywords-head">
												<ul onClick={this.handleToggle}>
													{this.state.suggestion.map((sg, k) =>
														<li key={k}><a data-sg={encodeURIComponent(sg)} onClick={this.resetForm} title={sg}>{sg}</a></li>
													)}
												</ul>
											</div>
										</div>
									</div>
								</div>
							}
						</div>
					}
				</div>
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => {
	return {
		stateStatus: state.status
	}
}

const mapDispatchToProps = dispatch => {
	let _action = new Action();

	return {
		setStatus: (type, val) => { dispatch(_action.setStatus(type, val)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
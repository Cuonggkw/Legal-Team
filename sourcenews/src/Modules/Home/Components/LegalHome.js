"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';
import Action from '@libs/Action';

/* Package Application */
import {fetchApi, changeToSlug} from '@helpers/Common';

/* Package style */
class LegalHome extends React.Component{

	constructor(props) {
		super(props);
		this._isMounted = false;

		this.state = {
			dataPage: [],
			dataOverviews: [],
			dataService: [],
			activeShadows: {}, // Quản lý trạng thái shadow của các dịch vụ
			activeIndex: 0, // Vị trí hiện tại
			isSort: "asc",
			isSorting: (props.sort) ? props.sort : 'created_at',
		}
	}

	async componentDidMount() {
		this._isMounted = true;
		this.getData();
		this.getOverviews();
		this.getService();	
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps, prevState) {
		if(this.state.dataPage.length==0){
			this.getData();
			this.getOverviews();
			this.getService();
		}
	}

  handleToggleShadow = (id) => {
    this.setState({
      activeShadows: { [id]: !this.state.activeShadows[id] }, // Đổi trạng thái shadow
    });
  };

	handleClick = (index) => {
    this.setState({ activeIndex: index }); // Cập nhật vị trí
  };


	getData = () =>{
		try{
			this._isMounted && fetchApi(process.env.API_URL + `/get-categories?sort=${this.state.isSorting}`).then(result=>this._isMounted&&this.setState({
				dataPage: result.data.data,
			})).catch(e=>console.log(e));
		} catch (e) {
			console.log(e);
		  }
	}

	getOverviews = () =>{
		try{
			this._isMounted && fetchApi(process.env.API_URL + `/all-overviews?sort=${this.state.isSorting}`).then(result=>this._isMounted&&this.setState({
				dataOverviews: result.data.data,
			})).catch(e=>console.log(e));
		} catch (e) {
			console.log(e);
		  }
	}

	getService = () =>{
		try{
			this._isMounted && fetchApi(process.env.API_URL + `/get-services?sort=${this.state.isSorting}`).then(result=>this._isMounted&&this.setState({
				dataService: result.data.data,
			})).catch(e=>console.log(e));
		} catch (e) {
			console.log(e);
		  }
	}

	render() {
		let _data = typeof(this.state.dataPage[0]) !== 'undefined' ? this.state.dataPage[0] :[];
		const { dataOverviews, dataPage, dataService, activeShadows } = this.state;
		return (
			<React.Fragment>
				<>
				<div id="nl-main">
					<section className="sl-section">
						<div className="legal-section">
							<div className="sl-section_header">Legal In-House</div>
            	<div className="sl-section_left">
              <img className="legal-img" alt="Legal-team" src="/images/legal-1.png"/>
              <div className="legal_left">
								{dataPage && dataPage.length > 0 &&
            			<div className="legal_left-title">{dataPage[5].name}</div>
								}
								<div className="legal_left-content">
									{dataOverviews && dataOverviews.length > 0 &&
									dataOverviews.slice(3, 6).map((item) => (
										<div key={item.id} className="outs_travel">
											<div className="legal_left-icon"><i class="fas fa-check"></i></div>
											<div className="outs_content">{item.header}</div>
										</div>
									))}
								</div>
							</div>
            	</div>
							<div className="sl-section_right">
              <div className="legal_left">
								{dataPage && dataPage.length > 0 &&
            			<div className="legal_left-title">{dataPage[6].name}</div>
								}
								<div className="legal_left-content">
									{dataOverviews && dataOverviews.length > 0 &&
									dataOverviews.slice(6, 10).map((item) => (
										<div key={item.id} className="outs_travel">
											<div className="legal_left-icon"><i class="fas fa-check"></i></div>
											<div className="outs_content">{item.header}</div>
										</div>
									))}
								</div>
							</div>
							<img className="legal-img" alt="Legal-team" src="/images/legal-2.png"/>
							</div>
						</div>
						<div className="tax-section">
							<div className="sl-section_tax">
								<div className="section-tax_header">Tax In-House</div>
								<div className="section-tax_center">
              		<img className="tax-img" alt="Legal-team" src="/images/tax-1.png"/>
              		<div className="tax-center">
										{dataPage && dataPage.length > 0 &&
            					<div className="tax-center_title">{dataPage[7].name}</div>
										}
										<div className="tax-center_content">
											{dataOverviews && dataOverviews.length > 0 && dataOverviews.slice(3, 6).map((item) => (
												<div key={item.id} className="tax-center_travel">
													<div className="tax-center_icon"><i class="fas fa-check"></i></div>
													<div className="outs_content">{item.header}</div>
												</div>
											))}
										</div>
									</div>
            		</div>
								<div className="ser_title">Tax In-House cung cấp các dịch vụ</div>
							</div>
							
							<div className="sl-section_services">
								{dataService && dataService.length > 0 &&
								dataService.map((item) => (
									<div key={item.id} className={`services_all ${activeShadows[item.id] ? "active" : ""}`}
										onClick={() => this.handleToggleShadow(item.id)}>
										<img className="service_img"
            					src={item.image != null ? `${process.env.CDN_URL_S3}/${item.image}` : ``}
          					/>
										<div className="service_header">{item.header}</div>
										<div className="service_content" dangerouslySetInnerHTML={{__html: item.content}}></div>
									</div>
								))}
								
								<div className="page-fluid">
									{[0, 1, 2, 3].map((index) => (
										<div
										key={index}
										onClick={() => this.handleClick(index)}
										className={`${this.state.activeIndex === index ? 'page-1' : 'page-2'}`}></div>
									))}
								</div>
							</div>
						</div>
					</section>
				</div>
				</>
			</React.Fragment>
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
		setValueStatus:(type,val)=>{dispatch(_action.setValueStatus(type,val))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(LegalHome);
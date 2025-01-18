"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';


/* Application */
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Button from '@mui/material/Button';
import { fetchApi, changeToSlug } from '@helpers/Common';

/* Package style */
//import 'swiper/swiper-bundle.min.css';
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
import {isIOS} from 'react-device-detect';
import Countdown from 'react-countdown';
class Banner extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			banners: [],
			hideDescription: false,
			activeIndex: 0, // Vị trí hiện tại
		}
	}

	handleClick = (index) => {
    this.setState({ activeIndex: index }); // Cập nhật vị trí
  };

	getHomeBanner=()=>{
		let _result = [];
		_result.push({
			'type': 'cover',
			'id': '',
			'title': "Chúng tôi thấu hiểu rằng:",
			'thumbnail': '/images/banner-home.png',
			'link': '',
		});
		return _result;
	}

	componentDidMount() {
		this._isMounted = true;
		Promise.all([this.getHomeBanner()]).then(resp=>{
			let _banners = resp[0].concat((typeof resp[1]!=='undefined')?resp[1]:[]);
			this.setState({banners:_banners});
		}).catch(e=>console.log(e));
	}
	
	hanldeDownload=()=>{
		let _linkDL = (isIOS == true)? '' : '';
		window.location = _linkDL;
	}

	handleLink = e => {
		console.log("handleLink", e);
		let _link = e.currentTarget.dataset.link;
		if(_link&&_link!='null') window.location = _link;
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	render(){
		const { activeIndex } = this.state;
		return(
			<React.Fragment>
				{(this.state.banners&&this.state.banners.length>0) && <>
					<section className={"nl-banner"+((this.state.banners.length==1)?' only':'')}>
						<div className="nl-banner__inner">
							<Swiper
								spaceBetween={0}
								slidesPerView={1}
								speed={700}
								navigation
								pagination={{ clickable: true }}
							>
								{this.state.banners.map((banner,k) =>
									<>
										<div className="nl-banner__image">
												<img className="img-fluid" alt={banner.title} src={banner.thumbnail} />
												<div className="content-fluid">
													<div className="des-fluid">{banner.title}</div>
													<p className="title-fluid">Tìm một đơn vị cung cấp dịch vụ chất lượng với chi phí hợp lý là mong muốn chính đáng của mọi khách hàng</p>
													<button className="btn-fluid">
														<p>Các dịch vụ</p>
													</button>
												</div>
												<div className="page-fluid">
													{[0, 1, 2, 3].map((index) => (
														<div
														key={index}
														onClick={() => this.handleClick(index)}
														className={`${activeIndex === index ? 'page-1' : 'page-2'}`}></div>
													))}
												</div>
										</div>
										{/* <div className="shadow">
											<div className="shadow-1"></div>
											<div className="shadow-2"></div>
										</div> */}
									</>
								)}
							</Swiper>
						</div>
					</section>
				</>}
			</React.Fragment>
		)
	}
}

export default Banner;
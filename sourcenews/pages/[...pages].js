"use strict";

/* Package System */
import React from "react";
import DynamicImport from 'next/dynamic';

/* Package Application */
import {parseCookie} from '@helpers/Common';
const NestedLayout = DynamicImport(()=>import(/*webpackChunkName:"user.layout"*/'@modules/User/Components/NestedLayout'));
const NestedBanner = DynamicImport(()=>import(/*webpackChunkName:"banner.layout"*/'@views/Default/Components/NestedBanner'));

export async function getServerSideProps(ctx) {
	let _params = {};
	let _route = (typeof ctx.params.pages[0] !== 'undefined') ? ctx.params.pages[0] : '';
	let _slug = (typeof ctx.params.pages[1] !== 'undefined') ? ctx.params.pages[1] : '';
	let _id = (typeof ctx.params.pages[2] !== 'undefined') ? ctx.params.pages[2] : '';
	if(typeof ctx.req.headers!=='undefined'&&ctx.req.headers.cookie){
		let _cookie = parseCookie(ctx.req.headers.cookie);
		if(!_cookie['refreshToken']&&!_cookie['accessToken']){
			switch(_route){
				case 'tai-khoan-bao-mat':
				case 'lich-su-xem':
				case 'video-da-luu':
				case 'dich-vu-da-mua':
					return{
						redirect:{
							destination: '/',
							permanent: false,
						}
					}
					break;
			}
		}
	}

	_params = {
		route: _route,
		slug: _slug,
		id: _id,
	}
	return { props: { ..._params } }
}

export default class extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		//let PageComponent;
		let PageComponent = null;
		let { route, slug, id } = this.props;
		switch (route){
			case 'homepage':
				PageComponent = DynamicImport(() => import(/*webpackChunkName:"homepage"*/'@modules/Home/Index'));
				PageComponent.getLayout = NestedBanner;
				break;
			case 'news':
				PageComponent = DynamicImport(() => import(/*webpackChunkName:"homepage"*/'@modules/News/Index'));
				// PageComponent.getLayout = NestedBanner;
				break;
			case 'privacy':
				PageComponent = DynamicImport(() => import(/*webpackChunkName:"privacy"*/'@modules/Home/Privacy'));
				break;
			case 'terms':
				PageComponent = DynamicImport(() => import(/*webpackChunkName:"terms"*/'@modules/Home/Terms'));
				break;
			case 'tai-khoan-bao-mat':
				PageComponent = DynamicImport(() => import(/*webpackChunkName:"user.profile"*/'@modules/User/Profile'));
				PageComponent.getLayout = NestedLayout;
				break;
			default:
				PageComponent = DynamicImport(() => import(/*webpackChunkName:"error"*/'@modules/Home/Error'));
				break;
		}

		if(route && slug){
			switch (route){
				case 'news':
					PageComponent = DynamicImport(() => import(/*webpackChunkName:"homepage"*/'@modules/News/Detail'));
					break;
				default:
					PageComponent = DynamicImport(() => import(/*webpackChunkName:"error"*/'@modules/Home/Error'));
					break;
			}
		}

		const Nested = PageComponent?.getLayout??null;

		return(
			Nested
			?<Nested><PageComponent {...this.props} /></Nested>
			:<PageComponent {...this.props} />
		)
	}
}
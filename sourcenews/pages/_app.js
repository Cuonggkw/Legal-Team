"use strict";

/* Package System */
import App from 'next/app';
import {Provider} from 'react-redux';
import DynamicImport from 'next/dynamic';

/* Package Application */
import {initStore,initReducer} from '@libs/Redux';
import {fetchApi,getThumb,detectMobile,parseCookie} from '@helpers/Common';
const Layout = DynamicImport(()=>import(/*webpackChunkName:"layout"*/'@views/Default/Layout'));
const {parse} = require('url');

/* Package style */
import '@public/scss/home/vendor.scss';
import '@public/scss/home/style.global.scss';
import '@public/css/fontawesome.min.css';
import '@public/css/animate.min.css';

const getOrInitializeStore=initialState=>{
	let reduxStore;

	if(typeof window==="undefined"){
		return initStore(initialState);
	}
	if(!reduxStore){
		reduxStore = initStore(initialState);
	}

	return reduxStore;
}

export default class extends App{

	constructor(props){
		super(props);
		this.reduxStore = getOrInitializeStore(props.initialReduxState);
		this.reduxStore.asyncReducers = {};
		//this.reduxStore.subscribe(()=>console.log('Subscribe:',this.reduxStore.getState()));
	}

	static async getInitialProps(appContext){
		let _data = {};
		let _openApp = '';
		let _query = appContext.router.query;
		let _route = (_query.pages&&typeof _query.pages[0]!=='undefined')?_query.pages[0]:'';
		let _slug = (_query.pages&&typeof _query.pages[1]!=='undefined')?_query.pages[1]:'';
		let _id = (_query.pages&&typeof _query.pages[2]!=='undefined')?_query.pages[2]:'';
		let _auth = {};
		//Check Open App
		let _headers = appContext.ctx.req.headers;
		let _detect = detectMobile(_headers['user-agent']);
		if(_detect.referer!='') _headers.referer=_detect.referer;

		if(_headers.referer&&_detect.isMobile==true){
			let _url = '';
			let _parse = parse(_headers.referer);

			if(process.env.BASE_URL.includes(_parse.hostname)==false){
				_openApp = _url;
			}
		}
		if(_headers?.cookie){
			let _cookie = parseCookie(_headers.cookie);
			if (_cookie['refreshToken']) _auth.refreshToken = _cookie['refreshToken'];
			if (_cookie['accessToken']) _auth.accessToken = _cookie['accessToken'];
			if (_cookie['username']) _auth.username = _cookie['username'];
		}

		//Fetch Data
		return {data:_data,openApp:_openApp,auth:_auth};
	}

	render(){
		const {Component,pageProps,data,openApp,auth} = this.props;

		return(
			<Provider store={this.reduxStore}>
				<Layout data={data} openApp={openApp} auth={auth}>
					<Component store={this.reduxStore} data={data} {...pageProps} />
				</Layout>
			</Provider>
		)
	}
}
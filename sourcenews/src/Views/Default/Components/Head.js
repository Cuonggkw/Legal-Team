"use strict";

/* Package System */
import React from "react";
import Head from 'next/head';

export default class extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		let _title = (Object.keys(this.props.data).length>0)?this.props.data.title:'';
		let _description = (Object.keys(this.props.data).length>0&&this.props.data.description)?this.props.data.description.replace(/<[^>]*>?/gm, ''):'';
		let _url = this.props.router.asPath=='/'?'':this.props.router.asPath;
		let _image = (Object.keys(this.props.data).length>0) ? ( this.props.data.image != null ? process.env.CDN_URL_S3 + this.props.data.image : process.env.MCV_IMAGE_URL+this.props.data.wp_images+'&w=828&q=100`') : process.env.BASE_URL+"/images/banner.png";
		if(_description=='') _description = 'MCV Group.';
		if(this.props.data.thumbShare) _image = this.props.data.thumbShare;
		if(this.props.data.thumbnail) _image = this.props.data.thumbnail;

		return(
			<>
				<Head>
					<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
					<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no" />
					<meta name="format-detection" content="telephone=no" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta property="fb:app_id" content={process.env.FB_APP_ID} />
					<meta property="og:type" content="website" />
					<meta property="og:url" content={process.env.BASE_URL+_url} />
					<meta property="og:title" content={(_title!=''&&_title!==undefined)?_title+' | MCV':'MCV'} />
					<meta property="og:description" content={_description} />
					<meta property="og:image" content={_image} />
					<meta property="og:image:alt" content={(_title!=''&&_title!==undefined)?_title+' | MCV':'MCV'} />
					<meta name="keywords" content="MCV,MCV Group,MCV Network" />
					<meta name="description" content={_description} />
					<title>{(_title!=''&&_title!==undefined)?_title+' | MCV':'MCV Network'}</title>
				</Head>
			</>
		)
	}
}
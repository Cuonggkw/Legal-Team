"use strict";

/* Package System */
import React from "react";

class GoogleAd extends React.Component{
	googleInit = null;

	constructor(props){
		super(props);
		this._isMounted = false;
		this.optional = {};
		if(props?.format!='') this.optional['data-ad-format'] = props.format;
		if(props?.responsive!='') this.optional['data-full-width-responsive'] = props.responsive;
		this.handleLoadScript();
	}

	handleLoadScript=()=>{
		(function(d,s,id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.async=true;
			js.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+process.env.GG_ADS_ID;
			fjs.parentNode.insertBefore(js, fjs);
        }(document,'script','google-ads'));
	}

	componentDidMount() {
		this._isMounted = true;
		this.googleInit = setTimeout(()=>{
			if (window) (adsbygoogle = window.adsbygoogle || []).push({});
		},700);
	}

	componentWillUnmount(){
		this._isMounted = false;
		if(this.googleInit) clearTimeout(this.googleInit);
	}

	render(){

		return (
			<ins className="adsbygoogle" style={this.props.style} data-ad-client={process.env.GG_ADS_ID} data-ad-slot={this.props.slot} {...this.optional} />
		);
	}
}

export default GoogleAd;
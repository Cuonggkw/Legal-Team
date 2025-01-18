"use strict";

/* Package System */
import Document,{Html,Head,Main,NextScript} from 'next/document';

export default class extends Document{

	static async getInitialProps(ctx){
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render(){
		return (
			<Html>
				<Head>
					{(typeof(process.env.GG_GTAG_ID)!=='undefined'&&process.env.GG_GTAG_ID!='')&&
					<script
						dangerouslySetInnerHTML={{
							__html:`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.GG_GTAG_ID}')`
						}}
					/>
					}
					{(typeof(process.env.GG_ADS_ID)!=='undefined'&&process.env.GG_ADS_ID!='')&&
					<script async src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+process.env.GG_ADS_ID} crossOrigin="anonymous"></script>
					}
					<script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" />
					<script src={`https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`}></script>
				</Head>
				<body>
					{(typeof(process.env.GG_GTAG_ID)!=='undefined'&&process.env.GG_GTAG_ID!='')&&
					<noscript
						dangerouslySetInnerHTML={{
							__html:`<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.GG_GTAG_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
						}}
					/>
					}
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
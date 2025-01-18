"use strict";

/* Package System */
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const path = require('path');
require('dotenv').config({path:path.join(__dirname,'.env'+((process.env.NODE_ENV==='production'||process.env.NODE_ENV==='staging')?'.'+process.env.NODE_ENV:'.development'))});
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

/* Package Application */
const app = express();
const {parse} = require('url');
const next = require('next');
const nextApp = next({dev:!(process.env.NODE_ENV==='production'||process.env.NODE_ENV==='staging')});
const handle = nextApp.getRequestHandler();
const {getInfo,sendApiTicket,paymentMoMo,paymentPayPal,verifyMoMo,verifyPayPal} = require('./payment');

try{
	let server;

	nextApp.prepare().then(()=>{
		app.disable('x-powered-by');
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({extended:true}));
		app.get('/payment',async(req,res)=>{
			res.send('Hi');
		});
		app.post('/payment',async(req,res)=>{
			let {id,type,platform,userName,token} = req.body;
			let _result = null;
			res.json(_result);
		});
		app.post('/payment/ipn',async(req,res)=>{
			let _result = await verifyMoMo(req.body);
			res.json(_result);
		});
		app.put('/cookie',(req,res)=>{
			if(req.body.accessToken!=''&&req.body.username!=''&&req.body.refreshToken){
				const cookies = [];
				const options = `;path=/;httpOnly=true;sameSite=Strict;secure=${(process.env.NODE_ENV==='production'||process.env.NODE_ENV==='staging')?'true':'false'};`
				if(req.body.username)
					cookies.push('username='+req.body.username+options+`Max-Age=${req.body.maxage ?? 7*24*60*60}`);
				if(req.body.refreshToken)
					cookies.push('refreshToken='+req.body.refreshToken+options+`Max-Age=${req.body.maxage ?? 7*24*60*60}`);
				if (req.body.accessToken)
					cookies.push('accessToken=' + req.body.accessToken + options + `Max-Age=${req.body.maxageToken ?? req.body.maxage ?? 7 * 24 * 60 * 60}`);
				return res.setHeader('Set-Cookie',cookies).status(200).end();
			}else res.status(200).end();
		});
		app.delete('/cookie',(req,res)=>{
			return res.clearCookie("username",{path:'/'}).clearCookie("refreshToken",{path:'/'}).clearCookie("accessToken",{path:'/'}).status(200).end();
		});
		app.get('*',(req,res)=>{
			return handle(req,res,parse(req.url,true))
		});

		if(process.env.NODE_ENV=='production'||process.env.NODE_ENV=='staging'){
			let _prefix = process.env.NODE_ENV=='staging'?'staging.':'';
			server = require('http2').createSecureServer({
				key:fs.readFileSync('/etc/letsencrypt/live/'+_prefix+'casting.mcv.com.vn/privkey.pem'),
				cert:fs.readFileSync('/etc/letsencrypt/live/'+_prefix+'casting.mcv.com.vn/fullchain.pem'),
				allowHTTP1:true
			},app);
		}else{
			server = require('http').createServer(app);
		}

		server.listen(process.env.PORT);
		console.log(`Site master | ${process.env.NODE_ENV} - ${process.pid} is running on port ${process.env.PORT}`);
	}).catch(ex=>{
		console.error(ex.stack);
		process.exit(1);
	});
}catch(e){console.log(e)}
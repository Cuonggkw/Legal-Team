"use strict";

/* Application */
require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const {v4:uuidv4} = require('uuid');

class Payment{

	changeToSlug=str=>{
		let _str = str.trim().toLowerCase();

		return _str
			.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi,'a')
			.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi,'e')
			.replace(/i|í|ì|ỉ|ĩ|ị/gi,'i')
			.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi,'o')
			.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi,'u')
			.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi,'y')
			.replace(/đ/gi,'d')
			.replace(/&/g,'-va-')
			.replace(/[^a-z0-9 -]/g,'')
			.replace(/\s+/g,'-')
			.replace(/-+/g,'-')
			.replace(/[^\w\-]+/g,'')
			.replace(/^-+/,'')
			.replace(/-+$/,'')
			.replace(/^-+/,'')
			.replace(/-+$/,'')
	}

	getInfo=async(id='')=>{
		let _info = null;
		return _info;
	}

	sendApiTicket=async info=>{
		let _result = {}
		return _result;
	}

	verifyMoMo=async params=>{
		let _result = {}
		return _result;
	}

	paymentMoMo=async (info={})=>{
		let result = {};
		return result;
	}

	getAccessToken=async()=>{
		let _token = '';
		return _token;
	}

	paymentPayPal=async(info={})=>{
		let result = {};
		return result;
	}

	verifyPayPal=async({token,PayerID,extraData})=>{
		let _result = {
			status:false,
			link:'',
			errors:{}
		}
		return _result;
	}
}

module.exports = new Payment;
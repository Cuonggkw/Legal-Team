"use strict";

/* Application */
import axios from 'axios';
import Cookies from 'js-cookie';
const apiUrl = process.env.API_URL;
import {phone} from 'phone';
import dayjs from 'dayjs';
class Common{

	fetchApi=async(url,token='')=>{
		let _url;
		let _options = {
			headers:{
				'x-app-id': process.env.X_APP_ID
			}
		};
		if(url.indexOf("http")!=="-1") _url=url;
		else _url = apiUrl + url;
		if(token!='') _options.headers = {..._options.headers, Authorization: `Bearer ${token}`};
		return await axios.get(_url, _options);
	}

	postApi=async(url,params,token='',contentType='application/json;charset=UTF-8')=>{
		let _url;
		let _options = {
			headers:{
				'x-app-id': process.env.X_APP_ID
			}
		};
		if(url.indexOf("http")!="-1") _url=url;
		else _url=apiUrl+url;
		if(token!='') _options.headers = {..._options.headers,'Content-Type':contentType,"Authorization":`Bearer ${token}`};
		return await axios.post(_url,params,_options);
	}

	putApi=async(url,params,token='',_options={})=>{
		_options.headers = {
			'x-app-id': process.env.X_APP_ID
		}
		let _url;
		if(url.indexOf("http")!="-1") _url=url;
		else _url=apiUrl+url;
		if(token!='') _options.headers = {..._options.headers ,"Authorization":`Bearer ${token}`};
		return await axios.put(_url,params,_options);
	}

	deleteApi=async(url,token='',params='')=>{
		let _url;
		let _options = {
			'x-app-id': process.env.X_APP_ID
		};
		if(url.indexOf("http")!="-1") _url=url;
		else _url=apiUrl+url;
		if(token!='') _options.headers = {..._options.headers,"Authorization":`Bearer ${token}`};
		if(params!='') _options.data = {ids:params};
		return await axios.delete(_url,_options);
	}

	parseCookie=str=>{
		return str.split(';').map(v=>v.split('=')).reduce((cookie,v)=>{
			cookie[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
			return cookie;
		},{});
	}

	dateFormat=str=>{
		let _date = new Date(str);
		return  _date.getDate()+'/'+(_date.getMonth() + 1)+'/'+_date.getFullYear();
	}

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

	capitalize=str=>{
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	validationForm=(obj,page,type)=>{
		let _result = {
			formIsValid:true,
			errors:{},
			msg:''
		};
		let _page = {
			signInOTP:['phone'],
			signIn:['phone','password'],/*['phone','email','password'] */
			signUp:['phone','email','password','rePassword'],
			forgot:['phone','email'],
			otp:['otp'],
			changePass:['password','rePassword'],
			profile:['email','full_name','phone','gender','dob','country'],
			changeProfilePass:['currentPassword','password','rePassword'],
			//applyCasting:['firstName','lastName','dateOfBirth','gender','email','phone','address','videoFileInfo'],
			applyCasting:['firstName','lastName','dateOfBirth','gender','email','phone','address'],
			updateProfilePass:['password','rePassword'],
		}

		let _pageTitle = {
			profile:{
				'dob':'Ngày sinh',
				'full_name':'Họ và tên',
				'phone':'Số điện thoại',
				'email':'Email',
				'user_image':'Ảnh đại điện',
				'gender':'Giới tính',
				'country':'Quốc gia',
			},
			applyCasting:{
				'firstName':'Họ',
				'lastName':'Tên',
				'dateOfBirth':'Ngày sinh',
				'gender':'Giới tính',
				'email':'Email',
				'phone':'Số điện thoại',
				'address':'Địa chỉ',
				//'videoFileInfo': 'Video',
			},
			signInOTP:{
				'phone':'Số điện thoại'
			},
			signIn:{
				'phone':'Số điện thoại',
				'password':'Mật khẩu',
				'email':'Email'
			},
			signUp:{
				'phone':'Số điện thoại',
				'password':'Mật khẩu',
				'email':'Email'
			},
			changePass:{
				'password':'Mật khẩu',
				'rePassword':'Nhập lại mật khẩu',
			},
			changeProfilePass:{
				'password':'Mật khẩu',
				'rePassword':'Nhập lại mật khẩu',
				'currentPassword':'Mật khẩu hiện tại',
			},
			updateProfilePass:{
				'password':'Mật khẩu',
				'rePassword':'Nhập lại mật khẩu',
			}
		}

		_page[page].map(k=>{
			if(type&&type=='phone'&&k=='email') k='phone';
			if(type&&type=='email'&&k=='phone') k='email';
			if(k=='dob'){
				if(!dayjs(obj[k], 'DD/MM/YYYY').isValid()){
					_result.formIsValid=false;
					_result.errors[k]='Năm sinh không được bỏ trống';
					_result.msg+="Năm sinh không được bỏ trống<br/>"
				}
			}

			if(k=='videoFileInfo'){
				if(typeof(obj[k])=='undefined'){
					_result.formIsValid=false;
					_result.errors[k]=(typeof(_pageTitle[page]) !== 'undefined' &&  typeof(_pageTitle[page][k]) !== 'undefined' ? _pageTitle[page][k] : k)+' không được bỏ trống';
					_result.msg+="Vui lòng upload video<br/>";
				}else{
					if((obj[k].size/1000)>=100000&&obj[k].type.indexOf('video/mp4')>=0){
						_result.formIsValid=false;
						_result.errors[k]='Video phải < 100Mb';
						_result.msg+="Video phải < 100Mb<br/>";
					}
				}
			}else{
				if(!obj||!obj[k]||obj[k].trim()==''){
					_result.formIsValid=false;
					_result.errors[k]=(typeof(_pageTitle[page]) !== 'undefined' &&  typeof(_pageTitle[page][k]) !== 'undefined' ? _pageTitle[page][k] : k)+' không được bỏ trống';
					_result.msg+=(typeof(_pageTitle[page]) !== 'undefined' &&  typeof(_pageTitle[page][k]) !== 'undefined' ? _pageTitle[page][k] : k)+" không được bỏ trống<br/>";
				}
			}
			if(k=='email'&&obj&&obj[k]&&obj[k]!=''){
				let _regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
				if(!_regex.test(obj[k])){
					_result.formIsValid=false;
					_result.errors[k]='Email không đúng định dạng';
					_result.msg+="Email không đúng định dạng<br/>"
				}
			}

			if(k=='phone'&&obj&&obj[k]&&obj[k]!=''){
				if(obj[k].indexOf('+') != -1) {
					let validate = phone(obj[k], {country: '',validateMobilePrefix: true})
					if(validate.isValid == false){
						_result.formIsValid=false;
						_result.errors[k]='Số điện thoại không đúng định dạng';
						_result.msg+="Số điện thoại không đúng định dạng<br/>"
					}
				} else if (obj.phoneCode){
					let validate = phone(phone(obj.phoneCode+obj[k]).phoneNumber, {country: '',validateMobilePrefix: true})
					if(validate.isValid == false){
						_result.formIsValid=false;
						_result.errors[k]='Số điện thoại không đúng định dạng';
						_result.msg+="Số điện thoại không đúng định dạng<br/>"
					}
				} else {
					_result.formIsValid=false;
					_result.errors[k]='Số điện thoại cần bắt đầu bằng mã vùng (Ví dụ: +84*********)';
					_result.msg+="Số điện thoại cần bắt đầu bằng mã vùng (Ví dụ: +84*********)<br/>"
				}
			}
			if((page=='signUp'||page=='changePass'||page=='profile'||page=='changeProfilePass'||page=='updateProfilePass')&&k=='password'&&obj&&obj[k]&&obj[k]!=''){
				let _regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
				if(!_regex.test(obj[k])){
					_result.formIsValid=false;
					_result.errors[k]="Mật khẩu không đủ mạnh";
					_result.msg+="Mật khẩu có ít nhất 8 ký tự: 1 chữ hoa, 1 số và 1 ký tự đặc biệt<br/>";
				}
			}
			if((page=='signUp'||page=='changePass'||page=='changeProfilePass'||page=='updateProfilePass')&&k=='rePassword'&&obj&&obj['password']&&obj['rePassword']&&obj['password']!=obj['rePassword']){
				_result.formIsValid=false;
				_result.errors['rePassword']='Không trùng với mật khẩu';
				_result.msg+="Không trùng với mật khẩu<br/>";
			}
			if(k=='otp'&&obj&&obj[k]&&obj[k]!=''){
				let _regex = /^[0-9]{6}$/
				if(!_regex.test(obj[k])){
					_result.formIsValid=false;
					_result.msg+="Mã xác nhận không hợp lệ<br/>";
				}
			}
		})
		return _result;
	}

	getThumb=async(videoId)=>{
		let _img = await axios.get('https://api.dailymotion.com/video/'+videoId+'?fields=thumbnail_720_url').then(resp=>resp.data.thumbnail_720_url).catch(e=>'');
		return _img;
	}

	detectMobile=(userAgent)=>{
		let _result = {
			isMobile:false,
			referer:'',
			device:''
		};
		_result.isMobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
		if(Boolean(userAgent.match(/iPhone|iPad|iPod/i))==true){
			_result.device='iOS';
		}else{
			_result.device='android';
		}
		if(Boolean(userAgent.match(/zalo/i))==true) _result.referer = 'https://chat.zalo.me';
		if(Boolean(userAgent.match(/fban|fbdv/i))==true) _result.referer = 'https://www.messenger.com';

		return _result;
	}

	urlCDN=(url)=>{
		let _url = (url != '' && url != undefined) ? (url.includes('http://')==true || url.includes('https://')==true ? url : process.env.CDN_URL+'/'+url) : '';
		return _url;
	}

	urlCDNS3=(url)=>{
		let _url = (url != '' && url != undefined) ? (url.includes('http://')==true || url.includes('https://')==true ? url : process.env.CDN_URL_S3+'/'+url) : '';
		return _url;
	}

	formatNum=num=>{
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
	}
	isPhoneNumber = val =>{
		const regex = /\d+$/;
		if (!regex.test(val)) {
			return false
		}
		return true;
	}
	base64Encode=str=>{
		return Buffer.from(str).toString('base64');
	}
	base64Decode=str=>{
		return Buffer.from(str,'base64').toString();
	}
	getMsg=arr=>{
		let _msg = '';
		if(arr?.data && arr?.data?.errors && typeof arr.data.errors.msg!== 'undefined' && typeof arr.data.errors.msg.response!== 'undefined'){
			_msg = arr.data.errors.msg.response;
		}
		else if(typeof arr?.data === "string"){
			_msg = arr.data;
		}
		else if(arr?.data && arr?.data?.errors && typeof arr.data.errors.msg!== 'undefined'){
			_msg = arr.data.errors.msg;
		}else if(arr?.data && arr?.data?.errors && typeof arr.data.errors[0]!=='undefined' && typeof arr.data.errors[0].msg!== 'undefined'){
			_msg = arr.data.errors[0].msg;
		}
		return _msg;
	}
	countryList = [
		{ phone: "+84", code: "vn", name: "Việt Nam" },
		{ phone: "+1", code: "us", name: "United States" },
		{ phone: "+44", code: "gb", name: "United Kingdom" },
		{ phone: "+93", code: "af", name: "Afghanistan" },
		{ phone: "+355", code: "al", name: "Albania" },
		{ phone: "+213", code: "dz", name: "Algeria" },
		{ phone: "+1684", code: "as", name: "American Samoa" },
		{ phone: "+376", code: "ad", name: "Andorra" },
		{ phone: "+244", code: "ao", name: "Angola" },
		{ phone: "+1264", code: "ai", name: "Anguilla" },
		{ phone: "+1268", code: "ag", name: "Antigua and Barbuda" },
		{ phone: "+54", code: "ar", name: "Argentina" },
		{ phone: "+374", code: "am", name: "Armenia" },
		{ phone: "+297", code: "aw", name: "Aruba" },
		{ phone: "+61", code: "au", name: "Australia" },
		{ phone: "+43", code: "at", name: "Austria" },
		{ phone: "+994", code: "az", name: "Azerbaijan" },
		{ phone: "+1242", code: "bs", name: "Bahamas" },
		{ phone: "+973", code: "bh", name: "Bahrain" },
		{ phone: "+880", code: "bd", name: "Bangladesh" },
		{ phone: "+1246", code: "bb", name: "Barbados" },
		{ phone: "+375", code: "by", name: "Belarus" },
		{ phone: "+32", code: "be", name: "Belgium" },
		{ phone: "+501", code: "bz", name: "Belize" },
		{ phone: "+229", code: "bj", name: "Benin" },
		{ phone: "+1441", code: "bm", name: "Bermuda" },
		{ phone: "+975", code: "bt", name: "Bhutan" },
		{ phone: "+591", code: "bo", name: "Bolivia" },
		{ phone: "+387", code: "ba", name: "Bosnia and Herzegovina" },
		{ phone: "+267", code: "bw", name: "Botswana" },
		{ phone: "+55", code: "br", name: "Brazil" },
		{ phone: "+673", code: "bn", name: "Brunei Darussalam" },
		{ phone: "+359", code: "bg", name: "Bulgaria" },
		{ phone: "+226", code: "bf", name: "Burkina Faso" },
		{ phone: "+257", code: "bi", name: "Burundi" },
		{ phone: "+855", code: "kh", name: "Cambodia" },
		{ phone: "+237", code: "cm", name: "Cameroon" },
		{ phone: "+1 ", code: "ca", name: "Canada" },
		{ phone: "+238", code: "cv", name: "Cape Verde" },
		{ phone: "+1345", code: "ky", name: "Cayman Islands" },
		{ phone: "+236", code: "cf", name: "Central African Republic" },
		{ phone: "+235", code: "td", name: "Chad" },
		{ phone: "+56", code: "cl", name: "Chile" },
		{ phone: "+86", code: "cn", name: "China" },
		{ phone: "+57", code: "co", name: "Colombia" },
		{ phone: "+269", code: "km", name: "Comoros" },
		{ phone: "+243", code: "cd", name: "Congo (DRC)" },
		{ phone: "+242", code: "cg", name: "Congo (Republic)" },
		{ phone: "+682", code: "ck", name: "Cook Islands" },
		{ phone: "+506", code: "cr", name: "Costa Rica" },
		{ phone: "+225", code: "ci", name: "Côte d'Ivoire" },
		{ phone: "+385", code: "hr", name: "Croatia" },
		{ phone: "+53", code: "cu", name: "Cuba" },
		{ phone: "+357", code: "cy", name: "Cyprus" },
		{ phone: "+420", code: "cz", name: "Czech Republic" },
		{ phone: "+45", code: "dk", name: "Denmark" },
		{ phone: "+253", code: "dj", name: "Djibouti" },
		{ phone: "+1767", code: "dm", name: "Dominica" },
		{ phone: "+1809", code: "do", name: "Dominican Republic" },
		{ phone: "+593", code: "ec", name: "Ecuador" },
		{ phone: "+20", code: "eg", name: "Egypt" },
		{ phone: "+503", code: "sv", name: "El Salvador" },
		{ phone: "+240", code: "gq", name: "Equatorial Guinea" },
		{ phone: "+291", code: "er", name: "Eritrea" },
		{ phone: "+372", code: "ee", name: "NEstoniaam" },
		{ phone: "+251", code: "et", name: "Ethiopia" },
		{ phone: "+298", code: "fo", name: "Faroe Islands" },
		{ phone: "+679", code: "fj", name: "Fiji" },
		{ phone: "+358", code: "fi", name: "Finland" },
		{ phone: "+33", code: "fr", name: "France" },
		{ phone: "+689", code: "pf", name: "French Polynesia" },
		{ phone: "+241", code: "ga", name: "Gabon" },
		{ phone: "+220", code: "gm", name: "Gambia" },
		{ phone: "+995", code: "ge", name: "Georgia" },
		{ phone: "+49", code: "de", name: "Germany" },
		{ phone: "+233", code: "gh", name: "Ghana" },
		{ phone: "+350", code: "gi", name: "Gibraltar" },
		{ phone: "+30", code: "gr", name: "Greece" },
		{ phone: "+299", code: "gl", name: "Greenland" },
		{ phone: "+1473", code: "gd", name: "Grenada" },
		{ phone: "+590", code: "gp", name: "Guadeloupe" },
		{ phone: "+1671", code: "gu", name: "Guam" },
		{ phone: "+502", code: "gt", name: "Guatemala" },
		{ phone: "+44", code: "gg", name: "Guernsey" },
		{ phone: "+224", code: "gn", name: "Guinea" },
		{ phone: "+245", code: "gw", name: "Guinea-Bissau" },
		{ phone: "+592", code: "gy", name: "Guyana" },
		{ phone: "+509", code: "ht", name: "Haiti" },
		{ phone: "+504", code: "hn", name: "Honduras" },
		{ phone: "+852", code: "hk", name: "Hong Kong" },
		{ phone: "+36", code: "hu", name: "Hungary" },
		{ phone: "+354", code: "is", name: "Iceland" },
		{ phone: "+91", code: "in", name: "India" },
		{ phone: "+62", code: "id", name: "Indonesia" },
		{ phone: "+98", code: "ir", name: "Iran" },
		{ phone: "+964", code: "iq", name: "Iraq" },
		{ phone: "+353", code: "ie", name: "Ireland" },
		{ phone: "+44", code: "im", name: "Isle of Man" },
		{ phone: "+972", code: "il", name: "Israel" },
		{ phone: "+39", code: "it", name: "Italy" },
		{ phone: "+1876", code: "jm", name: "Jamaica" },
		{ phone: "+81", code: "jp", name: "Japan" },
		{ phone: "+44", code: "je", name: "Jersey" },
		{ phone: "+962", code: "jo", name: "Jordan" },
		{ phone: "+7", code: "kz", name: "Kazakhstan" },
		{ phone: "+254", code: "ke", name: "Kenya" },
		{ phone: "+686", code: "ki", name: "Kiribati" },
		{ phone: "+965", code: "kw", name: "Kuwait" },
		{ phone: "+996", code: "kg", name: "Kyrgyzstan" },
		{ phone: "+856", code: "la", name: "Laos" },
		{ phone: "+371", code: "lv", name: "Latvia" },
		{ phone: "+961", code: "lb", name: "Lebanon" },
		{ phone: "+266", code: "ls", name: "Lesotho" },
		{ phone: "+231", code: "lr", name: "Liberia" },
		{ phone: "+218", code: "ly", name: "Libya" },
		{ phone: "+423", code: "li", name: "Liechtenstein" },
		{ phone: "+370", code: "lt", name: "Lithuania" },
		{ phone: "+352", code: "lu", name: "Luxembourg" },
		{ phone: "+853", code: "mo", name: "Macao" },
		{ phone: "+389", code: "mk", name: "Macedonia" },
		{ phone: "+261", code: "mg", name: "Madagascar" },
		{ phone: "+265", code: "mw", name: "Malawi" },
		{ phone: "+60", code: "my", name: "Malaysia" },
		{ phone: "+960", code: "mv", name: "Maldives" },
		{ phone: "+223", code: "ml", name: "Mali" },
		{ phone: "+356", code: "mt", name: "Malta" },
		{ phone: "+692", code: "mh", name: "Marshall Islands" },
		{ phone: "+596", code: "mq", name: "Martinique" },
		{ phone: "+222", code: "mr", name: "Mauritania" },
		{ phone: "+230", code: "mu", name: "Mauritius" },
		{ phone: "+52", code: "mx", name: "Mexico" },
		{ phone: "+691", code: "fm", name: "Micronesia" },
		{ phone: "+373", code: "md", name: "Moldova" },
		{ phone: "+377", code: "mc", name: "Monaco" },
		{ phone: "+976", code: "mn", name: "Mongolia" },
		{ phone: "+382", code: "me", name: "Montenegro" },
		{ phone: "+1664", code: "ms", name: "Montserrat" },
		{ phone: "+212", code: "ma", name: "Morocco" },
		{ phone: "+258", code: "mz", name: "Mozambique" },
		{ phone: "+95", code: "mm", name: ">Myanmar (Burma)" },
		{ phone: "+264", code: "na", name: "Namibia" },
		{ phone: "+674", code: "nr", name: "Nauru" },
		{ phone: "+977", code: "np", name: "Nepal" },
		{ phone: "+31", code: "nl", name: "Netherlands" },
		{ phone: "+687", code: "nc", name: "New Caledonia" },
		{ phone: "+64", code: "nz", name: "New Zealand" },
		{ phone: "+505", code: "ni", name: "Nicaragua" },
		{ phone: "+227", code: "ne", name: "Niger" },
		{ phone: "+234", code: "ng", name: "Nigeria" },
		{ phone: "+850", code: "kp", name: "North Korea" },
		{ phone: "+47", code: "no", name: "Norway" },
		{ phone: "+968", code: "om", name: "Oman" },
		{ phone: "+92", code: "pk", name: "Pakistan" },
		{ phone: "+680", code: "pw", name: "Palau" },
		{ phone: "+970", code: "ps", name: "Palestinian Territory" },
		{ phone: "+507", code: "pa", name: "Panama" },
		{ phone: "+675", code: "pg", name: "Papua New Guinea" },
		{ phone: "+595", code: "py", name: "Paraguay" },
		{ phone: "+51", code: "pe", name: "Peru" },
		{ phone: "+63", code: "ph", name: "Philippines" },
		{ phone: "+48", code: "pl", name: "Poland" },
		{ phone: "+351", code: "pt", name: "Portugal" },
		{ phone: "+1787", code: "pr", name: "Puerto Rico" },
		{ phone: "+974", code: "qa", name: "Qatar" },
		{ phone: "+262", code: "re", name: "Réunion" },
		{ phone: "+40", code: "ro", name: "Romania" },
		{ phone: "+7", code: "ru", name: "Russian Federation" },
		{ phone: "+250", code: "rw", name: "Rwanda" },
		{ phone: "+1869", code: "kn", name: "Saint Kitts and Nevis" },
		{ phone: "+1758", code: "lc", name: "Saint Lucia" },
		{ phone: "+1784", code: "vc", name: "Saint Vincent and the Grenadines" },
		{ phone: "+685", code: "ws", name: "Samoa" },
		{ phone: "+378", code: "sm", name: "San Marino" },
		{ phone: "+239", code: "st", name: "São Tomé and Príncipe" },
		{ phone: "+966", code: "sa", name: "Saudi Arabia" },
		{ phone: "+221", code: "sn", name: "Senegal" },
		{ phone: "+381", code: "rs", name: "Serbia" },
		{ phone: "+248", code: "sc", name: "Seychelles" },
		{ phone: "+232", code: "sl", name: "Sierra Leone" },
		{ phone: "+65", code: "sg", name: "Singapore" },
		{ phone: "+421", code: "sk", name: "Slovakia" },
		{ phone: "+386", code: "si", name: "Slovenia" },
		{ phone: "+677", code: "sb", name: "Solomon Islands" },
		{ phone: "+252", code: "so", name: "Somalia" },
		{ phone: "+27", code: "za", name: "South Africa" },
		{ phone: "+82", code: "kr", name: "South Korea<" },
		{ phone: "+34", code: "es", name: "Spain" },
		{ phone: "+94", code: "lk", name: "Sri Lanka" },
		{ phone: "+249", code: "sd", name: "Sudan" },
		{ phone: "+597", code: "sr", name: "Suriname" },
		{ phone: "+268", code: "sz", name: "Swaziland" },
		{ phone: "+46", code: "se", name: "Sweden" },
		{ phone: "+41", code: "ch", name: "Switzerland" },
		{ phone: "+963", code: "sy", name: "Syrian Arab Republic" },
		{ phone: "+886", code: "tw", name: "Taiwan, Province of China" },
		{ phone: "+992", code: "tj", name: "Tajikistan" },
		{ phone: "+255", code: "tz", name: "Tanzania" },
		{ phone: "+66", code: "th", name: "Thailand" },
		{ phone: "+670", code: "tl", name: "Timor-Leste" },
		{ phone: "+228", code: "tg", name: "Togo" },
		{ phone: "+676", code: "to", name: "Tonga" },
		{ phone: "+1868", code: "tt", name: "Trinidad and Tobago" },
		{ phone: "+216", code: "tn", name: "Tunisia" },
		{ phone: "+90", code: "tr", name: "Turkey" },
		{ phone: "+993", code: "tm", name: "Turkmenistan" },
		{ phone: "+1649", code: "tc", name: "Turks and Caicos Islands" },
		{ phone: "+688", code: "tv", name: "Tuvalu" },
		{ phone: "+256", code: "ug", name: "Uganda" },
		{ phone: "+380", code: "ua", name: "Ukraine" },
		{ phone: "+971", code: "ae", name: "United Arab Emirates" },
		{ phone: "+598", code: "uy", name: "Uruguay" },
		{ phone: "+998", code: "uz", name: "Uzbekistan" },
		{ phone: "+678", code: "vu", name: "Vanuatu" },
		{ phone: "+379", code: "va", name: "Vatican City" },
		{ phone: "+58", code: "ve", name: "Venezuela" },
		{ phone: "+1284", code: "vg", name: "Virgin Islands (British)" },
		{ phone: "+1340", code: "vi", name: "Virgin Islands (U.S.)" },
		{ phone: "+212", code: "eh", name: "Western Sahara" },
		{ phone: "+967", code: "ye", name: "Yemen" },
		{ phone: "+260", code: "zm", name: "Zambia" },
		{ phone: "+263", code: "zw", name: "Zimbabwe" },
	  ];
}

module.exports = new Common;
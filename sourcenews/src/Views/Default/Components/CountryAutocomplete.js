"use strict";

/* Package System */
import React from "react";


/* Application */
import Autocomplete from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';

/* Package style */
 
class CountryAutocomplete extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			country: {phone: this.props.phoneCode? this.props.phoneCode : '+84'},
			open: false,
		}
	}

	handleOnChange = async value => {
	    await this.setState({ country: value });
	    this.setState({ open: false });
		this.props.funcChange(value.phone);
	};

	handleClickAway = () => {
	   this.setState({ open: false });
	};

	handleClick = () => {
		if (!this.props.disabled) {
			this.setState({ open: !this.state.open });
		}
	};

	componentDidUpdate(prevProps,prevState){
		if(this.props.phoneCode !== prevProps.phoneCode){
			this.setState({country: {phone: this.props.phoneCode}});
		}
	}

	render(){
		const countryList = [
			{ phone: '+84', code: 'vn', name: 'Việt Nam' },
			{ phone: '+1', code: 'us', name: 'United States' },
			{ phone: '+81', code: 'jp', name: 'Japan' },
		];

		return(
			<React.Fragment>
				<ClickAwayListener onClickAway={this.handleClickAway}>
					<div className="phone-inner">
						<div className="country-root" onClick={this.handleClick} >
							<div className={"flag-icon " + countryList.find(x => x.phone === this.state.country.phone).code}></div>
							<div className="phone">{this.state.country.phone}</div>
						</div>
						{this.state.open ? (
						<div className="dropdown-country">
							<Autocomplete
								blurOnSelect
								open
								disablePortal
								noOptionsText="Không tìm thấy"
								options={countryList}
								onChange={(event,value) => this.handleOnChange(value)}
								getOptionLabel={(option) => option.name}
								isOptionEqualToValue={(option, value) => option.name === value.name}
								renderOption={(props,option) => (
									<React.Fragment >
										<div className="country-root" {...props} >
											<div className={"flag-icon " + option.code}></div>
											<div className="name">{option.name}</div>
											<div className="phone">{option.phone}</div>
										</div>
									</React.Fragment>
								)}
								renderInput={(params) => (
									<InputBase
										ref={params.InputProps.ref}
										inputProps={params.inputProps}
										autoFocus
										placeholder="Tìm tên nước"
									/>
								)}
							/>
						</div>
						) : null}
					</div>
				</ClickAwayListener>
			</React.Fragment>
		)
	}
}

export default CountryAutocomplete;
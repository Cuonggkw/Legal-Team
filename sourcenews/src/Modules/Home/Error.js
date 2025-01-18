"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';

export default class extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		return(
			
			<div className="nl-404">
				<div className="container">
					<h4><span>ERROR</span></h4>
					<h2>4<i className="fas fa-heart-broken"></i>4</h2>
					<p>Trang không tồn tại</p>

					<div className="backToHome">
						<Link href="/">
							<a title="Trang chủ">
								<Button variant="contained" className="nl-button" >
									<i className="fas fa-caret-left"></i> Quay về trang chủ
								</Button>
							</a>
						</Link>
					</div>
				</div>
			</div>
		)
	}
}
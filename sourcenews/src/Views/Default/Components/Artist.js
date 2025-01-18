"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';

class Artist extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<>
				<div className="nl-artist__card">
					<div className="img">
						<img src={this.props.image} className="img-fluid" alt={this.props.title} />
					</div>
					<h4>{this.props.title}</h4>
					<Link href={this.props.link}><a title={this.props.title}></a></Link>
				</div>
			</>
		)
	}
}

export default Artist;
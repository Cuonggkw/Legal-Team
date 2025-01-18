"use strict";

/* Package System */
import React from "react";

class Emoji extends React.Component{

	constructor(props){
		super(props);
		this.state={
			class: false,
		}
	}

	componentDidMount () {
		this.timeoutId = setTimeout(function () {
		    this.setState({class: true});
		}.bind(this), 200);
	} 

	componentWillUnmount () {
		if (this.timeoutId) {
		    clearTimeout(this.timeoutId);
		}
	}

	render(){
		return(
			<>
				<div className={"emoji-randowm "+ ((this.state.class==true)? 'run': '')} style={{left:this.props.left+'%', animationDuration:this.props.duration+'s',width:this.props.width+'px'}}>
					<img className="img-fluid" alt="emoji" src={this.props.src} />
				</div>
			</>
		)
	}
}

export default Emoji;
import React from 'react';
import { Link } from 'react-router-dom';

export default class HomeFooter extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
      <footer className="footer-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Footer Social Info */}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="copywrite-text">
                <p>
                  Copyright © All rights reserved
									<i className="fa fa-heart-o" aria-hidden="true" /> by 
									<Link to="/" target="_blank"> An Gia Investment</Link>
								</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
		);
	}
}
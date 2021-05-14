import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { checkToken } from '../redux/user.jsx';


class HomeHeader extends React.Component {
    constructor(props) {
        super(props);
        this.getEmailUser = this.getEmailUser.bind(this);
        this.renderMenus = this.renderMenus.bind(this);
        this.props.checkToken();
    }
    componentDidMount() {
        setTimeout(() => {
            // console.log($.fn.classyNav)
            if ($.fn.classyNav) {
                $('#nikkiNav').classyNav();
            }
            $(`.classynav [data-index="${this.props.menuIndex}"]`).addClass('active-route');
        }, 100);
    }
    componentWillUpdate() {
      $(`.classynav li>a`).removeClass('active-route');
      setTimeout(() => {
        $(`.classynav [data-index="${this.props.menuIndex}"]`).addClass('active-route');
      }, 100);
    }
    getEmailUser() {
      try {
        if(this.props.user && this.props.user.loginUser) {
          return this.props.user.loginUser.email;
        }
      } catch(e) {
        console.log("error", e);
      }
      return '';
    }
    renderMenus() {
      var menus = Array.from(JSON.parse(JSON.stringify(this.props.menus)));
      var newMenus = this.refactorArrayMenus(menus);
      // console.log(newMenus)
      var xHTML = newMenus.map((depth0) => {
        if(depth0.subMenu.length == 0) {
          return (
            <li key={depth0.data.id}><a href={depth0.data.slug}>{depth0.data.text}</a></li>
          );
        } else {
          var xHTML_Depth1 = depth0.subMenu.map((depth1) => {
            if(depth1.subSubMenu.length == 0) {
              return (
                <li key={depth1.data.id}><a href={depth1.data.slug}>{depth1.data.text}</a></li>
              );
            } else {
              var xHTML_Depth2 = depth1.subSubMenu.map((depth2) => {
                return (
                  <li key={depth2.id}><a href={depth2.slug}>{depth2.text}</a></li>
                );
              });
              return (
                <li key={depth1.data.id}><a href={depth1.data.slug}>{depth1.data.text}</a>
                  <ul className="dropdown">
                    {xHTML_Depth2}
                  </ul>
                </li>
              );
            }
          });
          // End Map SubMenu
          if(depth0.data.enableMega) {
            //Mega Menu
            return (
              <li className="has-mega-menu" key={depth0.data.id}><a href={depth0.data.slug}>{depth0.data.text}</a>
                <div className="megamenu">
                  <ul className="single-mega single-mega-col-4">
                    {xHTML_Depth1}
                  </ul>
                </div>
              </li>
            )
          } else {
            //Normal Menu
            return (
              <li key={depth0.data.id}><a href={depth0.data.slug}>{depth0.data.text}</a>
                <ul className="dropdown">
                  {xHTML_Depth1}
                </ul>
              </li>
            );
          }
        }
      });
      // End Map MainMenu
      // console.log(xHTML);
      return xHTML;
    }
    
    refactorArrayMenus(menus) {
      var newMenus = [];
      while(menus.length != 0) {
        var el = menus.shift();
        if(el.depth == 0) {
          newMenus.push({
            data: el,
            subMenu: []
          });
        } else if(el.depth == 1) {
          newMenus[newMenus.length - 1].subMenu.push({
            data: el,
            subSubMenu: []
          });
        } else if(el.depth == 2) {
          newMenus[newMenus.length - 1].subMenu[
            newMenus[newMenus.length - 1].subMenu.length - 1
          ].subSubMenu.push(el);
        }
      }
      return newMenus;
    }
    render() {
        return (
            <header className="header-area">
            {/* Navbar Area */}
            <div className="nikki-main-menu">
              <div className="classy-nav-container breakpoint-off">
                <div className="container-fluid">
                  {/* Menu */}
                  <nav className="classy-navbar justify-content-between" id="nikkiNav">
                    {/* Nav brand */}
                    <Link to="/" className="nav-brand">
                    
                      { <img src="/themes/img/core-img/logo1.png" alt="" /> }
                    </Link>
               
                    {/* Navbar Toggler */}
                    <div className="classy-navbar-toggler">
                      <span className="navbarToggler"><span /><span /><span /></span>
                    </div>
                    {/* Menu */}
                    <div className="classy-menu">
                      {/* close btn */}
                      <div className="classycloseIcon">
                        <div className="cross-wrap"><span className="top" /><span className="bottom" /></div>
                      </div>
                      {/* Nav Start */}
                      <div className="classynav">
                        <ul>
                        {this.renderMenus()}
                        </ul>
                        {/* Search Form */}
                        <div className="search-form">
                          <form action="#" method="get">
                            <input type="search" name="search" className="form-control" placeholder="Search and hit enter..." />
                            <button type="submit"><i className="fa fa-search" /></button>
                          </form>
                        </div>
                        <div className="top-header-user">
                          <div className="avatar">
                            <img src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="avatar"/>
                          </div>
                          <a href="#" className="email">{this.getEmailUser()}</a>
                        </div>
                        {/* <div className="top-social-info">
                          <Link to="/" data-toggle="tooltip" data-placement="bottom" title="Facebook"><i className="fa fa-facebook" aria-hidden="true" /></Link>
                          <Link to="/" data-toggle="tooltip" data-placement="bottom" title="Twitter"><i className="fa fa-twitter" aria-hidden="true" /></Link>
                          <Link to="/" data-toggle="tooltip" data-placement="bottom" title="Instagram"><i className="fa fa-instagram" aria-hidden="true" /></Link>
                          <Link to="/" data-toggle="tooltip" data-placement="bottom" title="Pinterest"><i className="fa fa-pinterest" aria-hidden="true" /></Link>
                          <Link to="/" data-toggle="tooltip" data-placement="bottom" title="RSS Feed"><i className="fa fa-rss" aria-hidden="true" /></Link>
                        </div> */}
                      </div>
                      {/* Nav End */}
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </header>
        );
    }
}


const mapStateToProps = state => ({
  user: state.user,
  menus: state.admin.menu
});

const mapActionsToProps = {
	checkToken
}


export default connect(mapStateToProps, mapActionsToProps)(HomeHeader);
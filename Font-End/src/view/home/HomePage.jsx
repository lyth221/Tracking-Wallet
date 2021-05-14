import React from 'react';
import { connect } from 'react-redux';

import AlertService from '../common/js/AlertService';
import T from '../common/js/common';
import { AuthenticateService } from '../common/js/AuthenticateService';
import { updateSystemState } from '../redux/system.jsx';
import { updateLoginUser, loginGoogleUser, loginWithEmailPassword } from '../redux/user.jsx';


import '../common/scss/themes/css/main.css';
import '../common/scss/themes/css/util.css';
import '../common/scss/index.scss';
import { Redirect, Link } from 'react-router-dom';
// import '../common/scss/themes/vendo'; 

class HomePage extends React.Component {
	constructor(props) {
		super(props);
    this.state = {}
    this.onSubmit = this.onSubmit.bind(this);
	}
  onSubmit(event){
    event.preventDefault();
   let data ={
      email: $('#loginModalEmail').val().trim(),
      password: $('#loginModalPassword').val()
    }
   
    AlertService.loadingPopup();
            this.props.loginWithEmailPassword(data).then(res => {
           
                if(res.ok) {
                    if(res.body.code == 200) {
                      swal('Success!', res.body.message, 'success');
                        AuthenticateService.setAuthenticateUser(res.body.data[0]);
                    } else {
                        swal('Error!', res.body.message, 'error');
                    }
                } else {
                    swal('Error!', 'Có lỗi xảy ra. Vui lòng thử lại!!!', 'error');
                }
               AlertService.swal.close();
            });
         
  }
	render() {
		return (
		<React.Fragment>
		<div>
 
  <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login100">
        <form className="login100-form validate-form" onSubmit={this.onSubmit} >
          {/* <span className="login100-form-title p-b-43" style={{fontFamily:"Sans-serif"}}>Logo</span> */}
          <label style={{fontFamily:"Sans-serif",fontSize:"17px", paddingBottom:"5px"}}><i className="fa fa-user" aria-hidden="true" style={{color:"blue"}} ></i> Tên đăng nhập</label>
          <div
            className="wrap-input100 validate-input"
            data-validate="Valid email is required: ex@abc.xyz"
          >
            <input className="input100" type="text" name="email" required={true} id='loginModalEmail' />
          
            <span className="focus-input100" />
            {/* <span className="label-input100">Email</span> */}
          </div>
          <label style={{fontFamily:"Sans-serif", fontSize:"17px", paddingBottom:"5px"}}><i className="fa fa-lock" aria-hidden="true"style={{color:"blue"}}></i> Mật khẩu</label>
          <div
            className="wrap-input100 validate-input"
            data-validate="Password is required"
          >
            <input className="input100" type="password" name="pass"required={true} id='loginModalPassword' />
            <span className="focus-input100" />
          { /* <span className="label-input100">Password</span> */}
          </div>
          <div className="flex-sb-m w-full p-t-3 p-b-32">
            <div className="contact100-form-checkbox">
              <input
                className="input-checkbox100"
                id="ckb1"
                type="checkbox"
                name="remember-me"
              />
              <label className="label-checkbox100" htmlFor="ckb1" style={{fontFamily:"Sans-serif"}}>
                Nhớ đăng nhập
              </label>
            </div>
            <div>
              <a href="#" className="txt1" style={{fontFamily:"Sans-serif"}}>
                Quên mật khẩu?
              </a>
            </div>
          </div>
          <div className="container-login100-form-btn">
            <button className="login100-form-btn" style={{fontFamily:"Sans-serif", fontSize:"15px"}}>Đăng nhập</button>
          </div>
         
         
        </form>
        <div
          className="login100-more"
          style={{ backgroundImage: 'url("https://pbs.twimg.com/media/E01LgkyUYAEXqvS.jpg")' }}
        ></div>
      </div>
    </div>
  </div>
  {/*===============================================================================================*/}
  {/*===============================================================================================*/}
  {/*===============================================================================================*/}
  {/*===============================================================================================*/}
  {/*===============================================================================================*/}
  {/*===============================================================================================*/}
  {/*===============================================================================================*/}
</div>;


		</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	system: state.system
});
const mapActionsToProps = {
  loginWithEmailPassword,
  updateSystemState,
	// loginUser: loginUser
};
export default connect(mapStateToProps, mapActionsToProps)(HomePage);
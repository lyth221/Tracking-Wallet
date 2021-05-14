import T from '../common/js/common';
import AlertService from '../common/js/AlertService';
// import { AuthenticateService } from '../common/js/AuthenticateService';
import React from 'react';
import { connect } from 'react-redux';
import { updateSystemState } from '../redux/system.jsx';
import { updateLoginUser, loginGoogleUser, loginWithEmailPassword } from '../redux/user.jsx';
import GoogleLogin from 'react-google-login';

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onNavLinkClick = this.onNavLinkClick.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);

        T.showLoginModal = (data, show = 'show') => {
            this.updateView(data.state, data.message);
            $('#modalLogin').modal(show);
        };

        T.logOut = () => {
            //T.confirm('Đăng xuất', 'Bạn có chắc bạn muốn đăng xuất?', () => {
                // T.post('/logout', {},
                //     data => this.props.updateSystemState({ user: null }),
                //     error => console.error('GET: /logout. ' + error));
                
            //});
            AlertService.warningPopup('Warning!', 'Bạn có muốn đăng xuất không?', (e) => {
                if(e.value) {
                    this.props.updateLoginUser(null);
                }
            });
            
        }
    }

    updateView(state, message) {
        $('#modalLogin a.nikki-link-tab').removeClass('active').removeClass('show');
        $('#modalLogin a.nikki-link-tab[href="#' + state + '"]').addClass('active').addClass('show');
        $('#modalLogin p.message').html(message ? message : '');

        // $('#modalLogin div.modal-content div.modal-body div.form-group').css('display', 'flex')
        if (state === 'register') {
            $(".nikki-btn-google").hide();
            $('#loginForgotPassword').css('display', 'none');
            $('#modalLogin input').val('');
            $('#modalLogin #loginModalSend').attr('data-action', state).html('Đăng ký');
        } else {
            $(".nikki-btn-google").show();
            $('#loginForgotPassword').css('display', 'block');
            $('#loginModalName').parent().parent().css('display', 'none')
            $('#modalLogin #loginModalSend').attr('data-action', state).html('Đăng nhập');
        }
    }

    onNavLinkClick(event) {
        this.updateView($(event.target).attr('href').substring(1), '');
        event.preventDefault();
    }

    onForgotPasswordClick() {
        const email = $('#loginModalEmail').val().trim();

        if (email.checkEmail() === false || email === '') {
            $('#loginModalErrorMessage').html('Email is not valid!');
            $('#loginModalEmail').focus();
            return;
        }
        T.put('/login/forgot-password', { email }, result => {
            if (result.error) {
                $('#loginModalErrorMessage').html('Check email has some error!');
            } else {
                $('#loginModalErrorMessage').html('Your request is solved. Please check your email to reset your password!');
            }
        }, () => $('#loginModalErrorMessage').html('Check email has some error!'));
    }

    onSubmit(event) {
        let loginModalSend = $('#loginModalSend').attr('disabled', false),
            data = {
                // name: $('#loginModalName').val().trim(),
                email: $('#loginModalEmail').val().trim(),
                password: $('#loginModalPassword').val()
            };
            console.log()
        if (loginModalSend.attr('data-action') === 'register') {
            if (data.name === '') {
                loginModalSend.attr('disabled', false);
                $('#loginModalErrorMessage').html('Your name is empty now!');
                $('#loginModalName').focus();
            } else {
                T.post('/register', data, res => {
                    loginModalSend.attr('disabled', false);
                    $('#loginModalErrorMessage').html(res.error ? res.error : '');

                    if (res.user) {
                        $('#modalLogin').modal('hide');
                        T.alert('Đăng ký thành viên', 'Bạn đã đăng ký thành viên thành công. Vui lòng kiểm tra email kích hoạt tài khoản!');
                    }
                }, error => {
                    loginModalSend.attr('disabled', false);
                    console.error('POST register:', error);
                });
            }
        } else { 
            AlertService.loadingPopup();
            this.props.loginWithEmailPassword(data).then(res => {
                if(res.ok) {
                    if(res.body.code == 200) {
                        T.showLoginModal({ state: 'login', message: '' }, 'hide');
                        // AuthenticateService.setAuthenticateUser(res.body.data[0]);
                        swal('Success!', res.body.message, 'success');
                    } else {
                        swal('Error!', res.body.message, 'error');
                    }
                } else {
                    swal('Error!', 'Có lỗi xảy ra. Vui lòng thử lại!!!', 'error');
                }
                AlertService.swal.close();
            });
           
        }
        event.preventDefault();
    }

    responseGoogle(response) {
        if(response.error) return;
        this.props.loginGoogleUser(response.tokenId).then(res => {
            // console.log("res = ", res);
            if(res.ok) {
                if(res.data.code == 200) {
                    T.showLoginModal({ state: 'login', message: '' }, 'hide');
                    swal('Success!', res.data.message, 'success');
                } else {
                    swal('Error!', res.data.message, 'error');
                }
            } else {
                swal('Error!', 'Có lỗi xảy ra. Vui lòng thử lại!!!', 'error');
            }
        });
    }
    render() {
        return (
            <div id='modalLogin' className='modal' tabIndex='-1' role='dialog'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content' style={{borderRadius: '0'}}>
                        <div className='modal-header' style={{ padding: 0 }}>
                        </div>
                        <form className='needs-validation' onSubmit={this.onSubmit} noValidate='true'>
                            <div className='modal-body contact-form-area'>
                                <p className='message' />
                                
                                <div className="form-group">
                                    <GoogleLogin
                                        className="btn nikki-btn nikki-btn-google"
                                        clientId="290607953622-sikkf6ucts2aqahevehbs18in6ae9emo.apps.googleusercontent.com"
                                        buttonText="Đăng nhập với Google"
                                        onSuccess={this.responseGoogle}
                                        onFailure={this.responseGoogle}>
                                        <div className="icons"><i className="fa fa-google-plus" aria-hidden="true"></i></div>
                                        <div className="text">Đăng nhập với google</div>
                                    </GoogleLogin>
                                </div>
                                {/* <div className='form-group row'>
                                    <label htmlFor='loginModalName' className='col-sm-3 col-form-label'>Họ và tên</label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' required={true}
                                            placeholder='Name' id='loginModalName' />
                                    </div>
                                </div> */}
                                <div className='form-group'>
                                    {/* <label htmlFor='loginModalEmail' className='col-sm-3 col-form-label'>Email</label> */}
                                    <input type='email' className='form-control' required={true}
                                            placeholder='Email' id='loginModalEmail' />
                                </div>
                                <div className='form-group'>
                                    {/* <label htmlFor='loginModalPassword' className='col-sm-3 col-form-label'>Mật khẩu</label> */}
                                    <input type='password' className='form-control' required={true}
                                            placeholder='Password' id='loginModalPassword' />
                                        <a style={{ margin: '10px' }} id='loginForgotPassword' href='#' className='onlyLoginForm'
                                            onClick={this.onForgotPasswordClick.bind(this)}>Quên mật khẩu?</a>
                                </div>
                                <p id='loginModalErrorMessage' className='text-danger' />
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn nikki-btn btn-sm m-2' data-dismiss='modal'>Đóng
                                </button>
                                <button type='submit' className='btn nikki-btn btn-sm active m-2' id='loginModalSend'
                                    data-action='register'>Đăng ký
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    system: state.system,
    user: state.user
});

const mapActionsToProps = {
    updateLoginUser,
    loginGoogleUser,
    loginWithEmailPassword,
    updateSystemState,
};

export default connect(mapStateToProps, mapActionsToProps)(LoginModal);
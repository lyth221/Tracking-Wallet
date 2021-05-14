import React, { Component, Fragment } from "react";
import update from "immutability-helper";
import AlerService from "../common/js/AlertService";
import { connect } from "react-redux";
import { createUser, getListUser } from "../redux/user.jsx";
import { getListProject } from "../redux/project.jsx";
import CheckBox from "../common/CheckBox.jsx";

class UserCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: "",
        password: "",
        repassword: "",
        lstProjectSet: [],
      },
      validate: {
        email: "",
        password: "",
        repassword: "",
      },
      listProject: [],
      selectProject: [],
    };
    this.validateData = this.validateData.bind(this);
    this.onChangeData = this.onChangeData.bind(this);
  }
  onChangeData(e, key) {
    e.preventDefault();
    let errString = "";
    if (!this.validateData(key, e.target.value.trim())) {
      if (key == "email") errString = "Username không hợp lệ";
      else if (key == "password") errString = "Mật khẩu ít nhất 6 kí tự.";
      else errString = "Mật khẩu không khớp.";
    } else {
      errString = "";
    }
    this.setState(
      update(this.state, {
        data: {
          [key]: { $set: e.target.value.trim() },
        },
        validate: {
          [key]: { $set: errString },
        },
      })
    );
  }
  validateData(key, value) {
    let check = false;
    switch (key) {
      case "email":
        check = value.match(/^[a-zA-Z0-9_]*$/i);
        if (check) return true;
        break;
      case "password":
        if (value.length >= 6) return true;
        break;
      case "repassword":
        if (value === this.state.data.password) return true;
        break;
      default:
        break;
    }
    return false;
  }
  cancelCreate() {
    this.setState(
      update(this.state, {
        data: {
          email: { $set: "" },
          password: { $set: "" },
          repassword: { $set: "" },
        },
        validate: {
          email: { $set: "" },
          password: { $set: "" },
          repassword: { $set: "" },
        },
      })
    );
  }
  submitCreate() {
    const { data, validate } = this.state;
    const listProjectHash = this.state.selectProject;
    AlerService.loadingPopup();
    Object.keys(listProjectHash).forEach((key) => {
      if (listProjectHash[key]) data.lstProjectSet.push(key);
    });

    if (validate.email == "" && validate.password == "") {
      AlerService.loadingPopup();
      this.props.createUser(data).then((res) => {
        if (res.ok) {
          this.props.getListUser().then((response) => {
            // console.log("Get List User Modal", response);
            $("#modal-create-user").modal("hide");
            this.cancelCreate();
            AlerService.successPopup("Success!", res.body.message);
            window.location.reload();
          });
        } else {
          AlerService.swal.close();
          AlerService.errorPopup("Error!", res.error);
        }
      });
    }
  }

  renderListProject(col) {
    return this.state.listProject.map((d) => {
      return (
        <CheckBox
          key={d.project_code}
          name="Dự án"
          labelText={d.project_name}
          value={d._id}
          customClass={col}
          onChange={this.handleChangeCheckbox.bind(this)}
        />
      );
    });
  }

  handleChangeCheckbox(e) {
    var key = e.target.value,
      checked = e.target.checked;
    var selectProject = this.state.selectProject;
    selectProject[key] = checked;
    this.setState(
      update(this.state, {
        selectProject: {
          $set: selectProject,
        },
      })
    );
  }

  componentDidMount() {
    this.props.getListProject().then((res) => {
      if (res.body.data.length > 0) {
        this.setState(
          update(this.state, {
            listProject: {
              $set: res.body.data,
            },
          })
        );
      } else {
        this.setState(
          update(this.state, {
            listProject: {
              $set: [],
            },
          })
        );
      }
    });
  }

  render() {
    const { email, password, repassword } = this.state.data;
    const error = this.state.validate;
    return (
      <Fragment>
        <div
          id="nav-user-header"
          style={{ marginBottom: "20px" }}
          className="d-flex justify-content-end"
        >
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#modal-create-user"
          >
            Tạo user mới
          </button>
        </div>
        <div
          className="modal fade"
          id="modal-create-user"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tạo user mới</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                      value={email}
                      onChange={(e) => this.onChangeData(e, "email")}
                      className="form-control"
                      placeholder="Nhâp tên đăng nhập"
                    />
                    <small className="form-text text-danger">
                      {error.email}
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                      value={password}
                      onChange={(e) => this.onChangeData(e, "password")}
                      type="password"
                      className="form-control"
                      placeholder="Mật khẩu"
                    />
                    <small className="form-text text-danger">
                      {error.password}
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Nhập lại Mật khẩu</label>
                    <input
                      value={repassword}
                      onChange={(e) => this.onChangeData(e, "repassword")}
                      type="password"
                      className="form-control"
                      placeholder="Nhập lại Mật khẩu"
                    />
                    <small className="form-text text-danger">
                      {error.repassword}
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Chọn dự án</label>
                    <div className="row">
                      {this.renderListProject.bind(this)("col-6")}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  onClick={this.cancelCreate.bind(this)}
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Huỷ bỏ
                </button>
                <button
                  onClick={this.submitCreate.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  createUser: createUser,
  getListUser: getListUser,
  getListProject: getListProject,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(UserCreateModal);

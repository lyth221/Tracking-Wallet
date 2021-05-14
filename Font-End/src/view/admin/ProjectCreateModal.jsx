import React, { Component, Fragment } from "react";
import update from "immutability-helper";
import AlerService from "../common/js/AlertService";
import { connect } from "react-redux";
import { createProject, getListProject } from "../redux/project.jsx";
import { getListUser } from "../redux/user.jsx";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

class UserCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        projectName: "",
        projectCode: "",
      },
      categoryProjectSelected: {
        name: "Căn hộ",
        code: "can_ho",
      },
      listCategoryProject: ["Căn hộ", "Nhà phố"],
      listCategoryProjectCode: [
        {
          name: "Căn hộ",
          code: "can_ho",
        },
        {
          name: "Nhà phố",
          code: "nha_pho",
        },
      ],
    };
    this.onChangeData = this.onChangeData.bind(this);
  }
  onChangeData(e, key) {
    e.preventDefault();
    this.setState(
      update(this.state, {
        data: {
          [key]: { $set: e.target.value.trim() },
        },
      })
    );
  }

  cancelCreate() {
    this.setState(
      update(this.state, {
        data: {
          projectName: { $set: "" },
          projectCode: { $set: "" },
        },
      })
    );
  }
  submitCreate() {
    const { data, categoryProjectSelected } = this.state;
    data.categoryProjectCode = categoryProjectSelected.code;
    data.categoryProjectName = categoryProjectSelected.name;
    AlerService.loadingPopup();

    this.props.createProject(data, categoryProjectSelected).then((res) => {
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

  onChangeSelect(e) {
    let data = this.state.listCategoryProjectCode
      .sort()
      .filter((item) => item.name === e.value);
    this.setState(
      update(this.state, {
        $set: {
          categoryProjectSelected: data[0],
        },
      })
    );
  }

  render() {
    const { email, password } = this.state.data;
    const { categoryProjectSelected } = this.state;
    const categoryProjectSelectedName = categoryProjectSelected.name || "";
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
            Thêm dự án
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
                <h5 className="modal-title">Thêm dự án</h5>
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
                    <label>Tên dự án</label>
                    <input
                      onChange={(e) => this.onChangeData(e, "projectName")}
                      type="email"
                      className="form-control"
                      placeholder="Nhâp tên dự án"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mã dự án</label>
                    <input
                      onChange={(e) => this.onChangeData(e, "projectCode")}
                      type="email"
                      className="form-control"
                      placeholder="Mã dự án"
                    />
                  </div>
                  <div className="form-group">
                    <label>Loại dự án</label>
                    <Dropdown
                      options={this.state.listCategoryProject}
                      onChange={(e) => this.onChangeSelect(e)}
                      value={categoryProjectSelectedName}
                      placeholder="Chọn dự án"
                    />
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
  createProject: createProject,
  getListProject: getListProject,
  getListUser: getListUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(UserCreateModal);

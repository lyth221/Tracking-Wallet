import React from "react";
import { Link } from "react-router-dom";
import SwitchBox from "../common/SwitchBox.jsx";
import ReactTable from "react-table";
import AlerService from "../common/js/AlertService";
import update from "immutability-helper";
import UserCreateModal from "./UserCreateModal.jsx";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import {
  updateListUser,
  getListUser,
  updateInfoUser,
  updatePermission,
} from "../redux/user.jsx";

import { getListProject } from "../redux/project.jsx";
import CheckBox from "../common/CheckBox.jsx";
import CheckboxModal from "rc-checkbox";
import "react-table/react-table.css";
import "../common/scss/user-page.scss";

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      listUser: [],
      listProject: [],
      projectSelected: null,
      modal: {
        open: false,
        user: null,
      },
      open: false,
      groupIdSelected: {},
      userSelected: null,
      listProjectUpdate: [],
      password: null,
      rePassword: null,
      validate: {
        email: "",
        password: "",
        rePassword: "",
      },
    };

    this.getUserByID = this.getUserByID.bind(this);
    this.onChangeSwitch = this.onChangeSwitch.bind(this);
    this.mapDataListUser = this.mapDataListUser.bind(this);
    this.deleteUserById = this.deleteUserById.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.props.getListUser();
  }
  getUserByID(id) {
    const { data } = this.state;
    let index = null;
    const user = data.filter((c, idx) => {
      if (c._id === id) {
        index = idx;
        return c;
      }
    })[0];
    return { user, index };
  }
  onOpenModal(e, data) {
    let { groupIdSelected } = this.state;
    data.hashGroup = {};
    for (let index = 0; index < data.permission_project.length; index++) {
      let g = data.permission_project[index];
      data.hashGroup[g.projectName] = g;
      groupIdSelected[g.projectCode] = true;
    }

    this.setState(
      update(this.state, {
        modal: {
          open: { $set: true },
          user: { $set: data._id },
        },
        groupIdSelected: { $set: groupIdSelected },
      })
    );
  }

  validateData(key, value) {
    let check = false;
    switch (key) {
      case "password":
        if (value.length >= 6) return true;
        break;
      case "rePassword":
        if (value === this.state.password) return true;
        break;
      default:
        break;
    }
    return false;
  }

  onChangeData(e, key) {
    e.preventDefault();

    let errString = "";
    if (!this.validateData(key, e.target.value.trim())) {
      if (key == "password") errString = "Mật khẩu ít nhất 6 kí tự.";
      else errString = "Mật khẩu không khớp.";
    } else {
      errString = "";
    }
    this.setState(
      update(this.state, {
        [key]: { $set: e.target.value },
        validate: {
          [key]: { $set: errString },
        },
      })
    );
  }
  onCloseModal() {
    try {
      this.setState(
        update(this.state, {
          modal: {
            open: { $set: false },
            user: { $set: null },
          },
          groupIdSelected: { $set: {} },
        })
      );
    } catch (e) {
      console.log(e);
    }
  }
  getStyleGroupName(project) {
    return (
      <span
        className="badge badge-success"
        data-tip
        data-for={project.projectId}
      >
        {project.projectName}
      </span>
    );
  }
  renderListPermission(project, data) {
    return <React.Fragment>{this.getStyleGroupName(project)}</React.Fragment>;
  }
  onChangeSwitch(e, _id) {
    const { user, index } = this.getUserByID(_id);
    if (user) {
      AlerService.warningPopup(
        "Warning!",
        `Bạn có chắc muốn thay đổi trạng thái user ${user.email}`,
        (cb) => {
          //Confirm
          AlerService.loadingPopup();
          if (cb.value) {
            // console.log(index, user, this);
            let data = {
              id: user._id,
              status: null,
            };
            if (user.status === "active") data.status = "deactive";
            else data.status = "active";

            this.props.updateInfoUser(data).then((res) => {
              this.props.getListUser().then((response) => {
                AlerService.swal.close();
                if (res.ok) {
                  AlerService.successPopup("Success!", res.body.message);
                } else {
                  AlerService.errorPopup("Error!", res.error);
                }
                window.location.reload();
              });
            });
          } else {
            AlerService.swal.close();
          }
        }
      );
    } else {
      AlerService.errorPopup("Error!", "Có lỗi xảy ra, vui lòng thử lại!");
    }
    e.preventDefault();
  }
  deleteUserById(e, user) {
    e.preventDefault();
    AlerService.warningPopup(
      "Warning!",
      `Bạn có chắc muốn xoá user ${user.email}`,
      (cb) => {
        console.log(cb, user);
      }
    );
  }

  mapDataListUser() {
    const { listUser } = this.state;
    if (listUser) {
      const users = listUser.map((el, idx) => {
        // let str = Math.round(Math.random() * 9999) % 2 == 0 ? 'active' : 'deactive';
        return {
          ...el,
          stt: idx + 1,
          delete: idx,
        };
      });
      return users;
    }
    return [];
  }
  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps: ",nextProps);
    if (nextProps.user.listUser) {
      this.setState(
        update(this.state, {
          data: {
            $set: JSON.parse(JSON.stringify(nextProps.user.listUser)),
          },
        })
      );
    }
  }

  renderListProject(project) {
    return (
      <CheckBox
        key={project.project_code}
        name="Dự án"
        labelText={project.project_name}
        value={project._id}
        onChange={this.handleChangeCheckbox.bind(this)}
      />
    );
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

  handleOnChangeCheckBox(data, listProject) {
    const { listProjectUpdate, groupIdSelected } = this.state;

    const lstProject = groupIdSelected;
    if (groupIdSelected[listProject.project_code]) {
      delete groupIdSelected[listProject.project_code];
    } else {
      groupIdSelected[listProject.project_code] = true;
    }
    this.setState(
      update(this.state, {
        groupIdSelected: { $set: groupIdSelected },
      })
    );
  }

  handleConfirm(e) {
    e.preventDefault();
    const { groupIdSelected, modal } = this.state;
    const password = this.state.password;
    const rePassword = this.state.rePassword;

    let data = {};
    if (password != null && rePassword != null) {
      if (rePassword === password) {
        data.newPassword = password;
        data.id = modal.user;
        this.props.updateInfoUser(data).then((res) => {
          if (res.ok) {
            AlerService.successPopup("Success!", res.body.message);
            this.props.getListUser().then((res) => {
              this.setState(
                update(this.state, {
                  listUser: {
                    $set: res.body.data,
                  },
                })
              );
            });
          } else {
            AlerService.errorPopup("Error!", res.error);
          }
        });
      }
    }

    this.props.updatePermission(groupIdSelected, modal.user).then((res) => {
      if (res.ok) {
        AlerService.successPopup("Success!", res.body.message);
        this.props.getListUser().then((res) => {
          this.setState(
            update(this.state, {
              listUser: {
                $set: res.body.data,
              },
            })
          );
        });
      } else {
        AlerService.errorPopup("Error!", res.error);
      }
    });

    this.onCloseModal();
    AlerService.swal.close();

    // window.location.reload();
  }

  componentDidMount() {
    this.props.getListUser().then((res) => {
      this.setState(
        update(this.state, {
          listUser: {
            $set: res.body.data,
          },
        })
      );
    });

    this.props.getListProject().then((res) => {
      if (res.body.data.length > 0) {
        this.setState(
          update(this.state, {
            listProject: {
              $set: res.body.data,
            },
          })
        );
      }
    });
  }
  render() {
    const data = this.mapDataListUser();
    const listProject = this.state.listProject;
    const {
      modal,
      groupIdSelected,
      password,
      rePassword,
      validate,
    } = this.state;

    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-user" /> Người dùng
            </h1>
            <p />
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin">
                <i className="fa fa-home fa-lg" />
              </Link>
            </li>
            <li className="breadcrumb-item">
              <a href="#">Người dùng</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="tile table-user-page">
              <UserCreateModal />
              <ReactTable
                data={data}
                columns={[
                  {
                    Header: "STT",
                    accessor: "stt",
                    maxWidth: 50,
                    className: "justify-content-center",
                  },
                  {
                    Header: "Tên người dùng",
                    accessor: "email",
                  },
                  {
                    Header: "Dự án",
                    id: "project",
                    accessor: (d) => {
                      return (
                        <ul className="wrapper-permission">
                          {d.permission_project.map((g) => {
                            return (
                              <li key={g.projectId}>
                                {this.renderListPermission(g, d)}
                              </li>
                            );
                          })}
                        </ul>
                      );
                    },
                  },
                  {
                    Header: "Trạng thái",
                    id: "status",
                    maxWidth: 80,
                    className: "status-col",
                    sortable: false,
                    accessor: (d) => {
                      return (
                        <SwitchBox
                          checked={d.status === "active" ? true : false}
                          labelText=""
                          onChangeSwitch={(e) => this.onChangeSwitch(e, d._id)}
                        />
                      );
                    },
                  },
                  {
                    Header: "Tác vụ",
                    id: "delete",
                    maxWidth: 100,
                    sortable: false,
                    className: "justify-content-center",
                    accessor: (d) => {
                      return (
                        <React.Fragment>
                          <div
                            onClick={(e) => this.onOpenModal(e, d)}
                            className="btn btn-primary"
                            style={{ marginRight: "5px" }}
                          >
                            <i
                              className="icons fa fa-edit"
                              aria-hidden="true"
                            />
                          </div>
                          <div
                            className="btn btn-danger btn-delete"
                            onClick={(e) => this.deleteUserById(e, d)}
                          >
                            <i
                              className="icons fa fa-trash"
                              aria-hidden="true"
                            />
                          </div>
                        </React.Fragment>
                      );
                    },
                  },
                ]}
                defaultPageSize={10}
                className="table"
                rowsText="Hàng"
                pageText="Trang"
                ofText="trong tổng số"
                noDataText="Dữ liệu rỗng"
                previousText="Quay lại"
                nextText="Trang tiếp"
                resizable={false}
              />
            </div>
          </div>
        </div>
        <div />

        <Modal
          open={modal.open}
          onClose={() => this.onCloseModal()}
          center
          classNames={{
            test: "test",
          }}
          modalId="add-permission"
        >
          <h4 style={{ textAlign: "left" }}>Phân quyền</h4>
          <div className="row">
            <div className="col-12">
              <hr />
            </div>
            {listProject.length > 0
              ? listProject.map((g) => {
                  return (
                    <div
                      className="col-10"
                      key={g._id}
                      style={{ fontSize: "16px" }}
                    >
                      <CheckboxModal
                        // disabled={u.isSendMail}
                        onChange={(e) => this.handleOnChangeCheckBox(e, g)}
                        checked={groupIdSelected[g.project_code]}
                      />
                      <span
                        className="text-badge"
                        style={{ paddingLeft: "5px" }}
                      >
                        {g.project_name}
                      </span>
                    </div>
                  );
                })
              : ""}
          </div>
          <hr />
          <h4>Đổi mật khẩu</h4>
          <label>Nhập mật khẩu mới</label>
          <input
            value={password}
            onChange={(e) => this.onChangeData(e, "password")}
            className="form-control"
            placeholder="Nhập mật khẩu mới"
            type="password"
          />
          <small className="form-text text-danger">{validate.password}</small>
          <label>Nhập lại mật khẩu</label>
          <input
            value={rePassword}
            onChange={(e) => this.onChangeData(e, "rePassword")}
            className="form-control"
            placeholder="Nhập lại mật khẩu"
            type="password"
          />
          <small className="form-text text-danger">{validate.rePassword}</small>
          <button
            onClick={(e) => this.handleConfirm(e)}
            className="sc-confirm btn btn-success"
          >
            Xác nhận
          </button>
        </Modal>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  updateListUser: updateListUser,
  getListUser: getListUser,
  updateInfoUser,
  getListProject,
  updatePermission,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(UserPage);

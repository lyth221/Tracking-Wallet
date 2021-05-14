import React from "react";
import { Link } from "react-router-dom";
import SwitchBox from "../common/SwitchBox.jsx";
import ReactTable from "react-table";
import AlerService from "../common/js/AlertService";
import update from "immutability-helper";
import ProjectCreateModal from "./ProjectCreateModal.jsx";
import { getListProject, updateProject } from "../redux/project.jsx";

import { connect } from "react-redux";
import { updateListUser, getListUser, updateInfoUser } from "../redux/user.jsx";

import "react-table/react-table.css";
import "../common/scss/user-page.scss";

class ManageProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      listProject: [],
    };
    this.getUserByID = this.getUserByID.bind(this);
    this.onChangeSwitch = this.onChangeSwitch.bind(this);
    this.mapProject = this.mapProject.bind(this);

    this.props.getListUser();
  }
  getUserByID(id) {
    const { listProject } = this.state;
    let index = null;
    const project = listProject.filter((c, idx) => {
      if (c._id === id) {
        index = idx;
        return c;
      }
    })[0];
    return { project, index };
  }
  onChangeSwitch(e, _id) {
    const { project, index } = this.getUserByID(_id);
    if (project) {
      AlerService.warningPopup(
        "Warning!",
        `Bạn có chắc muốn thay đổi trạng thái dự án ${project.project_name}`,
        (cb) => {
          //Confirm
          AlerService.loadingPopup();
          if (cb.value) {
            // console.log(index, user, this);
            let data = {
              id: project._id,
              projectCode: project.project_code,
              status: null,
            };
            if (project.status === "active") data.status = "deactive";
            else data.status = "active";

            this.props.updateProject(data).then((res) => {
              this.props.getListProject().then((response) => {
                AlerService.swal.close();
                if (res.ok) {
                  AlerService.successPopup("Success!", res.body.message);
                  window.location.reload();
                } else {
                  AlerService.errorPopup("Error!", res.error);
                  window.location.reload();
                }
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

  mapProject() {
    const { listProject } = this.state;
    if (listProject) {
      const listProjects = listProject.map((el, idx) => {
        // let str = Math.round(Math.random() * 9999) % 2 == 0 ? 'active' : 'deactive';
        return {
          ...el,
          stt: idx + 1,
          delete: idx,
        };
      });
      return listProjects;
    }
    return [];
  }

  componentDidMount() {
    this.props.getListProject().then((res) => {
      if (!res.ok) {
        AlerService.errorPopup("Lỗi!", res.error);
      } else {
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
    const data = this.mapProject() || [];
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-shopping-bag" /> Dự án
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
              <a href="#">Dự án</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="tile table-user-page">
              <ProjectCreateModal />
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
                    Header: "Mã dự án",
                    accessor: "project_code",
                  },
                  {
                    Header: "Loại dự án",
                    accessor: "category_project_name",
                  },
                  {
                    Header: "Tên dự án",
                    accessor: "project_name",
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
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

// const mapActionsToProps = actions => ({
//     updateListUser: updateListUser,
//     getListUser: getListUser
// });
const mapActionsToProps = {
  updateListUser: updateListUser,
  getListUser: getListUser,
  updateInfoUser,
  getListProject,
  updateProject,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ManageProjectPage);

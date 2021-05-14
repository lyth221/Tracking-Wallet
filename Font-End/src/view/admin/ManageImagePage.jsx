import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import readXlsxFile from "read-excel-file";
import DragImageBox from "../common/DragImageBox.jsx";
import AlerService from "../common/js/AlertService";
import { getListProject, updateProject } from "../redux/project.jsx";
import { getListImage } from "../redux/image.jsx";
import { uploadImage } from "../redux/image.jsx";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import {
  importExcelFile,
  prepareDataCallApi,
  getDataFile,
} from "../redux/importExcel.jsx";
import ReactTable from "react-table";
import "../common/scss/admin/events.scss";
import update from "immutability-helper";

import "react-table/react-table.css";
import "../common/scss/user-page.scss";

class ManageImagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      dataImageUpload: [],
      imageUpload: {
        objImage: null,
        base64: "",
      },
      titleImage: null,
      listProject: [],
      listProjectName: [],
      selectedProject: null,
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onChangeData = this.onChangeData.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    // this.importExcelFile = this.importExcelFile.bind(this);
  }

  onFileChange(event) {
    event.preventDefault();
    this.setState({ selectedFile: event.target.files[0] });
  }

  onChangeFile(files) {
    let filename = files[0].name;
    if (filename.lastIndexOf(".") <= 0) {
      return alert("File không hợp lệ");
    }
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      this.setState(
        update(this.state, {
          imageUpload: {
            base64: { $set: fileReader.result },
            objImage: { $set: files[0] },
          },
        })
      );
    });
    fileReader.readAsDataURL(files[0]);
    // vm.selectedFile = files[0];
  }

  onChangeData(e, key) {
    e.preventDefault();
    this.setState(
      update(this.state, {
        [key]: { $set: e.target.value.trim() },
      })
    );
  }

  onSubmmit(e) {
    e.preventDefault();
    const { imageUpload, selectedProject, titleImage } = this.state;
    const formData = new FormData();
    formData.append("myFile", imageUpload.objImage);

    if (imageUpload.objImage && selectedProject && titleImage) {
      this.state.listProject.forEach((item) => {
        if (item.project_name === this.state.selectedProject) {
          formData.append("projectName", item.project_name);
          formData.append("projectCode", item.project_code);
          formData.append("status", item.status);
        }
      });
      formData.append("titleImage", titleImage);

      this.props.uploadImage(formData).then((res) => {
        if (res.ok) {
          this.setState(
            update(this.state, {
              // listImage: { $set: [...this.state.listImage, res.body[0]] },
              imageUpload: {
                objImage: { $set: null },
                base64: { $set: "" },
              },
              selectedProject: { $set: null },
            })
          );
          AlerService.successPopup(
            "Thành công!",
            `Upload ảnh lên server thành công.`
          );
          window.location.reload();
        } else {
          AlerService.errorPopup("Lỗi!", res.error);
        }
      });
    } else {
      AlerService.infoPopup(
        "Cảnh báo!",
        "Bạn cần chọn hình ảnh và nhập đủ tiêu đề hình ảnh, dự án"
      );
    }
  }
  onChangeSelect(e) {
    this.setState(
      update(this.state, {
        selectedProject: {
          $set: e.value,
        },
      })
    );
  }

  componentDidMount() {
    this.props.getListImage().then((res) => {
      AlerService.swal.close();
      if (!res.ok) {
        AlerService.errorPopup("Lỗi!", res.error);
      } else {
        this.setState(
          update(this.state, {
            dataImageUpload: {
              $set: res.body,
            },
          })
        );
      }
    });

    this.props.getListProject().then((res) => {
      AlerService.swal.close();
      if (!res.ok) {
        AlerService.errorPopup("Lỗi!", res.error);
      } else {
        const listProjectName = [];
        res.body.data.forEach((element) => {
          listProjectName.push(element.project_name);
        });
        this.setState(
          update(this.state, {
            listProject: {
              $set: res.body.data,
            },
            listProjectName: {
              $set: listProjectName,
            },
          })
        );
      }
    });
  }

  render() {
    const data = this.state.dataImageUpload || [];
    const listProject = this.state.listProject || [];
    const { imageUpload } = this.state;
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-user" /> Cập nhật hình ảnh
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
              <a href="#">Tải lên file mới</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-12 tile">
            <div className="row">
              <div className="col-8">
                <div className="form-group">
                  <label>Nhập tiêu đề hình ảnh</label>
                  <input
                    value={data.titleImage}
                    onChange={(e) => this.onChangeData(e, "titleImage")}
                    className="form-control style-02"
                    type="text"
                    placeholder="Tiêu đề hình ảnh"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Chọn dự án</label>
                  <Dropdown
                    options={this.state.listProjectName}
                    onChange={(e) => this.onChangeSelect(e)}
                    value={this.state.selectedProject}
                    placeholder="Chọn dự án"
                  />
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => this.onSubmmit(e)}
                  >
                    Tải lên!
                  </button>
                </div>
              </div>
              <div className="col-2">
                <DragImageBox
                  customClass="previewImage"
                  previewSingleImage={imageUpload.base64}
                  onChangeFile={(files) => this.onChangeFile(files)}
                  message="Chọn ảnh cần upload<br>tại đây"
                />
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="tile table-user-page" style={{ height: "auto" }}>
              <ReactTable
                data={data}
                columns={[
                  {
                    Header: "Hình ảnh",
                    id: "sourceUrl",
                    className: "justify-content-center td-image",
                    accessor: (d) => {
                      return (
                        <React.Fragment>
                          <div className="">
                            <img src={d.sourceUrl} />
                          </div>
                        </React.Fragment>
                      );
                    },
                  },
                  {
                    Header: "Tên dự án",
                    accessor: "projectName",
                  },
                  {
                    Header: "Mã dự án",
                    accessor: "projectCode",
                  },
                  {
                    Header: "Tác vụ",
                    id: "source",
                    maxWidth: 100,
                    sortable: false,
                    className: "justify-content-center",
                    accessor: (d) => {
                      return (
                        <React.Fragment>
                          <div className="btn btn-success btn-delete">
                            <a style={{ color: "white" }}>
                              <i class="fa fa-pencil" aria-hidden="true" />
                            </a>
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
      </main>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  importExcelFile,
  getDataFile,
  getListProject,
  uploadImage,
  getListImage,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(ManageImagePage);

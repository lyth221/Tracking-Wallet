import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import readXlsxFile from "read-excel-file";
import AlerService from "../common/js/AlertService";
import {
  importExcelFile,
  prepareDataCallApi,
  getDataFile,
} from "../../view/redux/importExcel.jsx";
import { getListProject } from "../redux/project.jsx";
import ReactTable from "react-table";
import "../common/scss/admin/events.scss";
import update from "immutability-helper";

import "react-table/react-table.css";
import "../common/scss/user-page.scss";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

class DocumentPostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      dataFileUpload: [],
      listProject: [],
      listProjectName: [],
      selectedProject: null,
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    // this.importExcelFile = this.importExcelFile.bind(this);
  }

  onFileChange(event) {
    event.preventDefault();

    this.setState({ selectedFile: event.target.files[0] });
  }

  onFileUpload(e) {
    e.preventDefault();
    AlerService.loadingPopup();
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    if (this.state.selectedFile) {
      formData.append(
        "myFile",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    } else {
      AlerService.errorPopup("Cảnh báo!", "Vui lòng chọn file");
    }

    if (this.state.selectedProject) {
      this.state.listProject.forEach((item) => {
        if (item.project_name === this.state.selectedProject) {
          formData.append("projectName", item.project_name);
          formData.append("projectCode", item.project_code);
          formData.append("categoryProjectCode", item.category_project_code);
          formData.append("status", item.status);
        }
      });
    } else {
      AlerService.errorPopup("Cảnh báo!", "Vui lòng chọn dự án");
    }
    this.props.importExcelFile(formData).then((res) => {
      AlerService.swal.close();
      if (!res.ok) {
        AlerService.errorPopup("Lỗi!", res.error);
      } else {
        this.setState(
          update(this.state, {
            selectedFile: {
              $set: null,
            },
          })
        );
        window.location.reload();
        AlerService.successPopup("Thành công!", "Import data thành công!");
      }
    });
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
    this.props.getDataFile().then((res) => {
      AlerService.swal.close();
      if (!res.ok) {
        AlerService.errorPopup("Lỗi!", res.error);
      } else {
        this.setState(
          update(this.state, {
            dataFileUpload: {
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
    const data = this.state.dataFileUpload || [];
    const listProject = this.state.listProject || [];
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-user" /> Cập nhật dữ liệu
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
          <div className="col-12">
            <div className="tile table-user-page" style={{ height: "auto" }}>
              <p>
                <b>Chọn file để cập nhật dữ liệu.</b>
              </p>
              <div className="form-group">
                <label>Chọn dự án</label>
                <Dropdown
                  options={this.state.listProjectName}
                  onChange={(e) => this.onChangeSelect(e)}
                  value={this.state.selectedProject}
                  placeholder="Select an option"
                />
              </div>
              <input type="file" onChange={this.onFileChange} />
              <button className="btn btn-primary" onClick={this.onFileUpload}>
                Tải lên!
              </button>
            </div>

            <div className="tile table-user-page" style={{ height: "auto" }}>
              <p>
                <b> Tải xuống dữ liệu.</b>
              </p>
              <ReactTable
                data={data}
                columns={[
                  {
                    Header: "Tên tài liệu",
                    accessor: "name",
                  },
                  {
                    Header: "Thời gian tải lên",
                    accessor: "timeUpload",
                  },
                  {
                    Header: "Tải xuống",
                    id: "source",
                    maxWidth: 100,
                    sortable: false,
                    className: "justify-content-center",
                    accessor: (d) => {
                      return (
                        <React.Fragment>
                          <div className="btn btn-info btn-delete">
                            <a href={`${d.source}`} style={{ color: "white" }}>
                              <i
                                className="fa fa-arrow-down"
                                aria-hidden="true"
                              />
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
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(DocumentPostPage);

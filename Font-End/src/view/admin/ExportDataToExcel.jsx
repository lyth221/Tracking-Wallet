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
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

class DocumentPostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      dataFileUpload: [],
      listProject: [],
      listProjectName: [],
      selectedProject: [],
      items: [],
      dataFileProjectSelected: [],
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    // this.importExcelFile = this.importExcelFile.bind(this);
  }

  onFileChange(event) {
    event.preventDefault();

    this.setState({ selectedFile: event.target.files[0] });
  }

  onChangeSelect(e) {
    let listItem = this.state.items
      .sort()
      .filter((item) => item.projectName === e.value);
    let project = this.state.listProject
      .sort()
      .filter((item) => item.project_name === e.value);

    let dataUpdate = [];
    if (project[0].category_project_code == "can_ho") {
      listItem.forEach((item) => {
        const element = {
          block: item.block,
          ma_bds: item.ma_bds,
          tang: item.tang,
          vi_tri: item.vi_tri,

          dtxd: item.dtxd,
          dtsd: item.dtsd,
          huong: item.huong,
          thiet_ke: item.thiet_ke,
          tong_gia_ban_no_vat: item.tong_gia_ban_no_vat.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          }),
          so_tien_chiet_khau: item.so_tien_chiet_khau.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          }),
          gia_ban_sau_ck_chua_vat: item.gia_ban_sau_ck_chua_vat.toLocaleString(
            "vi",
            {
              style: "currency",
              currency: "VND",
            }
          ),
          time_start: item.time_start,
          time_end: item.time_end,
          gi_chu: item.gi_chu,
        };
        dataUpdate.push(element);
      });
    } else if (project[0].category_project_code == "nha_pho") {
      listItem.forEach((item) => {
        const element = {
          mau_nha: item.mau_nha,
          ma_bds: item.ma_bds,
          phan_khu: item.phan_khu,
          vi_tri: item.vi_tri,

          dt_dat: item.dt_dat,
          dt_san_xay_dung: item.dt_san_xay_dung,
          huong: item.huong,
          huong_nhin: item.huong_nhin,
          lo_gioi: item.lo_gioi,
          tong_gia_ban_no_vat: item.tong_gia_ban_no_vat.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          }),
          so_tien_chiet_khau: item.so_tien_chiet_khau.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          }),
          gia_ban_sau_ck_chua_vat: item.gia_ban_sau_ck_chua_vat.toLocaleString(
            "vi",
            {
              style: "currency",
              currency: "VND",
            }
          ),
          time_start: item.time_start,
          time_end: item.time_end,
          gi_chu: item.gi_chu,
        };
        dataUpdate.push(element);
      });
    }
    this.setState(
      update(this.state, {
        selectedProject: {
          $set: project[0],
        },
        dataFileProjectSelected: {
          $set: dataUpdate,
        },
      })
    );
  }

  exportDataToExcel(event) {
    event.preventDefault();
    const csvData = this.state.dataFileProjectSelected;
    let dataExport = [];
    if (this.state.selectedProject.category_project_code == "can_ho") {
      csvData.forEach((item) => {
        const element = {
          Block: item.block,
          "Mã BĐS": item.ma_bds,
          Tầng: item.tang,
          "Vị trí": item.vi_tri,
          DTXD: item.dtxd,
          DTSD: item.dtsd,
          Hướng: item.huong,
          "Thiết kế": item.thiet_ke,
          "Giá bán chưa VAT": item.tong_gia_ban_no_vat,
          "Giá trị CK": item.so_tien_chiet_khau,
          "Giá bán chưa VAT sau CK": item.gia_ban_sau_ck_chua_vat,
          "Thời gian bắt đầu": item.time_start,
          "Thời gian kết thúc": item.time_end,
          "Gi chú": item.gi_chu,
        };
        dataExport.push(element);
      });
    } else if (this.state.selectedProject.category_project_code == "nha_pho") {
      csvData.forEach((item) => {
        const element = {
          "Mẫu nhà": item.mau_nha,
          "Mã BĐS": item.ma_bds,
          "Phân khu/LK": item.phan_khu,
          "Vị trí": item.vi_tri,
          "DT đất (m2)": item.dt_dat,
          "DT sàn xây dựng": item.dt_san_xay_dung,
          Hướng: item.huong,
          "Hướng nhìn": item.huong_nhin,
          "Lộ giới": item.lo_gioi,
          "Giá bán chưa VAT": item.tong_gia_ban_no_vat,
          "Giá trị CK": item.so_tien_chiet_khau,
          "Giá bán chưa VAT sau CK": item.gia_ban_sau_ck_chua_vat,
          "Thời gian bắt đầu": item.time_start,
          "Thời gian kết thúc": item.time_end,
          "Gi chú": item.gi_chu,
        };
        dataExport.push(element);
      });
    }

    const fileName = `${this.state.selectedProject.project_name}` + "-Full";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + "." + "csv");
  }

  componentDidMount() {
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

    this.props.prepareDataCallApi().then((res) => {
      if (res.ok) {
        this.setState((this.state.items = res.body));
      }
    });
  }

  render() {
    const data = this.state.dataFileUpload || [];
    const dataFile = this.state.dataFileProjectSelected;
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-user" /> Tải xuống dữ liệu
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
              <a href="#">Tải xuống dữ liệu</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="tile table-user-page" style={{ height: "auto" }}>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group">
                    <b>Chọn dự án</b>
                    <Dropdown
                      options={this.state.listProjectName}
                      onChange={(e) => this.onChangeSelect(e)}
                      value={this.state.selectedProject.project_name}
                      placeholder="Select an option"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{ paddingTop: "20px" }}>
                    <button
                      className="btn btn-primary"
                      onClick={(event) => this.exportDataToExcel(event)}
                    >
                      Tải xuống dữ liệu
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tile table-user-page" style={{ height: "auto" }}>
              <p>
                <b> Dữ liệu dự án {this.state.selectedProject.project_name}</b>
              </p>
              {this.state.selectedProject.category_project_code == "can_ho" ? (
                <ReactTable
                  data={this.state.dataFileProjectSelected}
                  columns={[
                    {
                      Header: "Block",
                      accessor: "block",
                      maxWidth: 80,
                      className: "justify-content-center",
                    },
                    {
                      Header: "Mã BĐS",
                      accessor: "ma_bds",
                    },
                    {
                      Header: "Tầng",
                      accessor: "tang",
                      maxWidth: 50,
                    },
                    {
                      Header: "Vị trí",
                      accessor: "vi_tri",
                    },
                    {
                      Header: "DTXD",
                      accessor: "dtxd",
                    },
                    {
                      Header: "DTSD",
                      accessor: "dtsd",
                    },
                    {
                      Header: "Hướng",
                      accessor: "huong",
                    },
                    {
                      Header: "Thiết kế",
                      accessor: "thiet_ke",
                    },
                    {
                      Header: "Giá bán chưa VAT",
                      accessor: "tong_gia_ban_no_vat",
                    },
                    {
                      Header: "Giá trị CK",
                      accessor: "so_tien_chiet_khau",
                    },
                    {
                      Header: "Giá bán chưa VAT sau CK",
                      accessor: "gia_ban_sau_ck_chua_vat",
                    },
                    {
                      Header: "Thời gian bắt đầu",
                      accessor: "time_start",
                    },

                    {
                      Header: "Thời gian kết thúc",
                      accessor: "time_end",
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
                  resizable={true}
                />
              ) : (
                ""
              )}
              {this.state.selectedProject.category_project_code == "nha_pho" ? (
                <ReactTable
                  data={this.state.dataFileProjectSelected}
                  columns={[
                    {
                      Header: "Mẫu nhà",
                      accessor: "mau_nha",
                      maxWidth: 80,
                      className: "justify-content-center",
                    },
                    {
                      Header: "Mã BĐS",
                      accessor: "ma_bds",
                    },
                    {
                      Header: "Phân khu/LK",
                      accessor: "phan_khu",
                    },
                    {
                      Header: "Vị trí",
                      accessor: "vi_tri",
                    },
                    {
                      Header: "DT đất",
                      accessor: "dt_dat",
                    },
                    {
                      Header: "DT Sàn xây dựng",
                      accessor: "dt_san_xay_dung",
                    },
                    {
                      Header: "Hướng",
                      accessor: "huong",
                    },
                    {
                      Header: "Hướng nhìn",
                      accessor: "huong_nhin",
                    },
                    {
                      Header: "Giá bán chưa VAT",
                      accessor: "tong_gia_ban_no_vat",
                    },
                    {
                      Header: "Giá trị CK",
                      accessor: "so_tien_chiet_khau",
                    },
                    {
                      Header: "Giá bán chưa VAT sau CK",
                      accessor: "gia_ban_sau_ck_chua_vat",
                    },
                    {
                      Header: "Thời gian bắt đầu",
                      accessor: "time_start",
                    },

                    {
                      Header: "Thời gian kết thúc",
                      accessor: "time_end",
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
                  resizable={true}
                />
              ) : (
                ""
              )}
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
  prepareDataCallApi,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(DocumentPostPage);

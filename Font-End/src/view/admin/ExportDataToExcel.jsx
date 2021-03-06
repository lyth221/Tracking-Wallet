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
          "M?? B??S": item.ma_bds,
          T???ng: item.tang,
          "V??? tr??": item.vi_tri,
          DTXD: item.dtxd,
          DTSD: item.dtsd,
          H?????ng: item.huong,
          "Thi???t k???": item.thiet_ke,
          "Gi?? b??n ch??a VAT": item.tong_gia_ban_no_vat,
          "Gi?? tr??? CK": item.so_tien_chiet_khau,
          "Gi?? b??n ch??a VAT sau CK": item.gia_ban_sau_ck_chua_vat,
          "Th???i gian b???t ?????u": item.time_start,
          "Th???i gian k???t th??c": item.time_end,
          "Gi ch??": item.gi_chu,
        };
        dataExport.push(element);
      });
    } else if (this.state.selectedProject.category_project_code == "nha_pho") {
      csvData.forEach((item) => {
        const element = {
          "M???u nh??": item.mau_nha,
          "M?? B??S": item.ma_bds,
          "Ph??n khu/LK": item.phan_khu,
          "V??? tr??": item.vi_tri,
          "DT ?????t (m2)": item.dt_dat,
          "DT s??n x??y d???ng": item.dt_san_xay_dung,
          H?????ng: item.huong,
          "H?????ng nh??n": item.huong_nhin,
          "L??? gi???i": item.lo_gioi,
          "Gi?? b??n ch??a VAT": item.tong_gia_ban_no_vat,
          "Gi?? tr??? CK": item.so_tien_chiet_khau,
          "Gi?? b??n ch??a VAT sau CK": item.gia_ban_sau_ck_chua_vat,
          "Th???i gian b???t ?????u": item.time_start,
          "Th???i gian k???t th??c": item.time_end,
          "Gi ch??": item.gi_chu,
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
        AlerService.errorPopup("L???i!", res.error);
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
              <i className="fa fa-user" /> T???i xu???ng d??? li???u
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
              <a href="#">T???i xu???ng d??? li???u</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="tile table-user-page" style={{ height: "auto" }}>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group">
                    <b>Ch???n d??? ??n</b>
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
                      T???i xu???ng d??? li???u
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tile table-user-page" style={{ height: "auto" }}>
              <p>
                <b> D??? li???u d??? ??n {this.state.selectedProject.project_name}</b>
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
                      Header: "M?? B??S",
                      accessor: "ma_bds",
                    },
                    {
                      Header: "T???ng",
                      accessor: "tang",
                      maxWidth: 50,
                    },
                    {
                      Header: "V??? tr??",
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
                      Header: "H?????ng",
                      accessor: "huong",
                    },
                    {
                      Header: "Thi???t k???",
                      accessor: "thiet_ke",
                    },
                    {
                      Header: "Gi?? b??n ch??a VAT",
                      accessor: "tong_gia_ban_no_vat",
                    },
                    {
                      Header: "Gi?? tr??? CK",
                      accessor: "so_tien_chiet_khau",
                    },
                    {
                      Header: "Gi?? b??n ch??a VAT sau CK",
                      accessor: "gia_ban_sau_ck_chua_vat",
                    },
                    {
                      Header: "Th???i gian b???t ?????u",
                      accessor: "time_start",
                    },

                    {
                      Header: "Th???i gian k???t th??c",
                      accessor: "time_end",
                    },
                  ]}
                  defaultPageSize={10}
                  className="table"
                  rowsText="H??ng"
                  pageText="Trang"
                  ofText="trong t???ng s???"
                  noDataText="D??? li???u r???ng"
                  previousText="Quay l???i"
                  nextText="Trang ti???p"
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
                      Header: "M???u nh??",
                      accessor: "mau_nha",
                      maxWidth: 80,
                      className: "justify-content-center",
                    },
                    {
                      Header: "M?? B??S",
                      accessor: "ma_bds",
                    },
                    {
                      Header: "Ph??n khu/LK",
                      accessor: "phan_khu",
                    },
                    {
                      Header: "V??? tr??",
                      accessor: "vi_tri",
                    },
                    {
                      Header: "DT ?????t",
                      accessor: "dt_dat",
                    },
                    {
                      Header: "DT S??n x??y d???ng",
                      accessor: "dt_san_xay_dung",
                    },
                    {
                      Header: "H?????ng",
                      accessor: "huong",
                    },
                    {
                      Header: "H?????ng nh??n",
                      accessor: "huong_nhin",
                    },
                    {
                      Header: "Gi?? b??n ch??a VAT",
                      accessor: "tong_gia_ban_no_vat",
                    },
                    {
                      Header: "Gi?? tr??? CK",
                      accessor: "so_tien_chiet_khau",
                    },
                    {
                      Header: "Gi?? b??n ch??a VAT sau CK",
                      accessor: "gia_ban_sau_ck_chua_vat",
                    },
                    {
                      Header: "Th???i gian b???t ?????u",
                      accessor: "time_start",
                    },

                    {
                      Header: "Th???i gian k???t th??c",
                      accessor: "time_end",
                    },
                  ]}
                  defaultPageSize={10}
                  className="table"
                  rowsText="H??ng"
                  pageText="Trang"
                  ofText="trong t???ng s???"
                  noDataText="D??? li???u r???ng"
                  previousText="Quay l???i"
                  nextText="Trang ti???p"
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

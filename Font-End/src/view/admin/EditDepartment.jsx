import React from "react";
import DashboardIcon from "./DashboardIcon.jsx";
import { getCountSearch } from "../redux/admin.jsx";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import update from "immutability-helper";
import io from "socket.io-client";
import AlerService from "../common/js/AlertService.js";
import Dropdown from "react-dropdown";
import { geDepartment } from "../../view/redux/importExcel.jsx";
import { prepareDataCallApi } from "../../view/redux/importExcel.jsx";
import { getListProject } from "../redux/project.jsx";
import { getListImage } from "../redux/image.jsx";
import { checkToken } from "../redux/user.jsx";
import "react-dropdown/style.css";
import "../common/scss/editDepartments.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../common/scss/user-page.scss";
import "../common/scss/admin/events.scss";
class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventPending: 0,
      messageNotify: "",
      open: false,
      numberSearch: 0,
      listProjectName: [],
      listProject: [],
      suggestions: [],
      text: "",
      items: [],
      selectProjectShowForm: null,
      listItemSearch: [],
      ma_bds: null,
      dtxd: null,
      dtsd: null,
      thiet_ke: null,
      tong_gia_ban_no_vat: null,
      gia_ban_sau_ck_chua_vat: null,
      so_tien_chiet_khau: null,
      time_start: null,
      time_end: null,
      fromDate: null,
      timeSearch: null,
      listHistoryPrice: [],
    };
    this.onChangeData = this.onChangeData.bind(this);
    this.onTextChanged = this.onTextChanged.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }
  componentDidMount() {
    this.props.getListProject().then((res) => {
      if (!res.ok) {
        AlertService.errorPopup("Lỗi!", res.error);
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

  onSearch(e) {
    e.preventDefault();
    const projectCode = this.state.text;

    this.props.checkToken().then((res) => {
      if (res.ok) {
        AlertService.errorPopup(
          "Warning!",
          "Phiên làm việc hết hạn, Vui lòng đăng nhập lại",
          (cb) => {
            AuthenticateService.removeAuthenticate();
          }
        );
      } else {
        this.props.geDepartment(projectCode).then((res) => {
          let item = res.body[0];
          let gia_ban_sau_ck_chua_vat = null;
          let tong_gia_ban_no_vat = null;
          let so_tien_chiet_khau = null;

          if (item.tong_gia_ban_no_vat != null) {
            tong_gia_ban_no_vat = item.tong_gia_ban_no_vat.toLocaleString(
              "vi",
              {
                style: "currency",
                currency: "VND",
              }
            );
          }
          if (item.so_tien_chiet_khau != null) {
            so_tien_chiet_khau = item.so_tien_chiet_khau.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
          }
          if (item.gia_ban_sau_ck_chua_vat != null) {
            gia_ban_sau_ck_chua_vat = item.gia_ban_sau_ck_chua_vat.toLocaleString(
              "vi",
              {
                style: "currency",
                currency: "VND",
              }
            );
          }

          this.setState(
            update(this.state, {
              ma_bds: { $set: item.ma_bds },
              dtxd: { $set: item.dtxd },
              dtsd: { $set: item.dtsd },
              thiet_ke: { $set: item.thiet_ke },
              tong_gia_ban_no_vat: {
                $set: tong_gia_ban_no_vat,
              },
              gia_ban_sau_ck_chua_vat: {
                $set: gia_ban_sau_ck_chua_vat,
              },
              so_tien_chiet_khau: {
                $set: so_tien_chiet_khau,
              },
              time_start: { $set: item.time_start },
              time_end: { $set: item.time_end },
              fromDate: { $set: item.fromDate },
              timeSearch: { $set: item.timeSearch },
              listHistoryPrice: { $set: item.historyPrice },
            })
          );
        });
      }
    });
  }

  onTextChanged(e) {
    const value = e.target.value;
    let suggestions = [];
    let valueUpdate = null;
    if (value.length > 0) {
      const regex = new RegExp(`${value.toUpperCase()}`, "g");
      suggestions = this.state.listItemSearch
        .sort()
        .filter((v) => regex.test(v.ma_bds));
    }
    this.setState(() => ({ suggestions, text: value }));
  }

  suggestionSelected(value) {
    this.setState(() => ({
      text: value.ma_bds,
      suggestions: [],
    }));
  }

  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <div className="srchList" style={{ paddingBottom: "30px" }}>
        <ul>
          {suggestions.map((item) => (
            <li
              key={item.ma_bds}
              onClick={() => this.suggestionSelected(item)}
              className="srchList-li"
            >
              {item.ma_bds}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  onChangeSelect(e) {
    let listItem = this.state.items
      .sort()
      .filter((item) => item.projectName === e.value);

    let projectCode = null;
    this.state.listProject.forEach((item) => {
      if (item.projectName === e.value) {
        projectCode = item.projectCode;
      }
    });

    this.setState(
      update(this.state, {
        selectedProject: {
          $set: e.value,
        },
        listItemSearch: {
          $set: listItem,
        },
        selectProjectShowForm: {
          $set: projectCode,
        },
      })
    );
  }
  onChangeData(e, key) {
    e.preventDefault();
    this.setState(
      update(this.state, {
        [key]: { $set: e.target.value },
      })
    );
  }

  render() {
    const { numberSearch, messageNotify, text, listHistoryPrice } = this.state;
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-dashboard" /> Chỉnh sửa căn hộ
            </h1>
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <li className="breadcrumb-item">
              <i className="fa fa-home fa-lg" />
            </li>
            <li className="breadcrumb-item">
              <a href="#">Chỉnh sửa căn hộ</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-md-12" />
        </div>
        <div className="row ">
          <div className="col-md-12">
            <div style={{ paddingBottom: "30px" }}>
              <form class="navbar-form" style={{ paddingBottom: "30px" }}>
                <div className="input-group">
                  <Dropdown
                    options={this.state.listProjectName}
                    onChange={(e) => this.onChangeSelect(e)}
                    value={this.state.selectedProject}
                    placeholder="Chọn dự án"
                  />
                  <input
                    className="form-control searchbox"
                    type="text"
                    id=""
                    name="search"
                    placeholder="Nhập mã dự án"
                    value={text}
                    onChange={this.onTextChanged}
                    autoComplete="off"
                    style={{ paddingTop: "16px !important" }}
                  />
                  <span className="input-group-btn ">
                    <button
                      type="submit"
                      class="btn btn-primary"
                      onClick={(e) => this.onSearch(e)}
                      style={{ borderRadius: " 0px 5px 5px 0px" }}
                    >
                      <span
                        className="fa fa-search"
                        aria-hidden="true"
                        style={{
                          paddingBottom: "8.5px",
                          paddingRight: "5px",
                        }}
                      />
                      <span>Tìm kiếm</span>
                    </button>
                  </span>
                </div>
              </form>
              {this.renderSuggestions()}
            </div>
            <div className="app-title">
              <div />
              <div className="form-group">
                <label>
                  <strong>Mã dự án</strong>
                </label>
                <input
                  onChange={(e) => this.onChangeData(e, "ma_bds")}
                  type="email"
                  className="form-control"
                  style={{ width: "95%" }}
                  value={this.state.ma_bds}
                />
              </div>
              <div className="form-group">
                <label>
                  <strong>Giá chưa VAT</strong>{" "}
                </label>
                <input
                  onChange={(e) => this.onChangeData(e, "tong_gia_ban_no_vat")}
                  type="email"
                  className="form-control"
                  style={{ width: "95%" }}
                  value={this.state.tong_gia_ban_no_vat}
                />
              </div>
              <div className="form-group">
                <label>
                  <strong>Giá trị CK</strong>
                </label>
                <input
                  onChange={(e) => this.onChangeData(e, "so_tien_chiet_khau")}
                  type="email"
                  className="form-control"
                  style={{ width: "95%" }}
                  value={this.state.so_tien_chiet_khau}
                />
              </div>
              <div className="form-group">
                <label>
                  <strong>Giá CK chưa VAT</strong>
                </label>
                <input
                  onChange={(e) =>
                    this.onChangeData(e, "gia_ban_sau_ck_chua_vat")
                  }
                  type="email"
                  className="form-control"
                  style={{ width: "95%" }}
                  value={this.state.gia_ban_sau_ck_chua_vat}
                />
              </div>
              <div className="form-group" style={{ paddingRight: "10px" }}>
                <label>
                  <strong>Thời gian bắt đầu</strong>
                </label>
                <DatePicker
                  selected={this.state.searchTime}
                  placeholderText="Chọn thời gian"
                  dateFormat="dd/MM/yyyy"
                  onChange={(time) =>
                    this.onChangeDataTime(
                      { target: { value: time } },
                      "searchTime"
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  <strong>Thời gian kết thúc</strong>
                </label>
                <DatePicker
                  selected={this.state.searchTime}
                  placeholderText="Chọn thời gian"
                  dateFormat="dd/MM/yyyy"
                  onChange={(time) =>
                    this.onChangeDataTime(
                      { target: { value: time } },
                      "searchTime"
                    )
                  }
                />
              </div>
              <div className="row">
                <button
                  className="btn btn-primary"
                  onClick={(e) => this.onSubmmit(e)}
                >
                  Cập nhật!
                </button>
              </div>
            </div>
            <hr />
            <div className="app-title">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col">Mã dự án</th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Giá chưa VAT</th>
                    <th scope="col">Giá chiết khấu</th>
                    <th scope="col">Giá CK chưa VAT</th>
                  </tr>
                </thead>
                <tbody>
                  <th scope="row">{this.state.ma_bds}</th>
                  {this.state.selectedProject != null ? (
                    <td style={{ fontSize: "14px" }}>
                      <b>Hiện tại</b>
                    </td>
                  ) : (
                    ""
                  )}
                  <td>{this.state.tong_gia_ban_no_vat}</td>
                  <td>{this.state.so_tien_chiet_khau}</td>
                  <td>{this.state.gia_ban_sau_ck_chua_vat}</td>
                  {this.state.listHistoryPrice.map((item, key) => (
                    <tr>
                      <th scope="row">{this.state.ma_bds}</th>
                      <td>{item.date}</td>
                      <td>
                        {item.tong_gia_ban_no_vat.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>
                        {item.so_tien_chiet_khau.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>
                        {item.gia_ban_sau_ck_chua_vat.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  getCountSearch,
  prepareDataCallApi,
  geDepartment,
  getListProject,
  getListImage,
  checkToken,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(DashboardPage);

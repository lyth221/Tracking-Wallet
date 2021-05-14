import React from "react";
import DashboardIcon from "./DashboardIcon.jsx";
import { getCountSearch } from "../redux/admin.jsx";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import update from "immutability-helper";
import ReactTable from "react-table";
import io from "socket.io-client";
import AlerService from "../common/js/AlertService.js";
import Dropdown from "react-dropdown";
import { getProject } from "../../view/redux/importExcel.jsx";
import { prepareDataCallApi } from "../../view/redux/importExcel.jsx";
import { getListProject } from "../redux/project.jsx";
import { getListImage } from "../redux/image.jsx";
import { checkToken, getListUser } from "../redux/user.jsx";
import { getLogs } from "../redux/logs.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-dropdown/style.css";
import "../common/scss/admin/events.scss";
import "../common/scss/editDepartments.scss";
import "react-table/react-table.css";
import "../common/scss/user-page.scss";
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
      dataRender: [],
      searchTime: null,
      listUser: [],
      userSelected: null,
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
              $set: listProjectName.sort(),
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

    this.props.getListUser().then((res) => {
      let listUser = [];
      res.body.data.forEach((item) => {
        listUser.push(item.email);
      });
      this.setState(
        update(this.state, {
          listUser: {
            $set: listUser.sort(),
          },
        })
      );
    });
  }

  onSearch(e) {
    e.preventDefault();
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
        const dataApi = {
          projectCode: this.state.selectProjectShowForm,
          user: this.state.userSelected,
          departmentCode: this.state.text,
          timeSearch: this.state.searchTime,
        };
        this.props.getLogs(dataApi).then((res) => {
          let item = res.body;
          let dataRender = [];
          item.forEach((item) => {
            let element = {
              ma_bds: item.data_return.ma_bds,
              time_search: item.data_return.timeSearch,
              user_name: item.user_name,
              tong_gia_ban_no_vat: item.data_return.tong_gia_ban_no_vat.toLocaleString(
                "vi",
                {
                  style: "currency",
                  currency: "VND",
                }
              ),
              so_tien_chiet_khau: item.data_return.so_tien_chiet_khau.toLocaleString(
                "vi",
                {
                  style: "currency",
                  currency: "VND",
                }
              ),
              gia_ban_sau_ck_chua_vat: item.data_return.gia_ban_sau_ck_chua_vat.toLocaleString(
                "vi",
                {
                  style: "currency",
                  currency: "VND",
                }
              ),
            };
            dataRender.push(element);
          });
          this.setState(
            update(this.state, {
              dataRender: {
                $set: dataRender,
              },
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
  onChangeDataTime(e, key) {
    if (key === "searchTime") {
      const { searchTime } = this.state;
      this.setState(
        update(this.state, {
          searchTime: { $set: e.target.value },
        })
      );
    }
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
      <div className="srchList">
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

  onChangeSelect(e, key) {
    if (key === "project") {
      let listItem = this.state.items
        .sort()
        .filter((item) => item.project_name === e.value);

      let projectCode = null;
      this.state.listProject.forEach((item) => {
        if (item.project_name === e.value) {
          projectCode = item.project_code;
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
    if (key === "user") {
      this.setState(
        update(this.state, {
          userSelected: {
            $set: e.value,
          },
        })
      );
    }
  }
  onChangeData(e) {
    e.preventDefault();
    this.setState(
      update(this.state, {
        messageNotify: { $set: e.target.value },
      })
    );
  }

  render() {
    const {
      numberSearch,
      messageNotify,
      text,
      listHistoryPrice,
      dataRender,
    } = this.state;
    return (
      <main className="app-content">
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-dashboard" /> Lịch sử tìm kiếm
            </h1>
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <li className="breadcrumb-item">
              <i className="fa fa-home fa-lg" />
            </li>
            <li className="breadcrumb-item">
              <a href="#">Lịch sử tìm kiếm</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-md-12 ">
            <div className="app-tile">
              <div className="row">
                <div className="col-md-3">
                  <Dropdown
                    options={this.state.listProjectName}
                    onChange={(e) => this.onChangeSelect(e, "project")}
                    value={this.state.selectedProject}
                    placeholder="Chọn dự án"
                  />
                </div>
                <div className="col-md-4">
                  <Dropdown
                    options={this.state.listUser}
                    onChange={(e) => this.onChangeSelect(e, "user")}
                    value={this.state.userSelected}
                    placeholder="Chọn người dùng"
                  />
                </div>
                <div className="col-md-3">
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
                  {this.renderSuggestions()}
                </div>

                <div className="col-md-2">
                  <span className="input-group-btn ">
                    <button
                      type="submit"
                      class="btn btn-primary"
                      onClick={(e) => this.onSearch(e)}
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
                <div />
              </div>

              <div className="row" style={{ paddingTop: "10px" }}>
                <div className="col-md-4 form-group">
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
              </div>
            </div>
            <form class="navbar-form">
              <div className="input-group" style={{ paddingBottom: "40px" }} />
            </form>
            <div className="app-title table-user-page">
              <ReactTable
                data={dataRender}
                columns={[
                  {
                    Header: "Mã dự án",
                    accessor: "ma_bds",
                    className: "justify-content-center header",
                  },
                  {
                    Header: "Thời gian tìm kiếm",
                    accessor: "time_search",
                    className: "justify-content-center",
                  },
                  {
                    Header: "User tìm kiếm",
                    accessor: "user_name",
                    className: "justify-content-center header",
                  },
                  {
                    Header: "Giá chưa VAT",
                    accessor: "tong_gia_ban_no_vat",
                    className: "justify-content-center",
                  },
                  {
                    Header: "Giá chiết khấu",
                    accessor: "so_tien_chiet_khau",
                    className: "justify-content-center",
                  },
                  {
                    Header: "Giá CK chưa VAT",
                    accessor: "gia_ban_sau_ck_chua_vat",
                    className: "justify-content-center",
                  },
                ]}
                defaultPageSize={15}
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
  getCountSearch,
  prepareDataCallApi,
  getProject,
  getListProject,
  getListImage,
  checkToken,
  getListUser,
  getLogs,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(DashboardPage);

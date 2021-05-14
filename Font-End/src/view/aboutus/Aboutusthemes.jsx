import React from "react";
import { connect } from "react-redux";
import "../common/scss/index.scss";
import io from "socket.io-client";
import { geDepartment } from "../../view/redux/importExcel.jsx";
import { prepareDataCallApi } from "../../view/redux/importExcel.jsx";
import { getListProjectFromUser, getProject } from "../redux/project.jsx";
import { getListImage } from "../redux/image.jsx";
import { checkToken } from "../redux/user.jsx";
import { AuthenticateService } from "../common/js/AuthenticateService";
import Select from "react-select";
import AlertService from "../common/js/AlertService";
import update from "immutability-helper";
import moment from "react-moment";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
const socket = io("https://sale.angia.com.vn:9443");
class AboutUsthemes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      informationApartment: {
        block: null,
        tang: null,
        thiet_ke: null,
        dtxd: null,
        dtsd: null,
        tong_gia_ban_no_vat: null,
        so_tien_chiet_khau: null,
        gia_ban_sau_ck_chua_vat: null,
      },
      informationHouse: {
        mau_nha: null,
        phan_khu: null,
        lo_gioi: null,
        dt_dat: null,
        dt_san_xay_dung: null,
        tong_gia_ban_no_vat: null,
        so_tien_chiet_khau: null,
        gia_ban_sau_ck_chua_vat: null,
      },
      informationAll: {
        ma_bds: null,
        vi_tri: null,
        huong: null,
        huong_nhin: null,
        gi_chu: null,
        time_start: null,
        time_end: null,
      },
      items: [],
      suggestions: [],
      text: "",

      fromDate: null,
      toDate: null,
      timeSearch: null,
      listProjectName: [],
      listProject: [],
      selectedProject: null,
      listItemSearch: [],
      dataImageUpload: [],
      imageRender: null,
      selectProjectShowForm: null,
    };
    this.onTextChanged = this.onTextChanged.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onTextChanged(e) {
    e.preventDefault();
    this.setState(
      update(this.state, {
        informationApartment: {
          block: { $set: null },
          tang: { $set: null },
          thiet_ke: { $set: null },
          dtxd: { $set: null },
          dtsd: { $set: null },
          tong_gia_ban_no_vat: { $set: null },
          so_tien_chiet_khau: { $set: null },
          gia_ban_sau_ck_chua_vat: { $set: null },
        },
        informationHouse: {
          mau_nha: { $set: null },
          phan_khu: { $set: null },
          lo_gioi: { $set: null },
          dt_dat: { $set: null },
          dt_san_xay_dung: { $set: null },
          tong_gia_ban_no_vat: { $set: null },
          so_tien_chiet_khau: { $set: null },
          gia_ban_sau_ck_chua_vat: { $set: null },
        },
        informationAll: {
          ma_bds: { $set: null },
          vi_tri: { $set: null },
          huong: { $set: null },
          huong_nhin: { $set: null },
          gi_chu: { $set: null },
          time_start: { $set: null },
          time_end: { $set: null },
        },
      })
    );
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

  onSearch(e) {
    e.preventDefault();
    const departmentCode = this.state.text;
    if (departmentCode == "") {
      alert("Vui lòng nhập Mã bất động sản");
      return;
    }
    this.setState(
      update(this.state, {
        informationApartment: {
          block: { $set: null },
          tang: { $set: null },
          thiet_ke: { $set: null },
          dtxd: { $set: null },
          dtsd: { $set: null },
          tong_gia_ban_no_vat: { $set: null },
          so_tien_chiet_khau: { $set: null },
          gia_ban_sau_ck_chua_vat: { $set: null },
        },
        informationHouse: {
          mau_nha: { $set: null },
          phan_khu: { $set: null },
          lo_gioi: { $set: null },
          dt_dat: { $set: null },
          dt_san_xay_dung: { $set: null },
          tong_gia_ban_no_vat: { $set: null },
          so_tien_chiet_khau: { $set: null },
          gia_ban_sau_ck_chua_vat: { $set: null },
        },
        informationAll: {
          ma_bds: { $set: null },
          vi_tri: { $set: null },
          huong: { $set: null },
          huong_nhin: { $set: null },
          gi_chu: { $set: null },
          time_start: { $set: null },
          time_end: { $set: null },
        },
      })
    );
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
        this.props.geDepartment(departmentCode).then((res) => {
          let item = res.body[0];
          let flag = true;
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
              informationAll: {
                ma_bds: { $set: item.ma_bds },
                vi_tri: { $set: item.vi_tri },
                huong: { $set: item.huong },
                huong_nhin: { $set: item.huong_nhin },
                time_end: { $set: item.time_end },
                time_start: { $set: item.time_start },
              },
              fromDate: { $set: item.fromDate },
              toDate: { $set: item.toDate },
              timeSearch: { $set: item.timeSearch },
            })
          );
          if (item.checkTimeShow) {
            if (
              this.state.selectProjectShowForm.category_project_code == "can_ho"
            ) {
              this.setState(
                update(this.state, {
                  informationApartment: {
                    block: { $set: item.block },
                    tang: { $set: item.tang },
                    thiet_ke: { $set: item.thiet_ke },
                    dtxd: { $set: item.dtxd },
                    dtsd: { $set: item.dtsd },
                    tong_gia_ban_no_vat: { $set: tong_gia_ban_no_vat },
                    so_tien_chiet_khau: { $set: so_tien_chiet_khau },
                    gia_ban_sau_ck_chua_vat: { $set: gia_ban_sau_ck_chua_vat },
                  },
                })
              );
            } else if (
              this.state.selectProjectShowForm.category_project_code ==
              "nha_pho"
            ) {
              this.setState(
                update(this.state, {
                  informationHouse: {
                    mau_nha: { $set: item.mau_nha },
                    phan_khu: { $set: item.phan_khu },
                    lo_gioi: { $set: item.lo_gioi },
                    dt_dat: { $set: item.dt_dat },
                    dt_san_xay_dung: { $set: item.dt_san_xay_dung },
                    tong_gia_ban_no_vat: { $set: tong_gia_ban_no_vat },
                    so_tien_chiet_khau: { $set: so_tien_chiet_khau },
                    gia_ban_sau_ck_chua_vat: { $set: gia_ban_sau_ck_chua_vat },
                  },
                })
              );
            }
          } else {
            if (
              this.state.selectProjectShowForm.category_project_code == "can_ho"
            ) {
              this.setState(
                update(this.state, {
                  informationApartment: {
                    block: { $set: item.block },
                    tang: { $set: item.tang },
                    thiet_ke: { $set: item.thiet_ke },
                    dtxd: { $set: item.dtxd },
                    dtsd: { $set: item.dtsd },
                  },
                })
              );
            } else if (
              this.state.selectProjectShowForm.category_project_code ==
              "nha_pho"
            ) {
              this.setState(
                update(this.state, {
                  informationHouse: {
                    mau_nha: { $set: item.mau_nha },
                    phan_khu: { $set: item.phan_khu },
                    lo_gioi: { $set: item.lo_gioi },
                    dt_dat: { $set: item.dt_dat },
                    dt_san_xay_dung: { $set: item.dt_san_xay_dung },
                  },
                })
              );
            }
          }
        });
      }
    });
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

  onChangeSelect(e) {
    let listItem = this.state.items
      .sort()
      .filter((item) => item.projectName === e.value);

    let image = this.state.dataImageUpload.filter(
      (item) => item.projectName === e.value
    );
    let projectCode = null;
    let projectId = null;
    this.state.listProject.forEach((item) => {
      if (item.projectName === e.value) {
        projectCode = item.projectCode;
        projectId = item.projectId;
      }
    });

    this.setState(
      update(this.state, {
        selectedProject: {
          $set: projectCode,
        },
      })
    );

    this.props.getProject(projectId).then((res) => {
      this.setState(
        update(this.state, {
          selectProjectShowForm: {
            $set: res.body.data[0],
          },
        })
      );
    });

    if (image.length > 0 && projectCode != null) {
      this.setState(
        update(this.state, {
          imageRender: {
            $set: image[0].sourceUrl,
          },
          listItemSearch: {
            $set: listItem,
          },
        })
      );
    } else {
      this.setState(
        update(this.state, {
          imageRender: {
            $set: "/img/logo-angia-moi.jpg",
          },
          listItemSearch: {
            $set: listItem,
          },
        })
      );
    }
  }

  renderFormApartment() {
    const {
      informationAll,
      informationHouse,
      informationApartment,
    } = this.state;
    // const  = this.state.informationApartment || [];
    return (
      <table className="table table-borderless">
        <tbody>
          <tr>
            <td className="td-image">
              <img
                src={this.state.imageRender}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </td>
            <td
              className="td-price"
              style={{
                fontSize: "22px",
                textAlign: "left",
                paddingTop: "50px",
                width: "40%",
              }}
            >
              <b>PHIẾU GIÁ</b>
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: "14px" }}>Mã bất động sản:</td>
            <td style={{ fontSize: "16px" }}>
              <b>{informationAll.ma_bds}</b>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "14px" }}>Diện tích xây dựng:</td>
            <td style={{ fontSize: "14px" }}>
              {" "}
              {informationApartment.dtxd} m&#178;
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "14px" }}>Diện tích sử dụng:</td>
            <td style={{ fontSize: "14px" }}>
              {" "}
              {informationApartment.dtsd} m&#178;
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "14px" }}>Thiết kế:</td>
            <td style={{ fontSize: "14px" }}>
              {informationApartment.thiet_ke}
            </td>
          </tr>
          {informationApartment.tong_gia_ban_no_vat != null &&
          informationApartment.tong_gia_ban_no_vat != "" ? (
            <tr>
              <td style={{ fontSize: "14px", width: "50%" }}>
                Giá trị ban hành chưa VAT:
              </td>
              <td style={{ fontSize: "14px" }}>
                {" "}
                {informationApartment.tong_gia_ban_no_vat}{" "}
              </td>
            </tr>
          ) : (
            ""
          )}
          {informationApartment.so_tien_chiet_khau != null &&
          informationApartment.so_tien_chiet_khau != "" ? (
            <tr>
              <td style={{ fontSize: "14px", width: "50%" }}>
                Giá trị chiết khấu:
              </td>
              <td style={{ fontSize: "14px" }}>
                {" "}
                {informationApartment.so_tien_chiet_khau}{" "}
              </td>
            </tr>
          ) : (
            ""
          )}
          {informationApartment.gia_ban_sau_ck_chua_vat != null &&
          informationApartment.gia_ban_sau_ck_chua_vat != "" ? (
            <tr>
              <td style={{ fontSize: "14px", width: "50%" }}>
                Giá trị sau CK chưa VAT:
              </td>
              <td style={{ fontSize: "14px" }}>
                {informationApartment.gia_ban_sau_ck_chua_vat}{" "}
              </td>
            </tr>
          ) : (
            ""
          )}
          {this.state.toDate != null || this.state.fromDate != null ? (
            <tr>
              <td colSpan="2" style={{ fontSize: "14px", color: "red" }}>
                Thời gian hiệu lực: <b> {this.state.fromDate} </b> đến{" "}
                <b>{this.state.toDate}</b>
              </td>
            </tr>
          ) : (
            ""
          )}
          {this.state.timeSearch != null ? (
            <tr>
              <td colSpan="2" style={{ fontSize: "14px", color: "blue" }}>
                Thời gian tìm kiếm: <b> {this.state.timeSearch} </b>
              </td>
            </tr>
          ) : (
            ""
          )}
        </tbody>
      </table>
    );
  }

  renderFormHouse() {
    const { informationAll, informationHouse } = this.state;
    return (
      <table className="table table-borderless">
        <tbody>
          <tr>
            <td className="td-image">
              <img
                src={this.state.imageRender}
                style={{
                  justifyContent: "left",
                  alignItems: "left",
                  width: "60%",
                }}
              />
            </td>
            <td
              className="td-price"
              style={{
                fontSize: "22px",
                textAlign: "left",
                paddingTop: "50px",
                width: "40%",
              }}
            >
              <b>PHIẾU GIÁ</b>
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: "14px", width: "50%" }}>Mã sản phẩm:</td>
            <td style={{ fontSize: "16px" }}>
              <b>{informationAll.ma_bds}</b>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "14px" }}>Diện tích đất:</td>
            <td style={{ fontSize: "14px" }}>
              {" "}
              {informationHouse.dt_dat} m&#178;
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "14px" }}>Diện tích sàn Xây dựng:</td>
            <td style={{ fontSize: "14px" }}>
              {" "}
              {informationHouse.dt_san_xay_dung} m&#178;
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "14px" }}>Hướng:</td>
            <td style={{ fontSize: "14px" }}>{informationAll.huong}</td>
          </tr>
          <tr>
            <td style={{ fontSize: "14px" }}>Lộ giới:</td>
            <td style={{ fontSize: "14px" }}>{informationHouse.lo_gioi}</td>
          </tr>
          {informationHouse.tong_gia_ban_no_vat != null &&
          informationHouse.tong_gia_ban_no_vat != "" ? (
            <tr>
              <td style={{ fontSize: "14px", width: "50%" }}>
                Giá trị chuyển nhượng QSDĐ + Nhà Chưa VAT:
              </td>
              <td style={{ fontSize: "14px" }}>
                {" "}
                {informationHouse.tong_gia_ban_no_vat}{" "}
              </td>
            </tr>
          ) : (
            ""
          )}
          {informationHouse.so_tien_chiet_khau != null &&
          informationHouse.so_tien_chiet_khau != "" ? (
            <tr>
              <td style={{ fontSize: "14px", width: "50%" }}>
                Giá trị chiết khấu:
              </td>
              <td style={{ fontSize: "14px" }}>
                {" "}
                {informationHouse.so_tien_chiet_khau}
              </td>
            </tr>
          ) : (
            ""
          )}
          {informationHouse.gia_ban_sau_ck_chua_vat != null &&
          informationHouse.gia_ban_sau_ck_chua_vat != "" ? (
            <tr>
              <td style={{ fontSize: "14px", width: "50%" }}>
                Giá trị chuyển nhượng QSDĐ + Nhà Chưa VAT Sau CK:
              </td>
              <td style={{ fontSize: "14px" }}>
                {informationHouse.gia_ban_sau_ck_chua_vat}{" "}
              </td>
            </tr>
          ) : (
            ""
          )}
          {this.state.toDate != null || this.state.fromDate != null ? (
            <tr>
              <td colSpan="2" style={{ fontSize: "14px", color: "red" }}>
                Thời gian hiệu lực: <b> {this.state.fromDate} </b> đến{" "}
                <b>{this.state.toDate}</b>
              </td>
            </tr>
          ) : (
            ""
          )}
          {this.state.timeSearch != null ? (
            <tr>
              <td colSpan="2" style={{ fontSize: "14px", color: "blue" }}>
                Thời gian tìm kiếm: <b> {this.state.timeSearch} </b>
              </td>
            </tr>
          ) : (
            ""
          )}
        </tbody>
      </table>
    );
  }
  renderFormShowPrice() {
    const project = this.state.selectProjectShowForm || {};
    return (
      <div className="col-md-12">
        {project.category_project_code == "can_ho"
          ? this.renderFormApartment()
          : ""}
        {project.category_project_code == "nha_pho"
          ? this.renderFormHouse()
          : ""}
      </div>
    );
  }

  componentWillMount() {
    socket.on("broadcast", (res) => {
      AlertService.notifyPopup("Thông báo!", `${res}`, (cb) => {
        AuthenticateService.removeAuthenticate();
      });
    });

    socket.on("logout", (res) => {
      AlertService.notifyPopup("Thông báo!", `${res}`, (cb) => {
        AuthenticateService.removeAuthenticate();
      });
    });

    addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("myBtn").click();
      }
    });

    var myFunc = window.setInterval(function() {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      const orientation = widthThreshold ? "vertical" : "horizontal";
      if (
        !(heightThreshold && widthThreshold) &&
        ((window.Firebug &&
          window.Firebug.chrome &&
          window.Firebug.chrome.isInitialized) ||
          widthThreshold ||
          heightThreshold)
      ) {
        AlertService.errorPopup(
          "Warning",
          "Vui lòng tắt chức năng Inspect/Xem phần tử trên trình duyệt và Refresh lại trang."
        );
        window.event.returnValue = false;
      }
    }, 1000);
  }

  componentDidMount() {
    this.props.checkToken().then((res) => {
      if (res.ok) {
        AlertService.errorPopup(
          "Warning!",
          "Phiên làm việc hết hạn, Vui lòng đăng nhập lại",
          (cb) => {
            AuthenticateService.removeAuthenticate();
          }
        );
      }
    });
    this.props.prepareDataCallApi().then((res) => {
      if (res.ok) {
        this.setState((this.state.items = res.body));
      }
    });

    this.props.getListProjectFromUser().then((res) => {
      // AlertService.swal.close();
      if (!res.ok) {
        AlertService.errorPopup("Lỗi!", res.error);
      } else {
        const listProjectName = [];
        res.body.data[0].permission_project.forEach((element) => {
          listProjectName.push(element.projectName);
        });
        this.setState(
          update(this.state, {
            listProject: {
              $set: res.body.data[0].permission_project,
            },
            listProjectName: {
              $set: listProjectName,
            },
          })
        );
      }
    });

    this.props.getListImage().then((res) => {
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
  }
  render() {
    const { text } = this.state;
    const project = this.state.selectProjectShowForm || [];

    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="search-bar">
                <div className="row">
                  <div className="col-md-12">
                    <form class="navbar-form">
                      <div className="input-group">
                        <Dropdown
                          options={this.state.listProjectName}
                          onChange={(e) => this.onChangeSelect(e)}
                          value={project.project_name}
                          placeholder="Chọn dự án"
                        />
                        <input
                          className="form-control searchbox"
                          type="text"
                          id="myInput"
                          name="search"
                          placeholder="Nhập mã dự án"
                          value={text}
                          onChange={this.onTextChanged}
                          autoComplete="off"
                        />
                        <span className="input-group-btn ">
                          <button
                            id="myBtn"
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
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="info-block">
                      <div className="row" />
                      <div className="row">
                        {project.project_code != null
                          ? this.renderFormShowPrice()
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  prepareDataCallApi,
  checkToken,
  geDepartment,
  getListProjectFromUser,
  getListImage,
  getProject,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(AboutUsthemes);

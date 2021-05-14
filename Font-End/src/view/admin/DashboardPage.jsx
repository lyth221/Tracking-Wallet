import React from "react";
import DashboardIcon from "./DashboardIcon.jsx";
import { getCountSearch } from "../redux/admin.jsx";
import SweetAlert from 'sweetalert2-react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import update from "immutability-helper";
import io from "socket.io-client";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "../common/scss/user-page.scss";
import AlertService from "../common/js/AlertService.js";
const socket = io("https://sale.angia.com.vn:9443");
class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventPending: 0,
      messageNotify: "",
      open: false,
      numberSearch: 0,
      listToken: [],
      totalValue: 0,
      totalCoinTrack: 0,
      show: true,
    };
    this.onChangeData = this.onChangeData.bind(this);
  }
  componentDidMount() {
    AlertService.loadingPopup();
    fetch("https://api.covalenthq.com/v1/56/address/0xA700f3cA3ddBCB173C674eA78F63c08257D8147D/balances_v2/?nft=no&format=JSON").then(res => res.json()).then((result) => {
      console.log("result", result)
      let listToken = []
      let totalValues = 0;
      let totalCoinTracks = 0
      for (let i = 0; i < result.data.items.length; i++) {
        if (result.data.items[i].balance != "0") {
          result.data.items[i].balance = parseFloat(result.data.items[i].balance) / (Math.pow(10, parseInt(result.data.items[i].contract_decimals)))
          listToken.push(result.data.items[i])
          totalValues = totalValues + result.data.items[i].quote
          totalCoinTracks = totalCoinTracks + 1
        } 
      }
      AlertService.swal.close();
      this.setState(update(this.state, {

        listToken: {
          $set: listToken
        },
        show: {
          $set: false
        },
        totalCoinTrack: {
          $set: totalCoinTracks
        },
        totalValue: {
          $set: totalValues
        }
      }))
    })
  }
  DidMount() {
    setTimeout(() => {
      var data = {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56],
          },
          {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86],
          },
        ],
      };
      var pdata = [
        {
          value: 300,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: "Complete",
        },
        {
          value: 50,
          color: "#F7464A",
          highlight: "#FF5A5E",
          label: "In-Progress",
        },
      ];

      var ctxl = $("#lineChartDemo")
        .get(0)
        .getContext("2d");
      var lineChart = new Chart(ctxl).Line(data);

      var ctxp = $("#pieChartDemo")
        .get(0)
        .getContext("2d");
      var pieChart = new Chart(ctxp).Pie(pdata);
    }, 500);
  }

  onChangeData(e) {
    e.preventDefault();
    this.setState(
      update(this.state, {
        messageNotify: { $set: e.target.value },
      })
    );
  }

  emitNotify() {
    const messageNotify = this.state.messageNotify;
    socket.emit("notify", messageNotify);
  }

  emitLogOutUser() {
    AlerService.warningPopup(
      "Cảnh báo",
      "Bạn sẽ đăng xuất toàn bộ người dùng đang có trong hệ thống?",
      (cb) => {
        if (cb.value) {
          socket.emit("user:logoutAll");
        }
      }
    );
  }

  render() {
    const { numberSearch, messageNotify } = this.state;
    return (
      <main className="app-content">
         
        <div className="app-title">
          <div>
            <h1>
              <i className="fa fa-dashboard" /> Quản lí chung
            </h1>
          </div>
          <ul className="app-breadcrumb breadcrumb">
            <li className="breadcrumb-item">
              <i className="fa fa-home fa-lg" />
            </li>
            <li className="breadcrumb-item">
              <a href="#">Quản lí chung</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-3">
            <DashboardIcon
              type="primary"
              icon="fa-btc"
              title="User"
              value={2}
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <DashboardIcon type="info" icon="fa-usd" title="News" value={this.state.totalValue} />
          </div>
          <div className="col-md-6 col-lg-3">
            <DashboardIcon
              type="danger"
              icon="fa-star"
              title="Event"
              value={this.state.totalCoinTrack}
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <DashboardIcon
              type="warning"
              icon="fa-eye"
              title="View"
              value={numberSearch}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="tile table-user-page">

              <ReactTable
                data={this.state.listToken}
                columns={[
                  {
                    Header: "Mã dự án",
                    maxWidth: 150,
                    accessor: "contract_name",
                    className: "justify-content-center",
                  },
                  {
                    Header: "Symbol",
                    maxWidth: 80,
                    id: "token_symbol",
                    accessor: "contract_ticker_symbol",
                    className: "justify-content-center",
                    accessor: (d) => {
                      return(
                        <React.Fragment>
                          <div>
                          <span
                                className="badge badge-success"
                                data-tip
                                data-for={d}
                              >
                                {d.contract_ticker_symbol}
                              </span>
                          </div>

                        </React.Fragment>
                      )
                    }
                  },
                  {
                    Header: "Decimal",
                    accessor: "contract_decimals",
                    className: "justify-content-center header",
                  },
                  // {
                  //   Header: "Contract Address",
                  //   accessor: "contract_address",
                  //   className: "justify-content-center",
                  // },
                  {
                    Header: "Balance",
                    accessor: "balance",
                    className: "justify-content-center",
                  },
                  {
                    Header: "Price (BUSD)",
                    accessor: "quote_rate",
                    className: "justify-content-center",
                  },
                  {
                    Header: "Total (BUSD)",
                    accessor: "quote",
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
                resizable={true}
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
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(DashboardPage);

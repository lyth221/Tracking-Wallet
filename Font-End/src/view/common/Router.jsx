import T from "../common/js/common";
import React from "react";
import { Switch, Route } from "react-router-dom";
import Loadable from "react-loadable";
import Loading from "../common/Loading.jsx";
import { AuthenticateService } from "../common/js/AuthenticateService";
import AlertService from "../common/js/AlertService";
// import HomeHeader from '../home/HomeHeader.jsx';
// import Footer from '../home/Footer.jsx';

import MessagePage from "../common/MessagePage.jsx";
import LoginModal from "../home/LoginModal.jsx";
import AdminHeader from "../admin/AdminHeader.jsx";
import SidebarMenu from "../admin/SidebarMenu.jsx";
// import Confirm from '../common/Confirm.jsx';
// import Alert from '../common/Alert.jsx';
import Loader from "../common/Loader.jsx";

//=================================================================================================

const notFoundPage = () => <MessagePage message="Page not found!" />,
  registeredPage = () => (
    <MessagePage message="Thanks for you registration!<br/>Please check your email and active your account." />
  ),
  activeUserPage = () => <MessagePage isTask={true} />,
  homePage = Loadable({
    loading: Loading,
    loader: () => import("../home/HomePage.jsx"),
  }),
  dashboardPage = Loadable({
    loading: Loading,
    loader: () => import("../admin/DashboardPage.jsx"),
  }),
  userPage = Loadable({
    loading: Loading,
    loader: () => import("../admin/UserPage.jsx"),
  }),
  documentPostPage = Loadable({
    loading: Loading,
    loader: () => import("../admin/DocumentPostPage.jsx"),
  }),
  aboutUsThemes = Loadable({
    loading: Loading,
    loader: () => import("../aboutus/AboutUs.jsx"),
  }),
  manageImagePage = Loadable({
    loading: Loading,
    loader: () => import("../admin/ManageImagePage.jsx"),
  }),
  projectPage = Loadable({
    loading: Loading,
    loader: () => import("../admin/ManageProjectPage.jsx"),
  });

const editDepartmentPage = Loadable({
  loading: Loading,
  loader: () => import("../admin/EditDepartment.jsx"),
});
const downloadFilePage = Loadable({
  loading: Loading,
  loader: () => import("../admin/ExportDataToExcel.jsx"),
});
const historySearchPage = Loadable({
  loading: Loading,
  loader: () => import("../admin/HistorySearchPage.jsx"),
});
const routes = [
  { view: "user", path: "/", component: homePage, exact: true, menuIndex: 0 },
  {
    view: "user",
    path: "/search",
    component: aboutUsThemes,
    exact: true,
    menuIndex: 1,
  },
  { view: "admin", path: "/admin/upload/image", component: manageImagePage },
  { view: "admin", path: "/admin/user", component: userPage },
  { view: "admin", path: "/admin/upload/file", component: documentPostPage },
  { view: "admin", path: "/admin/project", component: projectPage },
  { view: "admin", path: "/admin/edit/file", component: editDepartmentPage },
  {
    view: "admin",
    path: "/admin/download/file",
    component: downloadFilePage,
  },
  {
    view: "admin",
    path: "/admin/history",
    component: historySearchPage,
  },
  { view: "admin", path: "/admin", component: dashboardPage },
];
const switches = (
  <Switch>
    {routes.map((route, index) => (
      <Route key={index} {...route} />
    ))}
  </Switch>
);
console.log("switch", switches);

export default class Router extends React.Component {
  constructor(props) {
    super(props);
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(event) {
    if (this.props.user && this.props.user.loginUser) {
      T.logOut();
    } else {
      T.showLoginModal({ state: "login", message: "" });
    }
    event.preventDefault();
  }
  render() {
    let routeIndex = -1;
    for (
      let i = 0, pathname = window.location.pathname;
      i < routes.length;
      i++
    ) {
      const route = T.routeMatcher(routes[i].path);
      if (route.parse(pathname)) {
        routeIndex = i;
        break;
      }
    }
    console.log("route index", routeIndex, this.props);
    // console.log('route', routeIndex, routes.length - 1, routeIndex != routes.length - 1);
    if (routeIndex !== -1) {
      const route = routes[routeIndex];
      if (route.view === "user") {
        if (route.path == "/search") {
          if (!AuthenticateService.isAuthenticate()) {
            AuthenticateService.removeAuthenticate();
          }
        }
        let btnLoginText = "",
          btnLoginStyle = {};

        if (this.props.user && this.props.user.loginUser) {
          btnLoginText = "Đăng xuất";
          btnLoginStyle.backgroundColor = "#d03030";

          if (route.path == "/") {
            btnLoginStyle.display = "None";
            if (AuthenticateService.isAuthenticate()) {
              AuthenticateService.setAuthenticateUser(
                this.props.user.loginUser.token
              );
            }
          }
        } else {
          btnLoginText = "Đăng nhập";
          btnLoginStyle.backgroundColor = "#2c5a85";
          btnLoginStyle.display = "None";
        }

        return (
          <main className="wrapper">
            {switches}
            <a
              style={btnLoginStyle}
              className="btn-login-modal"
              href="#"
              onClick={this.onLogin.bind(this)}
            >
              {btnLoginText}
            </a>
            <LoginModal />
            <Loader />
          </main>
        );
      } else if (route.view === "admin") {
        if (!AuthenticateService.isAuthenticate()) {
          AuthenticateService.removeAuthenticate();
        }
        if (this.props.user.loginUser.email != "sale_admin") {
          swal("Error!", "Có lỗi xảy ra. Vui lòng thử lại!!!", "error");
          AuthenticateService.setAuthenticateUser(
            this.props.user.loginUser.token
          );
        } else {
          return (
            <div className="app sidebar-mini rtl">
              <AdminHeader />
              <SidebarMenu />
              <div className="site-content">{switches}</div>
              <Loader />
            </div>
          );
        }
      }
    } else {
      return <main className="app">{notFoundPage()}</main>;
    }
  }
}

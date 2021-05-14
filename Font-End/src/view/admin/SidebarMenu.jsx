import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class SidebarMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      var treeviewMenu = $(".app-menu");

      // Toggle Sidebar
      $('[data-toggle="sidebar"]').click(function(event) {
        $(".app").toggleClass("sidenav-toggled");
        event.preventDefault();
      });

      // Activate sidebar treeview toggle
      $('[data-toggle="treeview"]').click(function(event) {
        if (
          !$(this)
            .parent()
            .hasClass("is-expanded")
        ) {
          treeviewMenu
            .find('[data-toggle="treeview"]')
            .parent()
            .removeClass("is-expanded");
        }
        $(this)
          .parent()
          .toggleClass("is-expanded");
        event.preventDefault();
      });

      // Set initial active toggle
      $('[data-toggle="treeview."].is-expanded')
        .parent()
        .toggleClass("is-expanded");

      //Activate bootstrip tooltips
      $('[data-toggle="tooltip"]').tooltip();
    }, 500);
  }

  render() {
    let email =
      this.props.user && this.props.user.loginUser
        ? this.props.user.loginUser.email
        : "";
    return [
      <div key={1} className="app-sidebar__overlay" data-toggle="sidebar" />,
      <aside key={2} className="app-sidebar">
        <div className="app-sidebar__user">
          <img
            className="app-sidebar__user-avatar"
            src="https://s3.amazonaws.com/uifaces/faces/twitter/jsa/48.jpg"
            alt="Avatar"
          />
          <div>
            <p className="app-sidebar__user-name">Admin</p>
            <p className="app-sidebar__user-designation">{email}</p>
          </div>
        </div>
        <ul className="app-menu">
          <li>
            <Link className="app-menu__item" to="/admin">
              <i className="app-menu__icon fa fa-dashboard" />
              <span className="app-menu__label">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link className="app-menu__item" to="/admin/project">
              <i class="app-menu__icon fa fa-home" aria-hidden="true" />
              <span className="app-menu__label">Dự án</span>
            </Link>
          </li>
          <li>
            <Link className="app-menu__item" to="/admin/user">
              <i className="app-menu__icon fa fa-user" />
              <span className="app-menu__label">Người dùng</span>
            </Link>
          </li>

          {/* <li className="treeview">
            <a className="app-menu__item" href="#" data-toggle="treeview">
              <i className="app-menu__icon fa fa-file" aria-hidden="true" />
              <span className="app-menu__label">Dữ liệu</span>
              <i className="treeview-indicator fa fa-angle-right" />
            </a>
            <ul className="treeview-menu">
              <li>
                <Link className="treeview-item" to="/admin/upload/file">
                  <i className="icon fa fa-circle-o" />
                  Upload
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/edit/file">
                  <i className="icon fa fa-circle-o" />
                  Chỉnh sửa
                </Link>
              </li>
              <li>
                <Link className="treeview-item" to="/admin/download/file">
                  <i className="icon fa fa-circle-o" />
                  Download
                </Link>
              </li>
            </ul>
          </li> */}
          {/* <li className="treeview">
            <a className="app-menu__item" href="#" data-toggle="treeview">
              <i class="app-menu__icon fa fa-picture-o" aria-hidden="true">
                {" "}
              </i>
              <span className="app-menu__label">Hình ảnh</span>
              <i className="treeview-indicator fa fa-angle-right" />
            </a>
            <ul className="treeview-menu">
              <li>
                <Link className="treeview-item" to="/admin/upload/image">
                  <i className="icon fa fa-circle-o" />
                  Cập nhật
                </Link>
              </li>
            </ul>
          </li> */}
          <li>
            <Link className="app-menu__item" to="/admin/history">
              <i className="app-menu__icon fa fa-book" />
              <span className="app-menu__label">Xem lịch sử</span>
            </Link>
          </li>
        </ul>
      </aside>,
    ];
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(SidebarMenu);

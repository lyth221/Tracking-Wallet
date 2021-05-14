import React from "react";
import { connect } from "react-redux";

import AboutUstheme from "./Aboutusthemes.jsx";

import "../common/scss/themes/style.scss";

const h4Style = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "#555",
  paddingBottom: "5px",
  margin: "10px 0",
  borderBottom: "1px solid #bbb",
};

class AboutUs extends React.Component {
  constructor(props) {
    super(props);
    console.log("this pro", this.props.user);
  }

  render() {
    return (
      <div>
        <AboutUstheme />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  system: state.system,
});
const mapActionsToProps = {
  // loginUser: loginUser
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(AboutUs);

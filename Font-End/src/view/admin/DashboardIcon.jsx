import T from "../common/js/common";
import CountUp from "../common/js/countUp";
import React from "react";

export default class DashboardIcon extends React.Component {
  constructor(props) {
    super(props);

    this.valueElement = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      const endValue = this.props.value ? parseInt(this.props.value) : 0;
      new CountUp(this.valueElement.current, 0, endValue, 0, 2, {
        separator: ".",
        decimal: ",",
      }).start();
    }, 100);
  }

  render() {
    return (
      <div className={"widget-small coloured-icon " + this.props.type}>
        <i className={"icon fa fa-3x " + this.props.icon} />
        <div className="info">
          {/* <h4>{this.props.title}</h4> */}
          <p style={{ fontWeight: "bold" }} ref={this.valueElement} />
        </div>
      </div>
    );
  }
}

DashboardIcon.propTypes = {
  title: T.PropTypes.string,
  value: T.PropTypes.number,
  icon: T.PropTypes.string,
  type: T.PropTypes.string.isRequired,
};

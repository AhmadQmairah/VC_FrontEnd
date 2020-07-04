import React, { Component } from "react";

import { Menu, Layout, Button, Badge } from "antd";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

class SideNav extends Component {
  getSelectedMenuKey = () => {
    switch (window.location.pathname) {
      case "/manage/orders":
        return ["1"];
    }
  };

  render() {
    const { config, t, user } = this.props;
    console.log(user);
    return (
      <Sider
        collapsible
        breakpoint="md"
        collapsedWidth="0"
        zeroWidthTriggerStyle={{
          marginTop: 4,
          right: -36,
          //   left: config.direction == "rtl" && -36,
          top: 5,
          position: "absolute",
          backgroundColor: "#0099cc",
        }}
        style={{ backgroundColor: "#0099cc" }}
      >
        <div
          className="text-center row"
          style={{
            height: 93,
            width: "90%",
            direction: "rtl",
            // marginLeft: config.direction == "rtl" && "12%",
          }}
        >
          {/* <div className="col-6 p-0">
            <img
              src={this.props.settings.logo}
              style={{
                borderRadius: 2,
                marginTop: 10,
                marginLeft: config.direction == "ltr" && 20,
                marginRight: config.direction == "rtl" && 20,
              }}
              width={50}
              height={50}
            />
          </div> */}
          <div className="col-6 p-0">
            {/* <p
              style={{
                color: "white",
                marginTop: 14,
                marginBottom: 0,
                direction: "rtl",
                fontSize: 11,
                wordBreak: "break-word",
              }}
            >
              {t("LoggedAs")} {this.props.username}
            </p> */}

            {true || (true && true) || true ? null : null}
          </div>
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={this.getSelectedMenuKey()}
          mode="inline"
          style={{ border: "none" }}
        >
          <Menu.Item
            key="1"
            style={{ margin: 0, backgroundColor: "#006391" }}
            onClick={() => this.props.history.replace("/appointments")}
          >
            <Badge
              dot
              count={this.props.bellHasNewOrders ? 1 : 0}
              style={{
                left: -5,
              }}
            >
              <span>{"Appointments"}</span>
            </Badge>
          </Menu.Item>

          <Menu.Item
            key="2"
            style={{ margin: 0, backgroundColor: "#006391" }}
            onClick={() => this.props.history.replace("/doctors")}
          >
            <span>{"Doctors"}</span>
          </Menu.Item>
          {!this.props.is_doctor && (
            <Menu.Item
              key="3"
              style={{ margin: 0, backgroundColor: "#006391" }}
              onClick={() => this.props.history.replace("/my_appointments")}
            >
              <span>{"My Appointments"}</span>
            </Menu.Item>
          )}
          {!this.props.is_doctor && (
            <Menu.Item
              key="3"
              style={{ margin: 0, backgroundColor: "#006391" }}
              onClick={() => this.props.history.replace("/history")}
            >
              <span>{"Medical History"}</span>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.auth.settings,
    permissions: state.auth.permissions,
    config: state.config,
    user: state.auth.user,
    is_doctor: state.auth.is_doctor,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SideNav));

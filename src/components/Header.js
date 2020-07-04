import React, { Component } from "react";
import { Layout, Button } from "antd";
import { connect } from "react-redux";
import {
  BellOutlined,
  LogoutOutlined,
  GlobalOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { Badge } from "antd";
// import { logout } from "../../store/actions/auth";

import { Select } from "antd";
import { login } from "../store/actions/auth";
const { Option } = Select;
const { Header } = Layout;

class LayoutHeader extends Component {
  state = {
    QRuri: "",
  };

  componentDidUpdate = () => {
    if (this.props.settings && !this.state.QRuri) {
      const qrCodeCanvas = document.querySelector("#QR");
      const qrCodeDataUri = qrCodeCanvas.toDataURL("image/jpg", 0.3);
      this.QRCodeUri = qrCodeDataUri;
      this.setState({ QRuri: qrCodeDataUri });
    }
  };
  render() {
    const { t, settings, config } = this.props;
    console.log(config);
    return (
      <Header
        className="site-layout-background"
        style={{ padding: 0, backgroundColor: "#0099cc" }}
      >
        <div
          style={{
            float: "ltr" == "ltr" ? "right" : "left",
            marginRight: "ltr" == "ltr" && 15,
            marginLeft: "ltr" == "ltr" && 15,
            direction: "ltr",
          }}
        >
          {this.props.user && (
            <Button
              type="link"
              style={{ color: "white" }}
              onClick={() => {
                this.props.login();
                window.location.reload();
              }}
              title={"Logout"}
            >
              <LogoutOutlined style={{ fontSize: 22 }} />
            </Button>
          )}
        </div>
      </Header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    permissions: state.auth.permissions,
    config: state.config,
    settings: state.auth.settings,
    is_staff: state.auth.is_staff,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //Syntax
    login: (values) => dispatch(login(values)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutHeader);

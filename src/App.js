import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Component1 from "./components/Component1";
import Login from "./components/LoginPage";
import { connect } from "react-redux";
import { Button, Layout, Menu, Spin } from "antd";
import { logout } from "./store/actions/auth.js";
import SideNav from "./components/SideNav";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AfterLogin from "./components/AfterLogedIn";
import Doctor from "./components/Doctors";
import { ConfigProvider } from "antd";
import Appointment from "./components/Appointment";
import MyAppoitments from "./components/myAppointments";
import DoctorAppointment from "./components/Doctor_appointment";
import History from "./components/MedicalHistory";
// import Footer from "./components/Layout/Footer";
import { LoadingOutlined } from "@ant-design/icons";
import instance from "./store/actions/instance";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { Content } = Layout;

class App extends Component {
  async componentDidMount() {
    if (this.props.user) {
      let res = await instance.post("is_doctor/");
      this.props.setDoctor(res.data);
    }
  }
  render() {
    const { t, config, user } = this.props;
    console.log(user);
    return (
      <ConfigProvider
        direction={"ltr"}
        // locale={config.language == "arabic" ? ArabicLocale : EnglishLocale}
      >
        <div className="">
          <Layout style={{ minHeight: "100vh" }}>
            {this.props.user && <SideNav />}

            <Layout className="site-layout">
              <Header />
              <Content style={{ margin: "0 7px" }}>
                <div
                  className="site-layout-background site-layout-background-sider"
                  style={{
                    padding: "ltr" == "ltr" ? "20px 7px" : "20px 7px",
                    minHeight: 360,
                  }}
                >
                  <Route path="/login" component={Login} />
                  <Route path="/appointments" component={Appointment} />
                  <Route path="/doctors" component={Doctor} />
                  <Route path="/my_appointments/" component={MyAppoitments} />
                  <Route path="/profile/:id" component={DoctorAppointment} />
                  <Route path="/history" component={History} />
                  <Redirect from="" to="/appointments" />
                </div>
              </Content>
              <Footer />
            </Layout>
          </Layout>
        </div>
      </ConfigProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //Move this to a navbar if you create one
    logout: () => dispatch(logout()),
    setDoctor: (value) => dispatch({ type: "setDoctor", payload: value }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

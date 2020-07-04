import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import instance from "../../store/actions/instance";
//Ant
import { Row, Col, Button, Input, Spin, Divider, Modal, Table } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

//Components
import NewAppModal from "./newAppModal";

const Applist = React.lazy(() => import("./applist"));
const { Search } = Input;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Column } = Table;
class index extends Component {
  state = {
    newAppModalVisible: false,
    search: "",
    // loading: true,
    selected: null,
    histroy: null,
  };
  async componentDidMount() {
    console.log(this.props);
    // let res = await instance.post("get_history_by_id/");
    // console.log(res.data);
    // this.setState({ history: res.data });
    // console.log(res.data);
  }
  SetHistory = (list) => {
    this.setState({ history: list });
  };
  render() {
    const { permissions, loading, t, user, visible } = this.props;
    const { newAppModalVisible, search, selected } = this.state;
    console.log(this.state.history, "hello");
    if (!user.user) {
      this.props.history.replace("/login");
    }

    let history2 = this.props.selected.history;

    if (!history2) return null;
    console.log(this.props);

    let data = [];

    history2.forEach((app, index) => {
      if (true)
        data.push({
          ...app,
          index: index,
        });
    });

    return (
      <Modal
        style={{ top: 20 }}
        title={
          <div
            className="ant-modal-title"
            style={{
              textAlign: "ltr" == "rtl" ? "right" : "left",
            }}
          >
            {"New Appointment"}
          </div>
        }
        visible={visible}
        onCancel={() => this.props.onClose()}
        onOk={() => {
          this.createCoupon();
        }}
        okText={"Save"}
        cancelText={"Close"}
        bodyStyle={{
          paddingTop: 0,
          width: "auto",
          padding: "0px 18px",
          textAlign: "ltr" == "ltr" ? "left" : "right",
        }}
      >
        <div className="mt-3">
          <h3
            style={{
              display: "block",
              textAlign: "left",
            }}
          >
            {"History"}
          </h3>

          <Divider />

          <div className="jumbotron" style={{ padding: "17px 8px" }}>
            <Table scroll={{ x: 800 }} dataSource={data} size="small">
              <Column title={"History"} dataIndex="description" key="date" />
            </Table>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.auth };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(index);

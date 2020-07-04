import React, { Component } from "react";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";
import instance from "../../store/actions/instance";
// Antd components
import {
  Table,
  Button,
  Popconfirm,
  message,
  Upload,
  Popover,
  Menu,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  PrinterOutlined,
  DownOutlined,
} from "@ant-design/icons";

import { deletapp } from "../../store/actions/auth";
// Actions

//My Components

const { Column } = Table;

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error("Image must smaller than 5MB!");
  }
  return isJpgOrPng && isLt2M;
}

const uploadButton = (
  <div>
    <PlusOutlined />
    <div className="ant-upload-text">Upload</div>
  </div>
);

class applist extends Component {
  state = {
    selectedRowKeys: [],
    CouponModalVisible: false,
    selectedCoupon: null,
    requstThermalPrintCountCode: null,
    app: null,
  };
  async componentDidMount() {
    if (!this.state.app) {
      let res = await instance.post("/get_my_app/");
      console.log(res);
      this.setState({ app: res.data });
    }
  }

  cancelAPp = async (id) => {
    let res = await instance.post("del_app/", { id });
    let newApp = this.state.app.filter((a) => a.id !== id);

    this.setState({ app: newApp });
    message.success("Appointment cancelled succefully");
  };
  renderColumnDelete = (text, record) => {
    const { permissions, t } = this.props;
    return (
      <Popconfirm
        // disabled={!permissions.can_create_promotions}
        title={"Are you sure you want to cancel this appoitment?"}
        onConfirm={() => this.cancelAPp(record.id)}
        okText={"Yes"}
        cancelText={"No"}
      >
        <Button
          //   disabled={!permissions.can_create_promotions}
          danger
          shape="circle"
          icon={<DeleteOutlined style={{ top: -4 }} />}
        ></Button>
      </Popconfirm>
    );
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  openCouponModal = (index) => {
    this.setState({
      selectedCoupon: index,
      CouponModalVisible: true,
    });
  };
  render() {
    const { appointments, user } = this.props;
    const { app } = this.state;
    if (!app) return null;
    let data = [];
    app.forEach((ap, index) => {
      if (true)
        data.push({
          ...ap,
          index: index,
        });
    });

    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };

    // const hasSelected = selectedRowKeys.length > 0;
    return (
      <div
        style={{
          marginTop: 8,
          textAlign: "ltr" == "ltr" ? "left" : "right",
          direction: "ltr",
        }}
      >
        <Table
          scroll={{ x: 800 }}
          dataSource={data}
          size="small"
          //   rowSelection={permissions.can_create_promotions && rowSelection}
          // onRow={(record, rowIndex) => {
          //   return {
          //     onClick: (event) => {
          //       this.props.openModal(record);
          //     }, // click row
          //     style: { cursor: "pointer" },
          //   };
          // }}
        >
          <Column title={"Start Time"} dataIndex="time" key="time" />
          <Column title={"End Time"} dataIndex="end_time" key="time" />
          <Column title={"Date"} dataIndex="date" key="date" />
          <Column title={"Status"} dataIndex="status" key="status" />
          <Column title={"Cancel"} render={this.renderColumnDelete} />
          )}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    appointments: state.auth.appointments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deletapp: (id, index) => dispatch(deletapp(id, index)),
    fetchAPp: (values) =>
      dispatch({ type: "FETCH_APPOINTSMENTS", payload: values }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(applist));

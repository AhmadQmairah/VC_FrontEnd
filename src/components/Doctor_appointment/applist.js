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
  BookOutlined,
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
  };
  async componentDidMount() {
    if (!this.props.appointments) {
      let res = await instance.post("/get_app/");

      this.props.fetchAPp(res.data);
    }
  }

  renderColumnDelete = (text, record) => {
    const { permissions, t } = this.props;
    return (
      // <Popconfirm
      //   // disabled={!permissions.can_create_promotions}
      //   title={"Are you sure you want to delete this appoitment?"}
      //   onConfirm={() => this.props.deletapp(record.id, record.index)}
      //   okText={"Yes"}
      //   cancelText={"No"}
      // >
      <Button
        //   disabled={!permissions.can_create_promotions}

        shape="circle"
        icon={<BookOutlined style={{ top: -4 }} />}
      ></Button>
      // </Popconfirm>
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
    const { appointments, user, id } = this.props;

    if (!appointments) return null;
    let data = [];
    console.log(id, appointments);
    appointments.forEach((app, index) => {
      if (app.doctor === parseInt(id))
        data.push({
          ...app,
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
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                this.props.openModal(record);
              }, // click row
              style: { cursor: "pointer" },
            };
          }}
        >
          <Column title={"Start Time"} dataIndex="time" key="time" />
          <Column title={"End Time"} dataIndex="end_time" key="time" />
          <Column title={"Date"} dataIndex="date" key="date" />

          <Column title={"Book"} render={this.renderColumnDelete} />
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

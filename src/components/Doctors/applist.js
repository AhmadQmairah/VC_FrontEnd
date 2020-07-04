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
import Search from "antd/lib/input/Search";
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
    if (!this.props.doctors) {
      let res = await instance.post("/get_doctors/");

      this.props.fetchAPp(res.data);
    }
  }

  openCouponModal = (index) => {
    this.setState({
      selectedCoupon: index,
      CouponModalVisible: true,
    });
  };
  render() {
    const { doctors, search } = this.props;
    if (!doctors) return null;
    let data = [];
    console.log(search);
    doctors.forEach((app, index) => {
      if (app.dcctor_speciality.toLowerCase().includes(search.toLowerCase()))
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
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                {
                  if (this.props.user.user_id == 41) {
                    this.props.openModal(record);
                  } else {
                    this.props.history.push("profile/" + record.id);
                  }
                }
              }, // click row
              style: { cursor: "pointer" },
            };
          }}
        >
          <Column title={"Name"} dataIndex="name" key="time" />
          <Column title={"Civil ID"} dataIndex="civil_id" key="date" />
          <Column
            title={"Speciality"}
            dataIndex="dcctor_speciality"
            key="dcctor_speciality"
          />
          {this.props.user.user_id == 41 && (
            <Column
              title={"Status"}
              dataIndex="doctor_verified"
              key="doctor_verified"
            />
          )}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    doctors: state.auth.doctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deletapp: (id, index) => dispatch(deletapp(id, index)),
    fetchAPp: (values) => dispatch({ type: "FETCH_DOCTORS", payload: values }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(applist));

import React, { Component } from "react";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";
import instance from "../../store/actions/instance";
import HistoryModal from "./HistoryModal";
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
  HistoryOutlined,
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
    historyVisible: false,
  };
  async componentDidMount() {
    if (!this.props.appointments) {
      let res = await instance.post("/get_app/");

      this.props.fetchAPp(res.data);
    }

    if (!this.props.doctors) {
      let res2 = await instance.post("/get_doctors/");
      console.log(res2);

      this.props.fetchAPp2(res2.data);
    }
  }

  renderColumnDelete = (text, record) => {
    const { permissions, t } = this.props;
    return (
      <Popconfirm
        // disabled={!permissions.can_create_promotions}
        title={"Are you sure you want to delete this appoitment?"}
        onConfirm={() => this.props.deletapp(record.id, record.index)}
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
  renderColumnHistory = (text, record) => {
    const { permissions, t } = this.props;
    return (
      <Button
        onClick={() =>
          this.setState(() => ({ historyVisible: true, selected: record }))
        }
        shape="circle"
        icon={<HistoryOutlined style={{ top: -4 }} />}
      ></Button>
    );
  };
  renderColumnBookedBy = (text, record) => {
    const { permissions, t } = this.props;
    return (
      //   <Popconfirm
      //     // disabled={!permissions.can_create_promotions}
      //     title={"Are you sure you want to delete this appoitment?"}
      //     onConfirm={() => this.props.deletapp(record.id, record.index)}
      //     okText={"Yes"}
      //     cancelText={"No"}
      //   >
      <div>{text ? text : "Not booked"}</div>
      //   </Popconfirm>
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
    const { appointments, user, doctors } = this.props;
    const { historyVisible } = this.state;
    console.log(doctors);
    if (!appointments) return null;
    let data = [];
    appointments.forEach((app, index) => {
      if (true)
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
    console.log(appointments);
    return (
      <div
        style={{
          marginTop: 8,
          textAlign: "ltr" == "ltr" ? "left" : "right",
          direction: "ltr",
        }}
      >
        {historyVisible && (
          <HistoryModal
            visible={historyVisible}
            selected={this.state.selected}
            onClose={() => {
              this.setState({ historyVisible: false });
            }}
          />
        )}
        <Table
          scroll={{ x: 800 }}
          dataSource={data}
          size="small"
          //   rowSelection={permissions.can_create_promotions && rowSelection}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                record.booked_by && this.props.openModal(record);
              }, // click row
              style: { cursor: "pointer" },
            };
          }}
        >
          <Column title={"Start Time"} dataIndex="time" key="time" />
          <Column title={"End Time"} dataIndex="end_time" key="time" />
          <Column title={"Date"} dataIndex="date" key="date" />
          {user.is_doctor && (
            <>
              <Column
                filters={[
                  { text: "booked", value: true },
                  { text: "not booked", value: false },
                ]}
                onFilter={(value, record) => {
                  if (value && record.booked_by) {
                    return true;
                  } else if (!value && !record.booked_by) {
                    return true;
                  }
                }}
                title={"Booked_By"}
                dataIndex="booked_by"
                render={this.renderColumnBookedBy}
              />
              <Column title={"Status"} dataIndex={"status"} key={"index"} />
              <Column
                title={"View History"}
                render={this.renderColumnHistory}
                key={"history"}
              />
              <Column title={"Delete"} render={this.renderColumnDelete} />
            </>
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
    doctors: state.auth.doctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deletapp: (id, index) => dispatch(deletapp(id, index)),
    fetchAPp: (values) =>
      dispatch({ type: "FETCH_APPOINTSMENTS", payload: values }),
    fetchAPp2: (values) => dispatch({ type: "FETCH_DOCTORS", payload: values }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(applist));

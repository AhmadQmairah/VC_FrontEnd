import React, { Component } from "react";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";
import instance from "../../store/actions/instance";
import moment from "moment";

// Antd Components
import {
  Modal,
  Select,
  Input,
  InputNumber,
  message,
  Checkbox,
  DatePicker,
  Upload,
  TimePicker,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

// Actions

const { Option } = Select;
const { RangePicker } = DatePicker;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

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
const uploadButton = (loading, t) => (
  <div>
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div className="ant-upload-text">{t("Upload")}</div>
  </div>
);
class newAppModel extends Component {
  state = {
    time: null,
    date: null,
    saveLoading: false,
  };
  saveButtonDisabled = () => {
    const { time, date } = this.state;
    if (!time || !date) {
      return true;
    }
    return false;
  };
  createCoupon = async () => {
    this.setState({ saveLoading: true });
    const payload = {
      ...this.state,
      id: this.props.selected.id,
    };

    let res = await instance.post("update_app/", payload);

    message.success("Appointment created successfully");
    this.props.createApp(this.props.selected.index, res.data);
    this.props.onClose();
    this.setState({ saveLoading: false });
  };

  handleImageChange = (info) => {
    if (beforeUpload(info.file)) {
      getBase64(info.file, (imageUrl) =>
        this.setState({
          banner: { name: info.file.name, image: imageUrl },
        })
      );
    }
  };

  render() {
    const { visible, config, t } = this.props;
    const { time, date } = this.state;
    console.log(this.props.selected);
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
            {"Edit Appointment"}
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
        okButtonProps={{
          disabled: this.saveButtonDisabled() == true,
          loading: this.state.saveLoading,
        }}
      >
        <div className="px-2 mb-3">
          <div className="mt-3">
            <p>Date</p>
            <DatePicker
              style={{ width: 150 }}
              onChange={(e) =>
                this.setState({ date: e.format("YYYY-MM-DD").toString() })
              }
            />
          </div>
          <div className="mt-3">
            <p>Time</p>
            <TimePicker
              style={{ width: 150 }}
              onChange={(e, a) => {
                this.setState({ time: a });
                console.log(e);
              }}
              defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    config: state.config,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    createApp: (index, app) =>
      dispatch({ type: "UPDATE_APP", payload: { index, app } }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(newAppModel);

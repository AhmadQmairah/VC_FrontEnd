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
    end_time: null,
    date: null,
    saveLoading: false,
    image: null,
  };
  saveButtonDisabled = () => {
    const { time, date } = this.state;
    if (false) {
      return true;
    }
    return false;
  };
  createCoupon = async () => {
    this.setState({ saveLoading: true });
    console.log(this.state);
    const payload = {
      ...this.state,
      id: this.props.selected.id,
    };

    let res = await instance.post("book_app/", payload);

    message.success("Appointment booked successfully");
    // this.props.createApp(res.data);
    this.props.onClose();
    this.setState({ saveLoading: false });
  };

  handleImageChange = (info) => {
    if (beforeUpload(info.file)) {
      getBase64(info.file, (imageUrl) =>
        this.setState({
          image: { name: info.file.name, imageUrl: imageUrl },
        })
      );
    }
  };

  render() {
    const { visible, config, t } = this.props;
    const {
      quantity,
      startDate,
      expiryDate,
      discountAmount,
      discountType,
      banner,
    } = this.state;
    console.log(this.state);
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
            {"Book Appointment"}
          </div>
        }
        visible={visible}
        onCancel={() => this.props.onClose()}
        onOk={() => {
          this.createCoupon();
        }}
        okText={"Book"}
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
            <p>Description</p>
            <Input
              style={{ width: 150 }}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <p>Document</p>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={this.handleImageChange}
            >
              {this.state.image ? (
                <img
                  src={this.state.image.imageUrl}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
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
    createApp: (coupon) => dispatch({ type: "NEW_APP", payload: coupon }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(newAppModel);

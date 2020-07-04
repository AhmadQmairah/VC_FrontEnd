import React, { Component } from "react";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Checkbox,
  InputNumber,
  message,
  Upload,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  HomeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { login, signup } from "../../store/actions/auth.js";
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
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
class index extends Component {
  state = {
    is_doctor: false,
    image: null,
    type: "log",
  };
  displayError = () => {
    const { auth } = this.props;
    if (auth.errors) {
      return <li style={{ color: "red" }}>{auth.errors}</li>;
    }
  };

  handleImageChange = (info) => {
    getBase64(info.file, (imageUrl) =>
      this.setState({
        image: { name: info.file.name, imageUrl: imageUrl },
      })
    );
  };
  render() {
    const onFinish = (values) => {
      console.log({ ...values, is_doctor: this.state.is_doctor });
      if (this.state.type === "log") {
        this.props.login(values);
      } else {
        this.props.signup({
          ...values,
          is_doctor: this.state.is_doctor,
          image: this.state.image,
        });
        this.setState({ type: "log" });
      }
    };
    const uploadButton = (
      <div>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { auth } = this.props;
    const onFinishFailed = (errorInfo) => {};
    const { is_doctor, type } = this.state;
    if (auth.user) this.props.history.replace("/");
    return (
      <div className="mt-5 text-center mx-auto" style={{ maxWidth: 350 }}>
        <h1 className="mb-5">{"Login"}</h1>
        {auth.errors ? <p style={{ color: "red" }}>{auth.errors}</p> : null}
        <Form
          name="basic"
          classNamem="text-center"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label={"Email"}
            name="email"
            rules={[{ required: true, message: "Account not found" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="text-center w-100"
            label={"Password"}
            name="password"
            rules={[{ required: true, message: "PasswordError" }]}
          >
            <Input.Password />
          </Form.Item>
          {type !== "log" && (
            <>
              <Form.Item
                label={"Name"}
                name="username"
                rules={[{ required: true, message: "Account not found" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={"Civil ID"}
                name="civilID"
                rules={[{ required: true, message: "Account not found" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={"Address"}
                name="address"
                rules={[{ required: false, message: "" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={"Phone Number"}
                name="phone_number"
                rules={[{ required: false, message: "" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={"Age"}
                name="age"
                rules={[{ required: false, message: "" }]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label={"are you a doctor ?"}
                name="is_doctor"
                rules={[{ required: false, message: "" }]}
              >
                <Checkbox
                  onChange={(e) =>
                    this.setState({ is_doctor: e.target.checked })
                  }
                />
              </Form.Item>
              {is_doctor && (
                <>
                  <Form.Item
                    label={"What is your specialty ?"}
                    name="speciality"
                    rules={[{ required: false, message: "" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={"photo"}
                    name="photo"
                    rules={[{ required: false, message: "" }]}
                  >
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
                  </Form.Item>
                </>
              )}
            </>
          )}
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit">
              {type === "log" ? "Log in" : "Sign Up"}
            </Button>
          </Form.Item>
          <span
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                type: this.state.type === "sign" ? "log" : "sign",
              })
            }
          >
            {this.state.type === "log"
              ? "dont have an account ?"
              : "have an account"}
          </span>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //Syntax
    login: (values) => dispatch(login(values)),
    signup: (values) => dispatch(signup(values)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);

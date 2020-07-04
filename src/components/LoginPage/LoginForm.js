import { Input, Button, Row, Col, Checkbox, Upload, message } from "antd";
import React from "react";
import { connect } from "react-redux";
import { login, signup } from "../../store/actions/auth.js";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  HomeOutlined,
  UploadOutlined,
} from "@ant-design/icons";

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
class LoginForm extends React.Component {
  state = {
    type: "signup",

    username: "",
    email: "",
    password: "",
    civilId: "",
    age: null,
    address: "",
    isDoctor: false,
    image: null,
    speciality: "",

    loading: false,
  };
  handleSubmit = () => {
    const { username, email, password } = this.state;
    if (this.state.type == "login") {
      this.props.login({ email, password });
    } else {
      this.props.signup(this.state);
    }
  };

  onChangeField = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleImageChange = (info) => {
    getBase64(info.file, (imageUrl) =>
      this.setState({
        image: { name: info.file.name, imageUrl: imageUrl },
      })
    );
  };

  render() {
    const uploadButton = (
      <div>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { type } = this.state;
    console.log(this.state);
    return (
      <div>
        <Row gutter={[24, 24]} style={{ alignItems: "center" }}>
          <Col span={8} className="text-left">
            Email
          </Col>
          <Col span={16}>
            <Input
              size="large"
              placeholder="Email"
              prefix={<MailOutlined />}
              onChange={this.onChangeField}
              name="email"
            />
          </Col>

          {type == "signup" && (
            <>
              {" "}
              <Col span={8} className="text-left">
                Username
              </Col>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="Username"
                  prefix={<UserOutlined />}
                  onChange={this.onChangeField}
                  name="username"
                />
              </Col>
              <Col span={8} className="text-left">
                Civil id
              </Col>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="Civil id"
                  prefix={<IdcardOutlined />}
                  onChange={this.onChangeField}
                  name="civilID"
                />
              </Col>
              <Col span={8} className="text-left">
                Address
              </Col>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="Username"
                  prefix={<HomeOutlined />}
                  onChange={this.onChangeField}
                  name="address"
                />
              </Col>
              <Col span={8} className="text-left">
                Age
              </Col>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="Age"
                  prefix={<HomeOutlined />}
                  onChange={this.onChangeField}
                  name="age"
                />
              </Col>
              <Col span={8} className="text-left">
                Are you a Doctor ?
              </Col>
              <Col span={16}>
                <Checkbox
                  className="float-left"
                  size="large"
                  placeholder="Age"
                  prefix={<HomeOutlined />}
                  onChange={(e) =>
                    this.setState({ isDoctor: e.target.checked })
                  }
                  name="isDoctor"
                />
              </Col>
              {this.state.isDoctor && (
                <>
                  <Col span={8} className="text-left">
                    Speciality
                  </Col>
                  <Col span={16}>
                    <Input
                      className="float-left"
                      size="large"
                      placeholder="Age"
                      prefix={<HomeOutlined />}
                      onChange={this.onChangeField}
                      name="speciality"
                    />
                  </Col>
                  <Col span={8} className="text-left">
                    Image
                  </Col>
                  <Col span={16}>
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
                  </Col>
                </>
              )}
            </>
          )}
          <Col span={8} className="text-left">
            Password
          </Col>
          <Col span={16}>
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined />}
              onChange={this.onChangeField}
              name="password"
            />
          </Col>
        </Row>
        <div className="text-left">
          {type == "signup" ? "Already have an account?" : "New here?"}
          <Button
            type="link"
            onClick={() =>
              this.setState({ type: type == "login" ? "signup" : "login" })
            }
          >
            {type == "signup" ? "Login" : "Sign up"}
          </Button>
        </div>
        <div className="mt-3">
          <Button
            type="primary"
            size="large"
            className="w-100"
            onClick={this.handleSubmit}
          >
            {type == "signup" ? "Sign up" : "Login"}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //Syntax
    login: (values) => dispatch(login(values)),
    signup: (values) => dispatch(signup(values)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

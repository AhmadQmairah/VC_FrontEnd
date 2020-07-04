import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import instance from "../../store/actions/instance";
//Ant
import { Row, Col, Button, Input, Spin, Divider } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

//Components
import NewAppModal from "./newAppModal";

const Applist = React.lazy(() => import("./applist"));
const { Search } = Input;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class index extends Component {
  state = {
    newAppModalVisible: false,
    search: "",
    // loading: true,
    selected: null,
    histroy: null,
  };
  async componentDidMount() {
    let res = await instance.post("get_history/");
    console.log(res.data);
    this.setState({ history: res.data });
    console.log(res.data);
  }
  SetHistory = (list) => {
    this.setState({ history: list });
  };
  render() {
    const { permissions, loading, t, user } = this.props;
    const { newAppModalVisible, search, selected } = this.state;
    console.log(this.state.history, "hello");
    if (!user.user) {
      this.props.history.replace("/login");
    }
    return (
      <div>
        <h3
          style={{
            display: "block",
            textAlign: "left",
          }}
        >
          {"History"}
        </h3>

        {newAppModalVisible && (
          <NewAppModal
            history2={this.state.history}
            SetHistory={this.SetHistory}
            visible={newAppModalVisible}
            onClose={() => {
              this.setState({ newAppModalVisible: false });
            }}
          />
        )}
        <Divider />
        <Row
          gutter={[15, 8]}
          style={{
            textAlign: "ltr" == "ltr" ? "left" : "right",
          }}
        >
          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
            <Button
              type="primary"
              icon={<PlusOutlined style={{ position: "relative", top: -2 }} />}
              onClick={() => {
                this.setState({ newAppModalVisible: true });
              }}
            >
              {"New History"}
            </Button>
          </Col>
          <Col xs={24} sm={18} md={18} lg={18} xl={18}>
            <Search
              placeholder={"Search for for a history"}
              enterButton
              onChange={(e) => this.setState({ search: e.target.value })}
            />
          </Col>
        </Row>
        <div className="jumbotron" style={{ padding: "17px 8px" }}>
          <Suspense
            fallback={
              <div className="mt-4 text-center">
                <Spin indicator={antIcon} />
              </div>
            }
          >
            {!loading ? (
              <Applist
                search={search}
                history2={this.state.history}
                openModal={(selected) =>
                  this.setState({
                    newAppModalVisible: true,
                    selected: selected,
                  })
                }
              />
            ) : (
              <div className="mt-4 text-center">
                <Spin indicator={antIcon} />
              </div>
            )}
          </Suspense>
        </div>
      </div>
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

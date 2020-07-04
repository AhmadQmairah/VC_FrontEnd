import React, { Component, Suspense } from "react";
import { connect } from "react-redux";

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
  };
  render() {
    const { permissions, loading, t, user } = this.props;
    const { newAppModalVisible, search, selected } = this.state;

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
          {"Doctors"}
        </h3>

        {newAppModalVisible && selected && (
          <NewAppModal
            visible={newAppModalVisible}
            selected={selected}
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
          <Col xs={24} sm={18} md={24} lg={24} xl={24}>
            <Search
              placeholder={"Search for for doctor"}
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

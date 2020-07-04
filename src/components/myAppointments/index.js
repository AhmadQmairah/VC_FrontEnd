import React, { Component, Suspense } from "react";
import { connect } from "react-redux";

//Ant
import { Row, Col, Button, Input, Spin } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

//Components
import NewAppModal from "./newAppModal";
import EditAppModal from "./EditAppModal";
const Applist = React.lazy(() => import("./applist"));
const { Search } = Input;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class index extends Component {
  state = {
    newAppModalVisible: false,
    editAppModalVisible: false,
    search: "",
    loading: true,
    selected: null,
  };
  render() {
    const { permissions, loading, t, user } = this.props;
    const {
      newAppModalVisible,
      search,
      editAppModalVisible,
      selected,
    } = this.state;

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
          {"Appointments"}
        </h3>

        {newAppModalVisible && (
          <NewAppModal
            visible={newAppModalVisible}
            onClose={() => {
              this.setState({ newAppModalVisible: false });
            }}
          />
        )}
        {editAppModalVisible && (
          <EditAppModal
            visible={editAppModalVisible}
            selected={this.state.selected}
            onClose={() => {
              this.setState({ editAppModalVisible: false });
            }}
          />
        )}
        <Row
          gutter={[15, 8]}
          style={{
            textAlign: "ltr" == "ltr" ? "left" : "right",
          }}
        >
          <Col xs={24} sm={6} md={6} lg={6} xl={6}>
            <Button
              disabled={!user.is_doctor}
              type="primary"
              icon={<PlusOutlined style={{ position: "relative", top: -2 }} />}
              onClick={() => {
                this.setState({ newAppModalVisible: true });
              }}
            >
              {"New Appointment"}
            </Button>
          </Col>
          <Col xs={24} sm={18} md={18} lg={18} xl={18}>
            <Search
              placeholder={"Search for for an Appointment"}
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
                    editAppModalVisible: true,
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

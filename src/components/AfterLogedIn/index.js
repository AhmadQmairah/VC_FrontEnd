import React, { Component } from "react";
import { connect } from "react-redux";

export class index extends Component {
  render() {
    const { user } = this.props;
    if (!user) this.props.history.replace("/login");
    return <div>Hello</div>;
  }
}

const mapStateToProps = (state) => ({ user: state.auth.user });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(index);

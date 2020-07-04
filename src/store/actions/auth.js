import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER, SET_ERROR } from "./actionTypes";
import instance from "./instance";
import axios from "axios";
import { message } from "antd";

export const login = (userData) => {
  return async (dispatch) => {
    try {
      if (!userData) {
        dispatch(setCurrentUser());
        dispatch({ type: "CLEAR_ERRORS" });
      }
      const res = await instance.post("/login/", userData);
      const user = res.data;

      dispatch(setCurrentUser(user.access, user.is_doctor));
      dispatch({ type: "CLEAR_ERRORS" });
    } catch (err) {
      const response = err.response;
      console.log(err.response.data);
      if (response) dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };
};

export const signup = (userData) => {
  return async (dispatch) => {
    try {
      const res = await instance.post("/signup/", userData);
      const user = res.data;
      dispatch(setCurrentUser(user.access));
      dispatch(login(userData));
    } catch (err) {
      if (err.response)
        dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };
};

const setCurrentUser = (token, is_doctor = false) => {
  return async (dispatch) => {
    let user;

    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;

      user = jwt_decode(token);
      console.log(token);
      dispatch({
        type: SET_CURRENT_USER,
        payload: { user, is_doctor },
      });
    } else {
      localStorage.removeItem("token");
      delete instance.defaults.headers.common.Authorization;
      delete axios.defaults.headers.common.Authorization;

      user = null;
      dispatch({
        type: SET_CURRENT_USER,
        payload: { user, is_doctor },
      });
    }
  };
};

export const logout = () => setCurrentUser();

export const checkForExpiredToken = () => {
  // Check for token expiration
  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    const currentTimeInSeconds = Date.now() / 1000;

    // Decode token and get user info
    user = jwt_decode(token);

    // Check token expiration
    if (user.exp >= currentTimeInSeconds) {
      // Set user
      return setCurrentUser(token);
    }
  }
  return logout();
};

export const deletapp = (id, index) => {
  return async (dispatch) => {
    instance.post("del_app/", { id: id });
    message.success("Appointment deleted successfully");
    dispatch({
      type: "Delete_APP",
      payload: index,
    });
  };
};

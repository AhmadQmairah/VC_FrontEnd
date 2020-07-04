import { SET_CURRENT_USER, SET_ERROR } from "../actions/actionTypes";

const initialState = {
  user: null,
  errors: null,
  appointments: null,
  doctors: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        user: payload.user,
        errors: null,
        is_doctor: payload.is_doctor,
      };
    case SET_ERROR:
      if (payload.length >= 100) return { ...state };
      return { ...state, errors: payload };
    case "CLEAR_ERRORS":
      return { ...state, errors: null };
    case "FETCH_APPOINTSMENTS":
      return { ...state, appointments: payload };
    case "NEW_APP":
      let newApp = [...state.appointments];
      newApp.push(payload);
      return { ...state, appointments: newApp };
    case "Delete_APP":
      let newApp_2 = [...state.appointments];
      newApp_2.splice(payload, 1);
      return { ...state, appointments: newApp_2 };
    case "setDoctor":
      console.log(payload);
      return { ...state, is_doctor: payload };
    case "FETCH_DOCTORS":
      console.log(payload);
      return { ...state, doctors: payload };

    case "CHANGE_STATUS_DOC":
      console.log(payload);
      let newApp_3 = [...state.doctors];
      newApp_3[payload.index].doctor_verified = payload.status;
      console.log(newApp_3[payload.index]);
      return { ...state, doctors: newApp_3 };
    case "UPDATE_APP":
      let newApp_4 = [...state.appointments];
      newApp_4[payload.index].time = payload.app.time;
      newApp_4[payload.index].date = payload.app.date;
      return { ...state, appointments: newApp_4 };
    case "UPDATE_BOOKING_STATUS":
      console.log(payload);
      let newApp_5 = [...state.appointments];
      newApp_5[payload.index].status = payload.app;
      return { ...state, appointments: newApp_5 };

    default:
      return state;
  }
};

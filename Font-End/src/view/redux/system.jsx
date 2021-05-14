import T from "../common/js/common";

export const UPDATE_SYSTEM_STATE = "system:updateSystemState";

// Reducer -------------------------------------------------------------------------------------------------------------
export default function systemReducer(state = null, data) {
  switch (data.type) {
    case UPDATE_SYSTEM_STATE:
      return Object.assign({}, state, data.state);

    default:
      return state;
  }
}

// Action --------------------------------------------------------------------------------------------------------------
export function updateSystemState(state) {
  return Object.assign({}, { type: UPDATE_SYSTEM_STATE, state });
}

export function getSystemState(done) {
  return (dispatch) => {
    const url = "/home/state";
    $.get(T.url(url))
      .then((res) => {
        if (res) {
          dispatch(updateSystemState(res));
        }
        if (done) done();
      })
      .catch((error) => {
        // console.error('GET: ' + url + '. ' + error);
        if (done) done();
      });
  };
}

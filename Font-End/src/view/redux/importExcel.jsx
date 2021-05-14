import T from "../common/js/common";
import { HTTPService } from "../common/js/HTTPService";
import { AuthenticateService } from "../common/js/AuthenticateService";

export const UPDATE_DOCUMENT_PAGE = "event:updateDocumentPage";
export const UPDATE_DOCUMENT_IN_PAGE = "event:updateDocumentInPage";

const stateInit = {
  listEvent: null,
};

// Reducer -------------------------------------------------------------------------------------------------------------
export default function eventReducer(state = stateInit, data) {
  switch (data.type) {
    case UPDATE_DOCUMENT_PAGE:
      return Object.assign({}, state, { page: data });

    case UPDATE_DOCUMENT_IN_PAGE:
      let newState = Object.assign({}, state);
      if (newState.page) {
        for (let i = 0, n = newState.page.list.length; i < n; i++) {
          if (data.event._id === newState.page.list[i]._id) {
            newState.page.list[i] = data.event;
            break;
          }
        }
      }
      return newState;

    default:
      return state;
  }
}
// Actions  -------------------------------------------------------------------------------------------------
export function importExcelFile(data, done) {
  return async (dispatch) => {
    try {
      let headers = {
        Authorization: "Bearer " + AuthenticateService.getAuthenticate(),
        "Content-Type": "multipart/form-data",
        accept: "multipart/form-data",
      };

      const res = await HTTPService.sendRequest(
        "post",
        "/file/upload",
        data,
        headers
      );
      if (res.success) {
        return { ok: true, body: res.data };
      } else {
        return { ok: false, error: res.message };
      }
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };
}

export function prepareDataCallApi() {
  return async (dispatch) => {
    try {
      let headers = {
        Authorization: "Bearer " + AuthenticateService.getAuthenticate(),
        "Content-Type": "multipart/form-data",
        accept: "multipart/form-data",
      };
      const res = await HTTPService.sendRequest(
        "get",
        "/file/get_data",
        headers
      );

      if (res.success) {
        return { ok: true, body: res.data };
      } else {
        return { ok: false, error: res.message };
      }
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };
}

export function getDataFile() {
  return async (dispatch) => {
    try {
      let headers = {
        Authorization: "Bearer " + AuthenticateService.getAuthenticate(),
        "Content-Type": "multipart/form-data",
        accept: "multipart/form-data",
      };
      const res = await HTTPService.sendRequest(
        "get",
        "/manage/file/get",
        headers
      );

      if (res.success) {
        return { ok: true, body: res.data };
      } else {
        return { ok: false, error: res.message };
      }
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };
}

export function geDepartment(projectCode) {
  return async (dispatch) => {
    try {
      let headers = {
        Authorization: "Bearer " + AuthenticateService.getAuthenticate(),
        "Content-Type": "multipart/form-data",
        accept: "multipart/form-data",
      };

      const res = await HTTPService.sendRequest(
        "get",
        `/data/file/get/${projectCode}`
      );

      if (res.success) {
        return { ok: true, body: res.data };
      } else {
        return { ok: false, error: res.message };
      }
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };
}

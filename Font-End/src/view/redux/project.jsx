import T from "../common/js/common";
import { HTTPService } from "../common/js/HTTPService";
import { AuthenticateService } from "../common/js/AuthenticateService";

export function getListProject(done) {
  return async (dispatch) => {
    const res = await HTTPService.sendRequest("get", "/project/get_list");
    if (!res.isError) {
      return { ok: true, body: res };
    } else {
      return { ok: false, error: res.message };
    }
  };
}

export function getListProjectFromUser(done) {
  return async (dispatch) => {
    const res = await HTTPService.sendRequest("get", "/project/get_list_user");
    if (!res.isError) {
      return { ok: true, body: res };
    } else {
      return { ok: false, error: res.message };
    }
  };
}

export function createProject(data, done) {
  return async (dispatch) => {
    const res = await HTTPService.sendRequest("post", "/project/create", data);
    if (!res.isError) {
      if (res.code == 200) {
        return { ok: true, body: res };
      } else {
        return { ok: false, error: res.message };
      }
    } else {
      return { ok: false, error: res.message };
    }
  };
}

export function getProject(id, done) {
  return async (dispatch) => {
    console.log("^^^^^^^^^^^^", id);
    const res = await HTTPService.sendRequest("get", `/project/get/${id}`);
    if (!res.isError) {
      if (res.code == 200) {
        return { ok: true, body: res };
      } else {
        return { ok: false, error: res.message };
      }
    } else {
      return { ok: false, error: res.message };
    }
  };
}

export function updateProject(data, done) {
  return async (dispatch) => {
    try {
      const id = data.id;
      const body = {
        status: data.status,
        id: data.id,
        projectCode: data.projectCode,
      };
      const res = await HTTPService.sendRequest(
        "put",
        `/project/update/${id}`,
        body
      );
      if (!res.isError) {
        if (res.code == 200) {
          return { ok: true, body: res };
        } else {
          return { ok: false, error: res.message };
        }
      } else {
        return { ok: false, error: res.message };
      }
    } catch (error) {
      return { ok: false, error };
    }
  };
}

import T from "../common/js/common";
import { HTTPService } from "../common/js/HTTPService";
import { AuthenticateService } from "../common/js/AuthenticateService";

const stateInit = {
  loginUser: AuthenticateService.getAuthenticateUser(),
  listUser: null,
};

export const UPDATE_LOGIN_USER = "user:updateLoginUser";
export const UPDATE_LIST_USER = "user:updateListUser";
export const UPDATE_USER_PAGE = "user:updateUserPage";
export const UPDATE_USER_IN_PAGE = "user:updateUserInPage";

// Reducer -------------------------------------------------------------------------------------------------------------
export default function userReducer(state = stateInit, data) {
  switch (data.type) {
    case UPDATE_LOGIN_USER:
      if (!data.loginUser) AuthenticateService.removeAuthenticate();
      else AuthenticateService.setAuthenticateUser(data.loginUser.token);
      return Object.assign({}, state, { loginUser: data.loginUser });

    case UPDATE_LIST_USER:
      return Object.assign({}, state, { listUser: data.listUser });

    case UPDATE_USER_PAGE:
      return Object.assign({}, state, { page: data });
    case UPDATE_USER_IN_PAGE:
      let newState = Object.assign({}, state);
      if (newState.page) {
        for (let i = 0, n = newState.page.list.length; i < n; i++) {
          if (data.user._id === newState.page.list[i]._id) {
            newState.page.list[i] = data.user;
            break;
          }
        }
      }
      return newState;

    default:
      return state;
  }
}

// Actions -------------------------------------------------------------------------------------------------------------
export function updateLoginUser(user) {
  console.log(
    user != null ? "Login " + user.email + " as " + user.role + "." : "Logout!"
  );
  return { type: UPDATE_LOGIN_USER, loginUser: user };
}
export function updateListUser(users) {
  // console.log("updateListUser",users);
  return { type: UPDATE_LIST_USER, listUser: users };
}

export function updateUserPage(
  list,
  pageNumber,
  pageSize,
  pageTotal,
  totalItem
) {
  T.setPageInfo("User", pageNumber, pageSize);
  return {
    type: UPDATE_USER_PAGE,
    list,
    pageNumber,
    pageSize,
    pageTotal,
    totalItem,
  };
}

export function updateUserInPage(user) {
  return { type: UPDATE_USER_IN_PAGE, user };
}

export function checkToken(data, done) {
  return async (dispatch) => {
    try {
      if (AuthenticateService.getAuthenticate()) {
        const res = await HTTPService.sendRequest("post", "/user/checkToken");
        if (!res.success) {
          return { ok: true };
        }
      }
      return { ok: false };
    } catch (error) {
      return { ok: false, error };
    }
  };
}
export function loginWithEmailPassword(data, done) {
  return async (dispatch) => {
    try {
      const res = await HTTPService.sendRequest("post", "/user/login", data);
      if (!res.isError) {
        if (res.code == 200) {
          const loginUser = T.parseTokenUser(res.data[0]);
          dispatch(updateLoginUser(loginUser));
        }
        return { ok: true, body: res };
      } else {
        return { ok: false, error: res.message };
      }
    } catch (error) {
      return { ok: false, error };
    }
  };
}

export function getListUser(done) {
  return async (dispatch) => {
    const res = await HTTPService.sendRequest("get", "/user");
    if (!res.isError) {
      dispatch(updateListUser(res.data));
      return { ok: true, body: res };
    } else {
      return { ok: false, error: res.message };
    }
  };
}

export function createUser(data, done) {
  return async (dispatch) => {
    const res = await HTTPService.sendRequest("post", "/user", data);
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

export function updateInfoUser(data, done) {
  return async (dispatch) => {
    try {
      const id = data.id;
      let body = {};

      if (data.status != null) {
        body.status = data.status;
      }
      if (data.newPassword != null) {
        body.newPassword = data.newPassword;
      }

      const res = await HTTPService.sendRequest("put", `/user/${id}`, body);

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

export function updatePermission(data, userId) {
  return async (dispatch) => {
    try {
      const id = userId.toString();

      const res = await HTTPService.sendRequest(
        "put",
        `/permission/user/${id}`,
        data
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

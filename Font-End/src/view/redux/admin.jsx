import T from "../common/js/common";
import { HTTPService } from "../common/js/HTTPService";
let menus = T.getLocalStorage("menus");

let defaultState;
if (menus) {
  defaultState = {
    menu: menus,
  };
} else {
  defaultState = {
    menu: [
      {
        id: 1,
        text: "Trang Chủ",
        slug: "/",
        depth: 0,
        enableMega: true,
      },
      {
        id: 2,
        text: "Tin tức",
        slug: "/menu/admin",
        depth: 0,
        enableMega: false,
      },
      {
        id: 3,
        text: "Khoa Máy Tính",
        slug: "/menu/admin",
        depth: 1,
        enableMega: false,
      },
      {
        id: 4,
        text: "Khoa Vật liệu xây dựng",
        slug: "/menu/admin",
        depth: 1,
        enableMega: false,
      },
      {
        id: 5,
        text: "Khoa cơ khí",
        slug: "/menu/admin",
        depth: 1,
        enableMega: false,
      },
      {
        id: 6,
        text: "Khoa kỹ thuật hoá học",
        slug: "/menu/admin",
        depth: 2,
        enableMega: false,
      },
      {
        id: 7,
        text: "Khoa môi trường",
        slug: "/menu/admin",
        depth: 2,
        enableMega: false,
      },
      {
        id: 8,
        text: "Sự kiện",
        slug: "/menu/admin",
        depth: 0,
        enableMega: false,
      },
      {
        id: 9,
        text: "Liên hệ",
        slug: "/admin/menu",
        depth: 0,
        enableMega: false,
      },
      {
        id: 10,
        text: "Liên hệ",
        slug: "/admin/menu",
        depth: 1,
        enableMega: false,
      },
      {
        id: 11,
        text: "Liên hệ",
        slug: "/admin/menu",
        depth: 2,
        enableMega: false,
      },
    ],
  };
}

const UPDATE_MENU_STATE = "admin:updateMenu";
const ADD_MENU_STATE = "admin:addMenu";

// Reducer -------------------------------------------------------------------------------------------------------------
export default function adminReducer(state = defaultState, data) {
  switch (data.type) {
    case UPDATE_MENU_STATE:
      T.setLocalStorage("menus", data.menu);
      return Object.assign({}, state, { menu: data.menu });
    case ADD_MENU_STATE:
      const arrMenu = state.menu;
      arrMenu.push(data.newItem);
      T.setLocalStorage("menus", arrMenu);
      return Object.assign({}, state, { menu: arrMenu });
    default:
      return state;
  }
}

// Action --------------------------------------------------------------------------------------------------------------
export function updateMenuState(menu) {
  console.log("Action update menu: ", menu);
  return { type: UPDATE_MENU_STATE, menu: menu };
}
export function addMenuState(newItem) {
  // console.log("Action update menu: ", menu);
  return { type: ADD_MENU_STATE, newItem: newItem };
}
export function getCountSearch() {
  return async (dispatch) => {
    const res = await HTTPService.sendRequest("get", "/log/count");
    console.log("rest", res.data[0]);
    if (!res.isError) {
      return { ok: true, body: res };
    } else {
      return { ok: false, error: res.message };
    }
  };
}

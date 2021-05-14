import T from "../common/js/common";
import { HTTPService } from "../common/js/HTTPService";
import { AuthenticateService } from "../common/js/AuthenticateService";
import moment from "moment";

export function getLogs(data, done) {
  return async (dispatch) => {
    console.log("luowng tam thanh than", data);
    data.timeSearch = moment(data.timeSearch).format("YYYY-MM-DD");

    const res = await HTTPService.sendRequest("post", "/logs/search", data);
    if (!res.isError) {
      if (res.code == 200) {
        return { ok: true, body: res.data };
      } else {
        return { ok: false, error: res.message };
      }
    } else {
      return { ok: false, error: res.message };
    }
  };
}

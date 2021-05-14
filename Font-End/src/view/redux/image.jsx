import T from '../common/js/common';
import { HTTPService } from '../common/js/HTTPService';
import { AuthenticateService } from '../common/js/AuthenticateService';

export function uploadImage(data, done) {
    return async (dispatch) => {
        try {
            let headers = {
                'Authorization': 'Bearer ' + AuthenticateService.getAuthenticate(),
                'Content-Type': 'multipart/form-data',
                'accept': 'multipart/form-data'
            }
            console.log("dataa",data)
            
            const res = await HTTPService.sendRequest('post', '/image/upload', data , headers);
            if(res.success) {
                return {ok: true, body: res.data}
            } else {
                return {ok: false, error: res.message }
            }
        } catch(error) {
            return {ok: false, error: error.message};
        }
    }
}

export function getListImage(){
    return async (dispatch) => {
        try {
            let headers = {
                'Authorization': 'Bearer ' + AuthenticateService.getAuthenticate(),
                'Content-Type': 'multipart/form-data',
                'accept': 'multipart/form-data'
            }
          
            
            const res = await HTTPService.sendRequest('get', '/image/getList', headers);
            console.log("dataa",res.data)
            if(res.success) {
                return {ok: true, body: res.data}
            } else {
                return {ok: false, error: res.message }
            }
        } catch(error) {
            return {ok: false, error: error.message};
        }
    }
}

import { LocalStorageService } from './LocalStorageService';

const userKey = 'currentUser'

export const AuthenticateService = {
    setAuthenticateUser: (token) => {
        LocalStorageService.set(userKey, token)
        window.location.href = '/admin'
    },

    removeAuthenticate: () => {
        // console.log("removeAuth");
        LocalStorageService.remove(userKey)
        window.location.href = '/'
    },

    getAuthenticateUser: () => {
        try {
            let token = LocalStorageService.get(userKey),
                base64Url = token.split('.')[1],
                base64 = base64Url.replace('-', '+').replace('_', '/'),
                data = JSON.parse(window.atob(base64));
            return {
                email: data.email,
                userID: data._id,
                token: token,
                role: 'customer'
            }
        } catch (e) {
            return null;
        }
    },
    getAuthenticate: () => {
        return LocalStorageService.get(userKey);
    },
    isAuthenticate: () => {
        const user = LocalStorageService.get(userKey)
        if (!user) return false
        return true
    },
}
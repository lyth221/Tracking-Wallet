import PropTypes from 'prop-types';
import io from 'socket.io-client';
import dateformat from 'dateformat';
import routeMatcherLib from './routematcher.js';
import './sweetalert.min.js';

let T = {
    PropTypes,
    socket: io(),
    notify: (message, type) => $.notify({
        message
    }, {
        type,
        placement: {
            from: 'bottom'
        }
    }),

    isMobile: ('ontouchstart' in document.documentElement),
    randomPassword: length => Math.random().toString(36).slice(-length),

    defaultPageSize: 50,
    debug: (location.hostname === 'localhost' || location.hostname === '127.0.0.1'),

    routeMatcher: routeMatcherLib.routeMatcher,

    url: (url) => url + (url.indexOf('?') === -1 ? '?t=' : '&t=') + new Date().getTime(),
    download: (url, name) => {
        let link = document.createElement('a');
        link.target = '_blank';
        link.download = name;
        link.href = url;
        link.click();
    },

    cookie: (cname, cvalue, exdays) => {
        if (cvalue === undefined) {
            const name = cname + '=';
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        } else {
            let d = new Date();
            d.setTime(d.getTime() + ((exdays === undefined ? 60 : exdays) * 24 * 60 * 60 * 1000));
            document.cookie = cname + '=' + cvalue + ';expires=' + d.toUTCString() + ';path=/';
        }
    },

    onResize: () => {
        const marginTop = 6 + $('header').height(),
            marginBottom = 6 + $('footer').height();
        $('.site-content').css('margin', marginTop + 'px 0 ' + marginBottom + 'px 0');
    },

    getPageInfo: (name) => {
        let pageNumber = parseInt(T.cookie('pageNumber' + name)),
            pageSize = parseInt(T.cookie('pageSize' + name));

        if (isNaN(pageNumber)) {
            pageNumber = 1;
            T.cookie('pageNumber' + name, pageNumber);
        }

        if (isNaN(pageSize)) {
            pageSize = T.defaultPageSize;
            T.cookie('pageSize' + name, pageSize);
        }

        return {
            pageNumber,
            pageSize
        };
    },
    setPageInfo: (name, pageNumber, pageSize) => {
        T.cookie('pageNumber' + name, pageNumber);
        T.cookie('pageSize' + name, pageSize);
    },

    validateEmail: email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase()),

    dateToText: (date, format) => dateformat(date, format ? format : 'dd/mm/yyyy HH:mm:ss'),

    listeners: {},
    runListener: (listenerName) => {
        const listener = T.listeners[listenerName];
        if (listener) {
            Object.keys(listener).forEach(taskName => listener[taskName] && listener[taskName]());
        }
    },
    addListener: (listenerName, taskName, task) => {
        if (T.listeners[listenerName] == undefined || T.listeners[listenerName] == null) {
            T.listeners[listenerName] = {};
        }
        T.listeners[listenerName][taskName] = task;
    },
    removeListener: (listenerName, taskName) => {
        const tasks = T.listeners[listenerName];
        if (tasks) {
            tasks[taskName] = null;
        }
    },
    parseTokenUser: (jwtToken) => {
        try {
            let token = jwtToken,
                base64Url = token.split('.')[1],
                base64 = base64Url.replace('-', '+').replace('_', '/'),
                data = JSON.parse(window.atob(base64));
            return {
                email: data.email,
                userID: data._id,
                token: jwtToken,
                role: 'customer'
            }
        } catch(e) {
            return null;
        }
    },
    setLocalStorage: (key, value) => {
        window.localStorage.setItem(key, JSON.stringify(value))
    },
    getLocalStorage: (key) => {
        try {
			let data = JSON.parse(window.localStorage.getItem(key))
			return data
		} catch(e) {
			window.localStorage.removeItem(key);
        } 
        return null;
    }
};

const get2 = x => ('0' + x).slice(-2);

T.socket.on('connect', () => {
    if (T.connected === 0) {
        T.connected = true;
    } else if (T.debug) {
        location.reload();
    }
});
if (T.debug) {
    T.connected = 0;
    T.socket.on('reconnect_attempt', attemptNumber => T.connected = -attemptNumber);
    T.socket.on('debug', type => (type === 'reload') && location.reload());
}


$(() => {
    $(window).resize(T.onResize);
    setTimeout(T.onResize, 100);

    ['get', 'post', 'put', 'delete'].forEach(method => T[method] = (url, data, success, error) => {
        if (typeof data === 'function') {
            error = success;
            success = data;
        }
        $.ajax({
            url: T.url(url),
            data,
            type: method.toUpperCase(),
            success: data => {
                if (success) success(data)
            },
            error: data => {
                console.error('Ajax (' + method + ' => ' + url + ') has error. Error: ' + data);
                if (error) error(data)
            }
        })
    });
});

export default T;


Date.prototype.getText = function () {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.getMonth() + 1] + ' ' + get2(this.getDate()) + ', ' + this.getFullYear() + ' ' +
        get2(this.getHours()) + ':' + get2(this.getMinutes());
};
Date.prototype.getDateText = function () {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.getMonth() + 1] + ' ' + get2(this.getDate()) + ', ' + this.getFullYear();
};
Date.prototype.getTimeText = function () {
    return get2(this.getHours()) + ':' + get2(this.getMinutes());
};
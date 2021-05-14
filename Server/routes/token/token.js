"use strict";
const Joi = require("@hapi/joi");
const baseApiVersionUrl = "/api/v1/device";
const { getPriceToken } = require("../../service/price.js");
const DEVICE_API = [{
    method: "POST",
    path: baseApiVersionUrl + "/{token_address}/{decimal}/{address_pool}",
    config: {
        description: "Api testing device login",
        tags: ["api"],
        // pre: [{ method: _checkToken }],
        handler: async(request) => await getPriceToken(request.params),
    },
}, ];



module.exports = {
    DEVICE_API,
};
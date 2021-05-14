var ObjectId= require('mongoose').Types.ObjectId;

function validateStr(data) {
    try {
        data.forEach(function(d) {
            // validate type
            if (
                typeof(d.value) != "string"
                && typeof(d.value) != "undefined"
            ) {
                throw new Error(d.message || "Giá trị nhập vào không hợp lệ.");
            }

            // validate empty or not
            d.value = d.value && d.value.trim();
            if (!d.value) {
                if (!d.nullable) {
                    throw new Error(d.message || "Giá trị nhập vào không hợp lệ.");
                } else {
                    return true;
                }
            }
            
            // validate with format (string only)
            if (!d.format) {
                switch (d.type) {
                    case "email":
                        d.format = /^[a-zA-Z0-9_]*$/;
                        break;
                    default:
                        return true;
                }
            } 
            reg = new RegExp(d.format);
            if (reg.test(d.value)) {
                return true;
            } else {
                throw new Error(d.message || "Giá trị nhập vào không đúng định dạng");
            }
        });
    } catch (e) {
        throw e;
    }
}

function validateObj(data) {
    try {
        data.forEach(function(d) {
            // validate type
            if (
                typeof(d.value) != "object" 
                && !Array.isArray(d.value)
                && typeof(d.value) != "undefined"
            ) {
                throw new Error(d.message || "Giá trị nhập vào không hợp lệ.");
            }

            // validate empty or not
            if (!Object.keys(d.value).length) {
                if (!d.nullable) {
                    throw new Error(d.message || "Giá trị nhập vào không hợp lệ.");
                } else {
                    return true;
                }
            }
        });
    } catch (e) {
        throw e;
    }
}

function validateArr(data) {
    try {
        data.forEach(function(d) {
            // validate type
            if (
                !Array.isArray(d.value)
                && typeof(d.value) != "undefined"
            ) {
                throw new Error(d.message || "Giá trị nhập vào không hợp lệ.");
            }

            // validate empty or not
            if (!d.value.length) {
                if (!d.nullable) {
                    throw new Error(d.message || "Giá trị nhập vào không hợp lệ.");
                } else {
                    return true;
                }
            }
        });
    } catch (e) {
        throw e;
    }
}

function validateMongoId(id) {
    if (typeof(id) != "string") {
        throw new Error("Id không hợp lệ.");
    }

    if (!ObjectId.isValid(id)) {
        throw new Error("Id không đúng định dạng.")
    }
}

function validateBkuEmail(email) {
    return email.indexOf("@") < 0
}

function validateEnum(data) {
    try {
        data.forEach(function(d) {
            if (d.nullable) {
                if (!d.value) {
                    return true;
                }
            }

            if (d.e.indexOf(d.value) < 0) {
                throw new Error(d.message || "Giá trị không hợp lệ");
            }
        });
    } catch (e) {
        throw e;
    }
}

module.exports = {
    validateStr,
    validateObj,
    validateArr,
    validateMongoId,
    validateBkuEmail,
    validateEnum
}
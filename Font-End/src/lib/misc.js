var crypto = require("crypto");

function sha256(str) {
    var hash = crypto.createHash("sha256");
    return hash.update(str).digest("hex");
}

function convertToArray(val) {
    if (Array.isArray(val)) {
        return val;
    } else {
        return (val || (typeof (val) == "object" && Object.keys(val).length)) ? [val] : [];
    }
}

function uniquePrimitiveArray(arr) {
    var hash = {};
    for (var elem of arr) {
        hash[elem] = elem;
    }

    return Object.keys(hash);
}

function uniqueObjArray(arr, key) {
    var hash = {};
    for (var elem of arr) {
        hash[elem[key]] = elem;
    }

    return Object.keys(hash).map(k => hash[k]);
}

function extractField(obj, fieldList) {
    if (!obj) return {};
    
    var result = {};
    for (var index of fieldList) {
        if (obj[index]) {
            result[index] = obj[index];
        }
    }

    return result;
}

function filterObj(obj, cb) {
    var ret = {};

    var filteredKey = Object.keys(obj).filter(k => {
        var o = obj[k];
        return cb(o);
    });

    filteredKey.forEach(fk => ret[fk] = obj[fk]);

    return ret; 
}

module.exports = {
    uniquePrimitiveArray,
    uniqueObjArray,
    sha256,
    convertToArray,
    extractField,
    filterObj
}
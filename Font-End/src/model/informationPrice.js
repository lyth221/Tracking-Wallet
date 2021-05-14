var informationPriceSchema = require('../schema/informationPrice.js');
const moment = require('moment');

async function createData(data) {
    try {
        if (data.ma_bds != null) {

            const checkExist = await informationPriceSchema.findOne({ "ma_bds": data.ma_bds })
            let result = null
            if (checkExist == null) {
                result = await informationPriceSchema.create(data);
            } else {
                const history_price = checkExist.history_price;
                history_price.push({
                    date: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
                    tong_gia_ban_no_vat: checkExist.tong_gia_ban_no_vat,
                    so_tien_chiet_khau: checkExist.so_tien_chiet_khau,
                    gia_ban_sau_ck_chua_vat: checkExist.gia_ban_sau_ck_chua_vat,
                    time_start: checkExist.time_start,
                    time_end: checkExist.time_end
                })
                if (data.category_project == 'can_ho') {
                    result = await informationPriceSchema.updateOne({ "ma_bds": `${data.ma_bds}` },
                        {
                            $set: {
                                block: data.block,
                                ma_bds: data.ma_bds,
                                tang: data.tang,
                                vi_tri: data.vi_tri,
                                dtxd: data.dtxd,
                                dtsd: data.dtsd,
                                huong: data.huong,
                                huong_nhin: data.huong_nhin,
                                thiet_ke: data.thiet_ke,
                                tong_gia_ban_no_vat: data.tong_gia_ban_no_vat,
                                so_tien_chiet_khau: data.so_tien_chiet_khau,
                                gia_ban_sau_ck_chua_vat: data.gia_ban_sau_ck_chua_vat,
                                time_start: data.time_start,
                                time_end: data.time_end,
                                du_an: data.du_an,
                                ma_du_an: data.ma_du_an,
                                gi_chu: data.gi_chu,
                                history_price: history_price
                            }
                        }, { upsert: true })
                    return result;
                } else if (data.category_project == 'nha_pho') {
                    result = await informationPriceSchema.updateOne({ "ma_bds": `${data.ma_bds}` },
                        {
                            $set: {
                                mau_nha: data.mau_nha,
                                ma_bds: data.ma_bds,
                                phan_khu: data.phan_khu,
                                vi_tri: data.vi_tri,
                                dt_dat: data.dt_dat,
                                dt_san_xay_dung: data.dt_san_xay_dung,
                                huong: data.huong,
                                huong_nhin: data.huong_nhin,
                                lo_gioi: data.lo_gioi,
                                tong_gia_ban_no_vat: data.tong_gia_ban_no_vat,
                                so_tien_chiet_khau: data.so_tien_chiet_khau,
                                gia_ban_sau_ck_chua_vat: data.gia_ban_sau_ck_chua_vat,
                                time_start: data.time_start,
                                time_end: data.time_end,
                                du_an: data.du_an,
                                ma_du_an: data.ma_du_an,
                                status: data.status,
                                gi_chu: data.gi_chu,
                                category_project: data.category_project,
                                history_price: history_price
                            }
                        }, { upsert: true })
                    return result;
                }

            }
        }
    } catch (error) {
        throw error
    }
}
async function finByCode(query) {
    try {
        const result = await informationPriceSchema.findOne(query);
        return result;
    } catch (error) {
        throw e
    }
}
async function find(query = {}) {
    try {
        const result = await informationPriceSchema.find(query);
        return result;
    } catch (error) {
        throw e
    }
}
async function updateStatus(data) {
    try {
        const result = await informationPriceSchema.updateMany({ ma_du_an: data.projectCode }, {
            $set: {
                status: data.status
            }
        })
        return result
    } catch (error) {
        throw e
    }
}
module.exports = {
    createData,
    finByCode,
    find,
    updateStatus
};  
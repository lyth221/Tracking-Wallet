const mongoose = require('mongoose')

const InfomationPriceSchema = mongoose.Schema({
    block: String,
    ma_bds: String,
    tang: String,
    vi_tri: String,
    dtxd: Number,
    dtsd: Number,
    huong: String,
    huong_nhin: String,
    thiet_ke: String,
    tong_gia_ban_no_vat: Number,
    so_tien_chiet_khau: Number,
    gia_ban_sau_ck_chua_vat: Number,
    time_start: Date,
    time_end: Date,
    du_an: String,
    ma_du_an: String,
    status: String,
    gi_chu: String,
    history_price: Array,
    mau_nha: String,
    phan_khu: String,
    dt_dat: Number,
    dt_san_xay_dung: Number,
    lo_gioi: String,
    category_project: String,
}, {
    collection: 'information_price',
    strict: false
})

const InformationPriceModel = mongoose.model('information_price', InfomationPriceSchema)

module.exports = InformationPriceModel
var mongoose = require('mongoose');
var informationPriceModel = require("../../model/informationPrice");
var manageFileUploadModel = require("../../model/manageFileUpload");
var searchLogsApartment = require("../../model/logsSearchApartment");
var responseTemplate = require("../../helper/response-template");
var responseCode = require("../../constant/response-code");
var moment = require('moment');
var jwt = require("../../lib/jwt");
var config = require("../../../config.json");
const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const readXlsxFile = require('read-excel-file/node')



async function importFile(req, res) {
    try {

        var pathTemp = path.join(__dirname, '../../../asset/temp');
        var pathDest = path.join(__dirname, '../../../public/files');
        var getUploadForm = () => new multiparty.Form({
            uploadDir: pathTemp
        });
        var dataImport = []
        getUploadForm().parse(req, async(error, fields, files) => {
            var fileSrcPath = files.myFile[0].path;
            var fileName = files.myFile[0].originalFilename;
            var fileDestPath = `${pathDest}/${fileName}`
            var fileSrc = `/files/${fileName}`
            const fileInfo = {
                name: fileName,
                source: fileSrc,
                timeUpload: moment(new Date()).add(7, 'hours').format('YYYY-MM-DD hh:mm:ss')
            }

            await manageFileUploadModel.createData(fileInfo)
            fs.rename(fileSrcPath, fileDestPath, async function(err) {
                readXlsxFile(`${fileDestPath}`).then(async(rows) => {
                    for (let i = 1; i < rows.length; i++) {

                        if (rows[i][2] != null) {
                            let converDateStart = null
                            let converDateEnd = null
                            if (rows[i][13]) {
                                let converDateStartRaw = moment(rows[i][13], "YYYY-MM-DD")
                                converDateStart = moment(converDateStartRaw).format("YYYY-MM-DD")
                            }
                            if (rows[i][14]) {
                                let converDateEndRaw = moment(rows[i][14], "YYYY-MM-DD")
                                converDateEnd = moment(converDateEndRaw).format("YYYY-MM-DD")
                            }

                            let data = {}
                            if (fields.categoryProjectCode[0] == 'can_ho') {
                                data.block = rows[i][1],
                                    data.ma_bds = rows[i][2],
                                    data.tang = rows[i][3],
                                    data.vi_tri = rows[i][4],
                                    data.dtxd = parseFloat(rows[i][5]).toFixed(2),
                                    data.dtsd = rows[i][6],
                                    data.huong = rows[i][7],
                                    data.huong_nhin = rows[i][8],
                                    data.thiet_ke = rows[i][9],
                                    data.tong_gia_ban_no_vat = rows[i][10],
                                    data.so_tien_chiet_khau = rows[i][11],
                                    data.gia_ban_sau_ck_chua_vat = rows[i][12],
                                    data.time_start = converDateStart,
                                    data.time_end = converDateEnd,
                                    data.du_an = fields.projectName[0],
                                    data.ma_du_an = fields.projectCode[0],
                                    data.status = fields.status[0],
                                    data.gi_chu = rows[i][15],
                                    data.category_project = fields.categoryProjectCode[0],
                                    data.history_price = []
                            } else if (fields.categoryProjectCode[0] == 'nha_pho') {
                                data.mau_nha = rows[i][1],
                                    data.ma_bds = rows[i][2],
                                    data.phan_khu = rows[i][3],
                                    data.vi_tri = rows[i][4],
                                    data.dt_dat = parseFloat(rows[i][5]).toFixed(2),
                                    data.dt_san_xay_dung = parseFloat(rows[i][6]).toFixed(2),
                                    data.huong = rows[i][7],
                                    data.huong_nhin = rows[i][8],
                                    data.lo_gioi = rows[i][9],
                                    data.tong_gia_ban_no_vat = rows[i][10],
                                    data.so_tien_chiet_khau = rows[i][11],
                                    data.gia_ban_sau_ck_chua_vat = rows[i][12],
                                    data.time_start = converDateStart,
                                    data.time_end = converDateEnd,
                                    data.du_an = fields.projectName[0],
                                    data.ma_du_an = fields.projectCode[0],
                                    data.status = fields.status[0],
                                    data.gi_chu = rows[i][15],
                                    data.category_project = fields.categoryProjectCode[0],
                                    data.history_price = []
                            }
                            const response = await informationPriceModel.createData(data)
                        }

                    }
                })
                if (!err) {
                    return res.send(responseTemplate.success({
                        message: "Import data thành công."
                    }));
                } else {
                    return res.send(responseTemplate.error({
                        message: "Import data không thành công"
                    }));
                }
            });

        });

    } catch (error) {
        // console.log(error);
        return res.send(responseTemplate.internalError({
            message: error.message
        }));
    }
}

async function getData(req, res) {
    try {
        const toDate = moment(new Date()).format('YYYY-MM-DD')
        const query = { "status": "active" }
        const data = await informationPriceModel.find(query)
        let resData = []
        data.forEach(item => {
            let template = {}
            if (item.category_project == "can_ho") {
                template.block = item.block || ""
                template.ma_bds = item.ma_bds || ""
                template.tang = item.tang || ""
                template.vi_tri = item.vi_tri || ""
                template.dtxd = parseFloat(item.dtxd).toFixed(2) || ""
                template.dtsd = item.dtsd || ""
                template.huong = item.huong || ""
                template.huong_nhin = item.huong_nhin || ""
                template.thiet_ke = item.thiet_ke || ""
                template.tong_gia_ban_no_vat = item.tong_gia_ban_no_vat || ""
                template.so_tien_chiet_khau = item.so_tien_chiet_khau || ""
                template.gia_ban_sau_ck_chua_vat = item.gia_ban_sau_ck_chua_vat || ""
                template.time_start = moment(item.time_start).format("YYYY-MM-DD") || ""
                template.time_end = moment(item.time_end).format("YYYY-MM-DD") || ""
                template.gi_chu = item.gi_chu || ""
                template.fromDate = moment(item.time_start).format("DD/MM/YYYY") || ""
                template.toDate = moment(item.time_end).format("DD/MM/YYYY") || ""
                template.projectName = item.du_an
                template.projectCode = item.ma_du_an
                resData.push(template)
            } else if (item.category_project == "nha_pho") {
                template.mau_nha = item.mau_nha || ""
                template.ma_bds = item.ma_bds || ""
                template.phan_khu = item.phan_khu || ""
                template.vi_tri = item.vi_tri || ""
                template.dt_dat = parseFloat(item.dt_dat).toFixed(2) || ""
                template.dt_san_xay_dung = item.dt_san_xay_dung || ""
                template.huong = item.huong || ""
                template.huong_nhin = item.huong_nhin || ""
                template.lo_gioi = item.lo_gioi || ""
                template.tong_gia_ban_no_vat = item.tong_gia_ban_no_vat || ""
                template.so_tien_chiet_khau = item.so_tien_chiet_khau || ""
                template.gia_ban_sau_ck_chua_vat = item.gia_ban_sau_ck_chua_vat || ""
                template.time_start = moment(item.time_start).format("YYYY-MM-DD") || ""
                template.time_end = moment(item.time_end).format("YYYY-MM-DD") || ""
                template.gi_chu = item.gi_chu || ""
                template.fromDate = moment(item.time_start).format("DD/MM/YYYY") || ""
                template.toDate = moment(item.time_end).format("DD/MM/YYYY") || ""
                template.projectName = item.du_an
                template.projectCode = item.ma_du_an
                resData.push(template)
            }

        })
        resData.push(toDate)
        if (resData) {
            return res.send(responseTemplate.success({
                data: resData
            }));
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.SERVER_INTERNAL_ERROR
            }));
        }

    } catch (error) {
        return res.send(responseTemplate.internalError({
            message: error.message
        }));
    }
}

async function geDepartment(req, res) {
    try {
        let token = req.headers.authorization || req.body.jwt || req.query.jwt;
        let userData = await jwt.verify(token, config.app.jwt);
        const timeCheck = moment(new Date()).format("YYYY-MM-DD");
        userData.timeSearch = timeCheck
        userData.created_at = moment(new Date()).toDate()
        const timeSearch = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        const departmentCode = req.params.projectCode
        const query = { "ma_bds": departmentCode }
        const departmentData = await informationPriceModel.finByCode(query)
        let data = {}

        if (departmentData) {

            data.ma_bds = departmentData.ma_bds || ""
            data.vi_tri = departmentData.vi_tri || ""
            data.huong = departmentData.huong || ""
            data.huong_nhin = departmentData.huong_nhin || ""
            data.tong_gia_ban_no_vat = departmentData.tong_gia_ban_no_vat || ""
            data.so_tien_chiet_khau = departmentData.so_tien_chiet_khau || ""
            data.gia_ban_sau_ck_chua_vat = departmentData.gia_ban_sau_ck_chua_vat || ""
            data.time_start = departmentData.time_start == null ? null : moment(departmentData.time_start).format("YYYY-MM-DD")
            data.time_end = departmentData.time_end == null ? null : moment(departmentData.time_end).format("YYYY-MM-DD")
            data.gi_chu = departmentData.gi_chu || ""
            data.fromDate = departmentData.time_start == null ? "" : moment(departmentData.time_start).format("DD/MM/YYYY") || ""
            data.toDate = departmentData.time_end == null ? "khi có cập nhật mới." : moment(departmentData.time_end).format("DD/MM/YYYY") || ""
            data.timeSearch = moment(timeSearch).add(7, 'hours').format("DD/MM/YYYY HH:mm:ss") || ""
            data.category_project = departmentData.category_project
            data.project_code = departmentData.ma_du_an
            data.project_name = departmentData.du_an
            data.historyPrice = departmentData.history_price

            if (departmentData.category_project == 'can_ho') {
                data.block = departmentData.block || ""
                data.tang = departmentData.tang || ""
                data.dtxd = parseFloat(departmentData.dtxd).toFixed(2) || ""
                data.dtsd = departmentData.dtsd || ""
                data.thiet_ke = departmentData.thiet_ke || ""
            }

            if (departmentData.category_project == 'nha_pho') {
                data.mau_nha = departmentData.mau_nha || ""
                data.phan_khu = departmentData.phan_khu || ""
                data.dt_dat = departmentData.dt_dat || ""
                data.dt_san_xay_dung = departmentData.dt_san_xay_dung || ""
                data.lo_gioi = departmentData.lo_gioi || ""
            }
            const checkTimeShow = await compareTime(data.time_start, data.time_end, timeCheck)
            data.checkTimeShow = checkTimeShow
            await searchLogsApartment.createData(data, userData)
            return res.send(responseTemplate.success({
                data: data
            }));
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.SERVER_INTERNAL_ERROR
            }));
        }
    } catch (error) {
        return res.send(responseTemplate.internalError({
            message: error.message
        }));
    }
}

async function compareTime(fromDate, toDate, timeCheck) {

    let flag = true
    if (fromDate != null && toDate == null) {
        if (timeCheck < fromDate) {
            flag = false;
        }
    }

    if (fromDate == null && toDate != null) {
        if (timeCheck > toDate) {
            flag = false;
        }
    }
    if (fromDate != null && toDate != null) {
        if (fromDate < timeCheck && timeCheck > toDate) {
            flag = false;
        }
    }

    return flag;
}

module.exports = {
    importFile,
    getData,
    geDepartment,
    compareTime
}
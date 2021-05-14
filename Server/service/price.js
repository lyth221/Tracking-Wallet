const { number } = require('@hapi/joi');
const { getEtherBalances, getTokenBalances, getTokensBalance } = require('@iam4x/bsc-scan');
const axios = require('axios').default;

async function deviceConnect(data) {
    console.log("Device Id", data);
    return {
        code: 200,
        success: true,
        message: `Device ${data} connected`,
    };
}

async function getToken() {
    let provider = "https://bsc-dataseed1.defibit.io/"
    let address = "0xcddb8cfbf46c8459a451196d259c4e0e1b75999d"
    let tokens = ['0xca578afee65fd2268d383f8fc4a9fc6ae1d2def0', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c']
    let options = "0x86f25b64e1fe4c5162cdeed5245575d32ec549db"
    let result = ""
    let total_WBNB = ""
    let total_FAIR = ""
    let price = null
    let finalPrice = null


    await getTokensBalance(provider, address, tokens, options).then((res) => {
        console.log("resukt", res)
        total_WBNB = res["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"]
        total_FAIR = res["0xca578afee65fd2268d383f8fc4a9fc6ae1d2def0"]
        let temp_FAIR = parseFloat(total_FAIR) / Math.pow(10, 9)
        let temp_WBNB = parseFloat(total_WBNB) / Math.pow(10, 18)
        price = temp_WBNB / temp_FAIR
        console.log("FAIR", parseFloat(total_FAIR) / Math.pow(10, 9))
        console.log("WBNB", parseFloat(total_WBNB) / Math.pow(10, 18))
        console.log("price", price)

    })
    return {
        code: 200,
        success: true,
        mesage: price,
        token: "FAIR"
    };
}




module.exports = {

};
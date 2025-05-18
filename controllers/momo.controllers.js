const Payment = require("../models/payment.model");
const System = require("../models/system.model");
const express = require("express")
const crypto = require("crypto");
const axios = require("axios");
const User = require("../models/user.model");

var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

module.exports.momoPost = async (req, res) => {
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';

    // var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    // var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';

    var redirectUrl = 'http://localhost:3002/';
    var ipnUrl = 'https://5406-2402-800-61c3-611-f06f-fe7a-96ce-f9c0.ngrok-free.app/api';

    var requestType = "payWithMethod";
    var amount = '10000';
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });
    // option for axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }
    let result;
    try {
        result = await axios(options);
        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "server error"
        })
    }

};

module.exports.momoPostAll = async (req, res) => {

    try {
        if (req.body?.resultCode === 0) {
            const payment = await Payment.findOne({ orderId: req.body.orderId })
            payment.isPaid = true
            await payment.save()
            await User.updateOne({ _id: payment.user }, { level: 2 })
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports.transactionStatus = async (req, res) => {
    try {
        const { orderId } = req.body;
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: "MOMO",
            requestId: orderId,
            orderId: orderId,
            signature: signature,
            lang: 'vi'
        });

        const options = {
            method: "POST",
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': "application/json"
            },
            data: requestBody
        };

        const result = await axios(options);
        return res.status(200).json(result.data);
    } catch (error) {
        console.error("Transaction Status Error:", error.response?.data || error.message);
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi kiểm tra trạng thái giao dịch",
            detail: error.response?.data || error.message
        });
    }
};



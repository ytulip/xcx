//index.js
// var qcloud = require('../../vendor/wafer2-client-sdk/index')
// var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        phone: "",
        smsCode: "",
        openid: ""
    },


    onLoad: function (options) {

        var that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'passport/openid',
                        data: {
                            code: res.code
                        },
                        success: function (requestRes) {
                            console.log(requestRes);
                            // requestRes.data
                            that.setData(
                                {
                                    openid: requestRes.data.data
                                }
                            );
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },

    //开始去获取用户的openid哟

    bindPhoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },

    bindSmsCode: function (e) {
        this.setData({
            smsCode: e.detail.value
        })
    },


    takePartIn: function () {
        wx.request({
            url: 'http://lms.cc/activity/take-part-in',
            method: 'post',
            data: {phone: this.data.phone, register_sms_code: this.data.smsCode, openid: this.data.openid},
            success: function (res) {
                // console.log(res);

                console.log(res.data);
                if (res.data.status) {
                    //跳走到健康页面
                    wx.redirectTo({
                        url: 'pages/activity/health'
                    })
                } else {
                    wx.showToast({
                        title: res.data.desc,
                        icon: "none",
                        duration: 3000
                    });
                }
            }
        });
    },

    testTap: function () {
        // console.log('开始网络请求');

        //验证手机号是否格式有误
        if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test(this.data.phone))) {
            console.log('请输入正确的手机号:' + this.data.phone);
            return;
        }

        wx.request({
            url: 'http://lms.cc/passport/register-sms',
            method: 'post',
            data: {phone: this.data.phone, storage_type: 'cache'},
            success: function (res) {
                console.log(res);
            }
        });

        // wx.request({
        //     url: 'http://wp.zhuyan.me/api/open/news', //仅为示例，并非真实的接口地址
        //     data: {
        //     },
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: function(res) {
        //         console.log(res.data)
        //     }
        // });
        //
        // console.log('网络请求结束');
        // wx.showToast(123);
    },
});



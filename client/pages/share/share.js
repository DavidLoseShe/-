// pages/share/share.js
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    wifiSSID: '',
    wifiPassword: '',
    wifiShare: true
  },
  ssidBlur: function (e) {
    this.setData({
      wifiSSID: e.detail.value
    })
  },
  passBlur: function (e) {
    this.setData({
      wifiPassword: e.detail.value
    })
  },
  shareBlur: function (e) {
    this.setData({
      wifiShare: e.detail.value
    })
  },
  connetShare: function () {
    if (app.globalData.logged) {
      const that = this
      wx.startWifi({
        success: function (res) {
          wx.getWifiList()
          wx.onGetWifiList(function (res) {
            if (res.wifiList.length) {
              var breaknum = 'CONTINUE'
              for (var i = 0; i < res.wifiList.length; i++) {
                var ssid = res.wifiList[i].SSID
                var bssid = res.wifiList[i].BSSID
                if (res.wifiList[i].SSID == that.data.wifiSSID) {
                  wx.connectWifi({
                    SSID: ssid,
                    BSSID: bssid,
                    password: that.data.wifiPassword,
                    success: function (resres) {
                      that.setData({
                        btnState: true,
                        wifiButton: 'wifi已连接'
                      })
                      util.showSuccess('连接成功')
                      that.savaWifiInfo(that.data.wifiSSID, bssid, that.data.wifiPassword, that.data.wifiShare)
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../../pages/Main/Main'
                        })
                      }, 1500);
                    },
                    fail: function (resres) {
                      util.showModel('错误', '账号密码不匹配')
                      that.setData({
                        wifiPassword: ''
                      })
                    }
                  })
                }
              }
            }
          })
        },
        fail: function (res) {
          util.showModel('错误', '抱歉，不支持这个功能')
        }
      })
    }
    else {
      util.showModel('提示', '请先登录')
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/manage/manage'
        })
      }, 1500);
    }
  },
  savaWifiInfo: function (ssid, bssid, wifiPassword, wifiShare) {
    wx.request({            //请求后台保存wifi
      url: config.service.savewifiUrl,
      data: { wifiSsid: ssid, wifiBssid: bssid, wifiPassword: wifiPassword, wifiShare: wifiShare, wifiHost: app.globalData.userInfo.openId },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (wifilist) {
        util.showSuccess('wifi上传成功')
        that.setData({
          wifiSSID: '',
          wifiPassword: ''
        })
      },
      fail: function (e) {
        util.showModel('错误', 'wifi上传失败')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      logged: app.globalData.logged
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
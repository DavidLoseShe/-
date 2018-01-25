// pages/manage/manage.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
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
    takeSession: false,
    requestResult: '',
    manageWifi: false,
    manageOperating: false,
    ownWifiList: []
  },    // 用户登录示例
  login: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          app.globalData.userInfo = result
          app.globalData.logged = true
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              app.globalData.userInfo = result.data.data
              app.globalData.logged = true
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },
  shareWifi: function () {
    util.showModel('提示', '连接wifi即可分享')
    setTimeout(function () {
      wx.switchTab({
        url: '../../pages/share/share'
      })
    }, 1500);

  },
  queryOwnWifi: function () {
    if (this.data.logged) {
      if (this.data.manageOperating == false) {
        const that = this
        that.setData({
          manageWifi: !that.data.manageWifi,
          manageOperating: true
        })
        if (that.data.manageWifi) {
          wx.showLoading({
            title: '加载中',
          })
          setTimeout(function () {
            wx.request({            //请求后台查询自己的wifi
              url: config.service.ownWifiListUrl,
              data: { userOpenId: that.data.userInfo.openId },
              header: { 'content-type': 'application/json' }, // 默认值
              success: function (wifilist) {
                wx.hideLoading()
                that.setData({
                  manageOperating: false,
                  ownWifiList: wifilist.data
                })
                if (wifilist.data.length==0){
                  util.showModel('提示', '没有分享过wifi')
                }
                console.log(that.data.ownWifiList)
              },
              fail: function (e) {
                wx.hideLoading()
                util.showModel('错误', 'wifi查询失败')
                that.setData({
                  manageOperating: false
                })
              }
            })

          }, 1000)
        }
        else {
          that.setData({
            manageOperating: false,
            ownWifiList: null
          })
        }
      }
    }
    else {
      util.showModel('提示', '请先登录')
    }
  },
  updateWifiShareState: function (e) {
    var id = e.target.id
    console.log(id)
    if (this.data.logged) {
      if (this.data.manageOperating == false) {
        const that = this
        that.setData({
          manageOperating: true
        })
        wx.showLoading({
          title: '更新中',
        })
        setTimeout(function () {
          wx.request({            //请求后台查询自己的wifi
            url: config.service.shareWifiUrl,
            data: { wifiBssid: that.data.ownWifiList[id].wifiBssid, wifiState: e.detail.value },
            header: { 'content-type': 'application/json' }, // 默认值
            success: function (wifilist) {
              wx.hideLoading()
              util.showSuccess('更新成功')
              var wifistate = "ownWifiList[" + id + "].wifiState";
              var radio;
              if (e.detail.value == false) { radio = 'false' } else { radio = 'true' }
              that.setData({
                manageOperating: false,
                [wifistate]: radio
              })
            },
            fail: function (e) {
              wx.hideLoading()
              util.showModel('错误', '更改失败')
              that.setData({
                manageOperating: false
              })
            }
          })

        }, 1000)

      }
    }
    else {
      util.showModel('提示', '请先登录')
    }
  },
  linkWe: function () {
    wx.showModal({
      title: '温馨提示',
      showCancel: false,
      content: '\r\n联系开发者：781850123@qq.com',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
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
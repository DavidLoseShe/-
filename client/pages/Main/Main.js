// pages/Main/Main.js
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      { url: '../Main/pic002.jpg' },
      { url: '../Main/pic003.jpg' },
      { url: '../Main/pic001.jpg' }
    ],
    wifiOpen: false,
    btnState: false,
    wifiButton: '连接wifi',
    wifiSSID: '',
    wifiStrength: '强',
    wifiConencting: false
  }, connectWifi: function (r) {
    const that = this
    if (that.data.wifiConencting == false) {
      that.setData({
        wifiConencting: true
      });
      wx.showLoading({
        title: '匹配wifi中',
      })
      setTimeout(function () {
        wx.hideLoading()
        that.setData({
          wifiConencting: false
        });
      }, 8000)
      wx.startWifi({
        success: function (res) {
          wx.getWifiList()
          wx.onGetWifiList(function (res) {
            if (res.wifiList.length) {
              that.wifiPiPei(res.wifiList, 0) //依次匹配wifi
            } else {
              wx.hideLoading()
              util.showModel('错误', '附近没有wifi')
              that.setData({
              });
            }
          })
          // if (app.globalData.wifi!=null) break     
        }, fail: function (res) {
          wx.hideLoading()
          util.showModel('抱歉', '您不支持该功能')
          that.setData({
          });
        }
        // ,complete:function(){
        //   wx.hideLoading()
        //   that.setData({
        //     wifiConencting: false
        //   });
        // }
      }
      )

    }
  }, closeWifi: function (r) {
    const that = this
    wx.stopWifi({
      success: function (res) {
        that.setData({
          wifiButton: true
        })
      }
    })
  },
  wifiPiPei: function (wifiList, i) {
    console.log('333')
    const that = this
    var ssid = wifiList[i].SSID
    var bssid = wifiList[i].BSSID
    var wifiInfo = new Array()
    wx.request({            //请求后台wifiList
      url: config.service.wifiUrl,
      data: { wifiSsid: ssid, wifiBssid: bssid },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (wifilist) {
        wifiInfo = wifilist.data;
        if (wifiInfo.length > 0) {
          wx.hideLoading()
          console.log('123')
          wx.connectWifi({
            SSID: wifiInfo[0].wifiSsid,
            BSSID: bssid,
            password: wifiInfo[0].wifiPassword,
            success: function (resres) {
              that.setData({
                wifiConencting: false,
                btnState: true,
                wifiButton: 'wifi已连接',
              })
              util.showSuccess('连接成功')
            },
            fail: function (resres) {
              console.log('111')
              setTimeout(function () {
                if (wifiList.length > i + 1)
                  that.wifiPiPei(wifiList, i + 1)
                else {
                  console.log('222')
                  wx.hideToast()
                   util.showModel('抱歉', '连接失败')
                  that.setData({
                    wifiConencting: false
                  });
                }
              }, 3000)
            }
          })
          console.log('000')
        }
        else{
          setTimeout(function () {
            if (wifiList.length > i + 1)
              that.wifiPiPei(wifiList, i + 1)
            else {
              wx.hideLoading()
              util.showModel('抱歉', '附近没有小主分享过wifi')
              that.setData({
                wifiConencting: false
              });
            }
          }, 3000)
            // if (i + 1 == wifiList.length) {
            //   wx.hideLoading()
            //   util.showModel('抱歉', '附近没有小主分享过wifi')
            //   that.setData({
            //     wifiConencting: false
            //   });
            // }
        }

      }, fail: function (res) {
        wx.hideLoading()
        util.showModel('error', '数据库请求异常')
        that.setData({
          wifiConencting: false
        });
      }

    })
  }
  ,
  wifiCavas: function (wifiCanvasID, signalStrength) {
    const ctx = wx.createCanvasContext(wifiCanvasID)
    ctx.setGlobalAlpha(0.7)//画笔透明
    //画布-.-画起来兄弟
    ctx.beginPath()
    ctx.arc(100, 130, 95, 1.25 * Math.PI, 1.75 * Math.PI)
    ctx.arc(100, 130, 80, 1.75 * Math.PI, 1.25 * Math.PI, true)
    ctx.closePath()
    if (signalStrength > 80) {
      ctx.setFillStyle('#aa55FF')
      ctx.fill()
    } else {
      ctx.setStrokeStyle('#aa55FF')
      ctx.stroke()
    }


    ctx.beginPath()
    ctx.arc(100, 130, 70, 1.25 * Math.PI, 1.75 * Math.PI)
    ctx.arc(100, 130, 55, 1.75 * Math.PI, 1.25 * Math.PI, true)
    ctx.closePath()
    if (signalStrength > 60) {
      ctx.setFillStyle('#aa55FF')
      ctx.fill()
    } else {
      ctx.setStrokeStyle('#aa55FF')
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(100, 130, 45, 1.25 * Math.PI, 1.75 * Math.PI)
    ctx.arc(100, 130, 30, 1.75 * Math.PI, 1.25 * Math.PI, true)
    ctx.closePath()
    if (signalStrength > 40) {
      ctx.setFillStyle('#aa55FF')
      ctx.fill()
    } else {
      ctx.setStrokeStyle('#aa55FF')
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(100, 130, 20, 1.25 * Math.PI, 1.75 * Math.PI)
    ctx.arc(100, 130, 10, 1.75 * Math.PI, 1.25 * Math.PI, true)
    ctx.closePath()
    if (signalStrength > 20) {
      ctx.setFillStyle('#aa55FF')
      ctx.fill()
    } else {
      ctx.setStrokeStyle('#aa55FF')
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(100, 135, 5, 0, 2 * Math.PI)
    ctx.closePath()
    if (signalStrength > 0) {
      ctx.setFillStyle('#aa55FF')
      ctx.fill()
    } else {
      ctx.setStrokeStyle('#aa55FF')
      ctx.stroke()
    }

    ctx.draw()
  },
  wifiIconAnimation: function () {
    console.log('1')

  },
  wifiIcon: function () {
    const that = this
    // 旋转Y
    // this.animation.rotateY(180).step()
    // this.setData({
    //   animationData: this.animation.export()
    // })
    if (that.data.wifiOpen == false)
      wx.startWifi({
        success: function (res) {
          wx.getWifiList()
          wx.onGetWifiList(function (res) {
            if (res.wifiList.length) {
              var breaknum = 'CONTINUE'
              for (var i = 0; i < res.wifiList.length; i++) {
                if (res.wifiList[i].SSID == that.data.wifiSSID) {
                  that.wifiCavas('wifiCanvas', res.wifiList[i].signalStrength)
                  if (res.wifiList[i].signalStrength > 80) res.wifiList[i].signalStrength = '强'
                  else if (res.wifiList[i].signalStrength > 40) res.wifiList[i].signalStrength = '一般'
                  else res.wifiList[i].signalStrength = '弱'
                  that.setData({
                    wifiStrength: res.wifiList[i].signalStrength
                  })
                  breaknum = 'STOP'
                }
                if (breaknum == 'STOP') break
              }
            }
          })
        }
      })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    this.wifiCavas('wifiCanvas', 0)
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (networkType != 'wifi')
          that.setData({
            wifiOpen: true,
            btnState: false,
            wifiButton: '连接wifi',
            wifiStrength: '无',
            wifiSSID: '无'
          })
        else {
          that.setData({
            wifiOpen: false,
            btnState: true,
            wifiButton: 'wifi已连接'
          })
          wx.startWifi({
            success: function (res) {
            }
          })
          wx.getConnectedWifi({
            success: function (res) {
              var wifi = res.wifi
              var SSID = wifi.SSID
              var signalStrength = wifi.signalStrength
              var wifiStrength
              if (signalStrength > 80) wifiStrength = '强'
              else if (signalStrength > 40) wifiStrength = '一般'
              else wifiStrength = '弱'
              that.setData({
                wifiSSID: SSID,
                wifiStrength: wifiStrength
              })

              that.wifiCavas('wifiCanvas', signalStrength)

            },
            fail: function (res) {
              console.log(res.errMsg)
              util.showModel('错误', '获取wifi信息失败')
            }
          })
        }
      }
    })
    wx.onNetworkStatusChange(function (res) {
      var networkType = res.networkType
      if (networkType != 'wifi') {
        that.setData({
          wifiOpen: true,
          btnState: false,
          wifiButton: '连接wifi',
          wifiStrength: '无',
          wifiSSID: '无'
        })
        that.wifiCavas('wifiCanvas', 0)
      }
      else {
        that.setData({
          wifiOpen: false,
          btnState: true,
          wifiButton: 'wifi已连接'
        })
        wx.startWifi({
          success: function (res) {
          }
        })
        wx.getConnectedWifi({
          success: function (res) {
            var wifi = res.wifi
            var SSID = wifi.SSID
            var signalStrength = wifi.signalStrength
            var wifiStrength
            if (signalStrength > 80) wifiStrength = '强'
            else if (signalStrength > 40) wifiStrength = '一般'
            else wifiStrength = '弱'
            that.setData({
              wifiSSID: SSID,
              wifiStrength: wifiStrength
            })
            that.wifiCavas('wifiCanvas', signalStrength)

          },
          fail: function (res) {
            console.log(res.data)
            util.showModel('错误', '获取wifi信息失败')
          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    setInterval(function () {
      //循环执行代码  
      that.wifiIcon()
    }, 5000) //循环时间 这里是1秒    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    that.wifiIcon()
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (networkType != 'wifi')
          that.setData({
            wifiOpen: true,
            btnState: false,
            wifiButton: '连接wifi',
            wifiStrength: '无',
            wifiSSID: '无'
          })
        else {
          that.setData({
            wifiOpen: false,
            btnState: true,
            wifiButton: 'wifi已连接'
          })
          wx.startWifi({
            success: function (res) {
            }
          })
          wx.getConnectedWifi({
            success: function (res) {
              var wifi = res.wifi
              var SSID = wifi.SSID
              var signalStrength = wifi.signalStrength
              var wifiStrength
              if (signalStrength > 80) wifiStrength = '强'
              else if (signalStrength > 40) wifiStrength = '一般'
              else wifiStrength = '弱'
              that.setData({
                wifiSSID: SSID,
                wifiStrength: wifiStrength
              })

              that.wifiCavas('wifiCanvas', signalStrength)

            },
            fail: function (res) {
              console.log(res.errMsg)
              util.showModel('错误', '获取wifi信息失败')
            }
          })
        }
      }
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
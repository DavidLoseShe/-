const { mysql } = require('../qcloud')
// const uuid = require('node-uuid')

module.exports = async ctx => {
  //var wifiHost = ctx.query.userOpenId
  var wifiBssid = ctx.query.wifiBssid
  var wifiState = ctx.query.wifiState
  await mysql("wifiinfo").update({ wifiState }).where({ wifiBssid })  // 改
  ctx.body = '123'
}
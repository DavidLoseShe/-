const { mysql } = require('../qcloud')
// const uuid = require('node-uuid')

module.exports = async ctx => {
  var wifiHost = ctx.query.userOpenId

  var res = await mysql("wifiinfo").where({ wifiHost })// 查

  ctx.body = res
}
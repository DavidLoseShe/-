const { mysql } = require('../qcloud')
// const uuid = require('node-uuid')

module.exports = async ctx => {
  var wifiBssid = ctx.query.wifiBssid
  var wifiSsid = ctx.query.wifiSsid
  // var wifiSsid =wifi.wifiSsid
  // var id = uuid.v1()
  // 增
  // var book = {
  //   id: id,
  //   name: "冰与火之歌",
  //   price: 88
  // }
  // await mysql("Book").insert(book)

  var res = await mysql("wifiinfo").where({ wifiBssid })   // 查

  // await mysql("Book").update({ price: 66 }).where({ id })  // 改

  // await mysql("Book").del().where({ id })    // 删
  if (res.length > 0) {
    if (res[0].wifiState == 'true') {
      ctx.body = res
    }
    else {
      ctx.body = []
    }
  }
  else {
    ctx.body = []
  }
}

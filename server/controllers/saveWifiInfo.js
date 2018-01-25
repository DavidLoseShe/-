const { mysql } = require('../qcloud')
// const uuid = require('node-uuid')

module.exports = async ctx => {
  var wifiBssid = ctx.query.wifiBssid
  var wifiSsid = ctx.query.wifiSsid
  var wifiPassword = ctx.query.wifiPassword
  var wifiState = ctx.query.wifiShare
  var wifiHost = ctx.query.wifiHost
  // var wifiSsid =wifi.wifiSsid
  // var id = uuid.v1()
  // 增
  // var book = {
  //   id: id,
  //   name: "冰与火之歌",
  //   price: 88
  // }
  var wifiinfo = {
    wifiBssid: wifiBssid,
    wifiSsid: wifiSsid,
    wifiPassword: wifiPassword,
    wifiState: wifiState,
    wifiHost: wifiHost
  }
  var result =null;
  var res = await mysql("wifiinfo").where({ wifiBssid }) 
  if(res.length==0){ 

    await mysql("wifiinfo").insert(wifiinfo)
 }
 else{
    result = await mysql("wifiinfo").update({ wifiBssid,wifiSsid, wifiPassword, wifiState, wifiHost }).where({ wifiBssid })
 }
  //var res = await mysql("wifiinfo").where({ wifiSsid })   // 查

  // await mysql("Book").update({ price: 66 }).where({ id })  // 改

  // await mysql("Book").del().where({ id })    // 删

  ctx.body = wifiinfo
}

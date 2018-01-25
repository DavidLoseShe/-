/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://461235700.guhaolove2018.xyz';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    //匹配wifi对象
    wifiUrl: `${host}/weapp/wifiList`,
    //保存wifi对象
    savewifiUrl: `${host}/weapp/saveWifiInfo`,
    //查询个人wifi信息
    ownWifiListUrl: `${host}/weapp/ownWifiList`,
    ///更新分享wifi信息
    shareWifiUrl: `${host}/weapp/shareWifi`
  }
};

module.exports = config;

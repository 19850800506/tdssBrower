// const url = "http://192.168.3.4:5700";
const url = "http://www.tdss.website:5700"
// const url = "https://web.tdss.com.cn/tdss";

window.config = {
  uavModel:'http://192.168.3.121:8080/data/uav.gltf',
  // uavModel:'http://172.29.93.166:5700/client/data/uav.gltf',

  carModel:'http://192.168.3.121:8080/data/car.glb',
  // carModel:'http://172.29.93.166:5700/client/data/car.glb',
  disUser:['stri3'],
  radioShow:false,
  baseUrl: url,

  jammin:url + "/api/jammin",
  dynamic:url + "/api/dynamic",
  operate:url + "/api/operate",
  authority:  url + '/api/authority/',
  geoStorage:  url + '/api/geostorage/',
  radioUrl:  "http://192.168.3.101:5778",
  
  sharedUrl: url + "/api/shared/",
  serverUrl: url + "/api/server/",
  heartbeatUrl: url + "/api/heartbeat/",
  wsSharedUrl: "ws:"+url.slice(5)+"/ws/websocketserver/websocket",
  wsServerUrl: "ws:"+url.slice(5)+"/ws/websocketserver/websocket",
  scaleplateUrl: 'http://192.168.3.101:5777/',
  uavImage:'http://20.19.203.133:81/uavImages/',
  flvLiveUrl: 'http://192.168.3.42:8080',
};

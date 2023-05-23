// 设置--打击方式
export const attackMode = [
  {
    type: 'autoset',
    title: '自动打击',
    state: false,
  },
  {
    type: 'electronicfence',
    title: '电子围栏',
    state: true,
  },
]
// 设置--三维场景配置
export const threeMode = [
  {
    type: 'showtrack',
    title: '显示无人机轨迹',
    state: true,
  },
  {
    type: 'radarsim',
    title: '雷达仿真显隐',
    state: true,
  },
  {
    type: 'architectmode',
    title: '建筑三维模型',
    state: true,
  },
  {
    type: 'equipmentmode',
    title: '设备三维模型', // 除雷达外其他显隐
    state: true,
  },
  {
    type: 'yinxiangmap',
    title: '影像图',
    state: false,
  },
  {
    type: 'xianhuamap',
    title: '线划图',
    state: false,
  },
  {
    type: 'ersanwei',
    title: '二三维切换',
    state: true,
  },
]
// 探测设备特效展示顺序
let findEffectIndex = ['aoa','tdoa','crack','circular']
// 探测设备特效展示顺序
let attackEffectIndex = ['omni','guide','crack']


// 设备常数定义
const deviceDefine = {
  "radar": {
    name: '雷达', // 名称
    use: 'find', // 用途 find 探测  /attack 打击
    effectType:['radar'], //设备特效
    effectStyle: { // 特效样式
      color: '#99FFFF',
      opacity: 0.3,
      radius: 3000
    },
  },
  "aoa": {
    name: 'AOA',
    use: 'find',
    effectType:['radar'], 
    effectStyle: {
      color: '#99FFFF',
      opacity: 0.3,
      radius: 3000
    }
  },
  "tdoa": {
    name: '无线电侦测',
    use: 'find',
    effectType:['radar'], 
    effectStyle: {
      color: '#99FFFF',
      opacity: 0.3,
      radius: 3000
    }
  },
  'direct': {
    name: '定向',
    use: 'attack',
    effectType:['sector'], 
    effectStyle: {
      color: '#ecc34d',
      opacity: 0.2,
      radius: 3000,
      startAngle: 0,
      endAngle: 120
    }
  },
  'omni': {
    name: '全向',
    use: 'attack',
    effectType:['sector'], 
    effectStyle: {
      color: '#ecc34d',
      opacity: 0.3,
      radius: 3000,
      startAngle: 0,
      endAngle: 360
    }
  },
  'crack': {
    name: '协议破解',
    use: 'find & attack',
    effectType:['radar', 'sector'], 
    effectStyle: {
      radar: {
        color: '#99FFFF',
        opacity: 0.3,
        radius: 3000
      },
      sector: {
        color: '#ecc34d',
        opacity: 0.2,
        radius: 3000,
        startAngle: 0,
        endAngle: 360
      }
    }
  },
  'guide': {
    name: '诱导',
    use: 'attack',
    effectType:['sector'], 
    effectStyle: {
      color: '#ecc34d',
      opacity: 0.3,
      radius: 3000,
      startAngle: 0,
      endAngle: 360
    }
  },
  'circular': {
    name: '周扫',
    use: 'find',
    effectType:['radar'], 
    effectStyle: {
      color: '#99FFFF',
      opacity: 0.3,
      radius: 3000
    }
  },
  'turntable': {
    name: '转台',
    use: 'other',
    effectType:['sector'], 
    effectStyle: {
      color: '#ecc34d',
      opacity: 0.2,
      radius: 3000,
      startAngle: 0,
      endAngle: 120
    }
  },
  'detect': {
    name: '面阵',
    use: 'attack',
    effectType:['sector'], 
    effectStyle: {
      color: '#ecc34d',
      opacity: 0.2,
      radius: 3000,
      startAngle: 0,
      endAngle: 120
    }
  },
  'car': {
    name: '车',
    use: 'other',
    effectType:['radar'], 
    effectStyle: {
      color: '#99FFFF',
      opacity: 0.3,
      radius: 3000
    },
    model:'',
  }
}


for(let key in deviceDefine) {
  // 添加排序字段
  if(deviceDefine[key]['use'].includes('find')){
    findEffectIndex = findEffectIndex.reverse()
    deviceDefine[key]['effectIndex'] = findEffectIndex.findIndex(el=>el === key) + 2
  }else if(deviceDefine[key]['use'].includes('attack')){
    deviceDefine[key]['effectIndex'] = attackEffectIndex.findIndex(el=>el === key) + 2
  }
  
}
export  {deviceDefine}
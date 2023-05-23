<template>
  <div id="place">
    <!-- <header-place /> -->
    <div class="content">
      <div class="tree-content">
        <!-- <placeTree :treeData="placeDate" /> -->
        <place></place>
      </div>
      <!-- <detail /> -->
    </div>
  </div>
</template>
<script>
import placeTree from './placeTree.vue'
import place from './place.vue'

import detail from './detail.vue'
import headerPlace from '@/layout/components/headerPlace.vue'

export default {
  components: {
    place,
    placeTree,
    detail,
    headerPlace,
  },
  data() {
    return {
      placeDate: {},
    }
  },
  mounted() {
    // const place = require('./place.json')
    // this.placeDate = place.data.find((el) => el.name === '博鳌防区')
    // 数据转换 转成name children 数据
    const data = {
      name: '博鳌防区',
      children: [
        {
          name: '博鳌机场',
          children: [
            {
              count: 0,
              name: '雷达',
              children: [],
            },
            {
              count: 0,
              name: '声纹',
              children: [],
            },
            {
              count: 1,
              name: 'AOA',
              children: [
                {
                  id: '1090003001000125',
                  name: '博鳌机场AOA',
                  longitude: 110.462249,
                  latitude: 19.140181,
                  type: 'aoa',
                  effect: 3000,
                  altitude: 20,
                },
              ],
            },
            {
              count: 0,
              name: 'TDOA',
              children: [],
            },
            {
              count: 0,
              name: '定向',
              children: [],
            },
            {
              count: 1,
              name: '全向',
              children: [
                {
                  id: '1090006001000143',
                  name: '博鳌机场全向打击',
                  longitude: 110.462249,
                  latitude: 19.140181,
                  type: 'omni',
                  effect: 3000,
                  altitude: 20,
                },
              ],
            },
            {
              count: 0,
              name: '协议破解',
              children: [],
            },
            {
              count: 0,
              name: '视频',
              children: [],
            },
            {
              count: 0,
              name: '诱导',
              children: [],
            },
            {
              count: 0,
              name: '周扫',
              children: [],
            },
            {
              count: 0,
              name: '转台',
              children: [],
            },
          ],
        },
        {
          name: '博鳌检查站',
          children: [
            {
              count: 0,
              name: '雷达',
              children: [],
            },
            {
              count: 0,
              name: '声纹',
              children: [],
            },
            {
              count: 1,
              name: 'AOA',
              children: [
                {
                  id: '1090003001000229',
                  name: '翁坎检查站AOA',
                  longitude: 110.522132,
                  latitude: 19.117242,
                  type: 'aoa',
                  effect: 3000,
                  altitude: 20,
                },
              ],
            },
            {
              count: 0,
              name: 'TDOA',
              children: [],
            },
            {
              count: 0,
              name: '定向',
              children: [],
            },
            {
              count: 1,
              name: '全向',
              children: [
                {
                  id: '1090006001000247',
                  name: '翁坎检查站全向打击',
                  longitude: 110.522132,
                  latitude: 19.117242,
                  type: 'omni',
                  effect: 3000,
                  altitude: 20,
                },
              ],
            },
            {
              count: 0,
              name: '协议破解',
              children: [],
            },
            {
              count: 0,
              name: '视频',
              children: [],
            },
            {
              count: 0,
              name: '诱导',
              children: [],
            },
            {
              count: 0,
              name: '周扫',
              children: [],
            },
            {
              count: 0,
              name: '转台',
              children: [],
            },
          ],
        },
        {
          name: '博鳌核心区',
          children: [
            {
              count: 0,
              name: '雷达',
              children: [],
            },
            {
              count: 0,
              name: '声纹',
              children: [],
            },
            {
              count: 0,
              name: 'AOA',
              children: [],
            },
            {
              count: 4,
              name: 'TDOA',
              children: [
                {
                  id: '1090004001000547',
                  name: '国宾馆五号楼TDOA',
                  longitude: 110.55635,
                  latitude: 19.137963,
                  type: 'tdoa',
                  effect: 3000,
                  altitude: 20,
                },
                {
                  id: '1090004001000651',
                  name: '国宾馆一号楼TDOA',
                  longitude: 110.553383,
                  latitude: 19.13866,
                  type: 'tdoa',
                  effect: 3000,
                  altitude: 30,
                },
                {
                  id: '1090004001000755',
                  name: '美丽熙海岸TDOA',
                  longitude: 110.574661,
                  latitude: 19.164754,
                  type: 'tdoa',
                  effect: 3000,
                  altitude: 20,
                },
                {
                  id: '1090004001000859',
                  name: '冬屿岛大酒店TDOA',
                  longitude: 110.573793,
                  latitude: 19.143397,
                  type: 'tdoa',
                  effect: 3000,
                  altitude: 10,
                },
              ],
            },
            {
              count: 1,
              name: '定向',
              children: [
                {
                  id: '1090005001000137',
                  name: '国宾馆五号楼定向打击',
                  longitude: 110.556215,
                  latitude: 19.13787,
                  type: 'direct',
                  effect: 3000,
                  altitude: 20,
                },
              ],
            },
            {
              count: 2,
              name: '全向',
              children: [
                {
                  id: '1090006001000351',
                  name: '国宾馆一号楼全向打击',
                  longitude: 110.553383,
                  latitude: 19.13866,
                  type: 'omni',
                  effect: 3000,
                  altitude: 20,
                },
                {
                  id: '1090006001000455',
                  name: '美丽熙海岸全向打击',
                  longitude: 110.574661,
                  latitude: 19.164754,
                  type: 'omni',
                  effect: 3000,
                  altitude: 100,
                },
              ],
            },
            {
              count: 1,
              name: '协议破解',
              children: [
                {
                  id: '1090007001000149',
                  name: '冬屿岛大酒店协议破解',
                  longitude: 110.573793,
                  latitude: 19.143397,
                  type: 'crack',
                  effect: 3000,
                  altitude: 20,
                },
              ],
            },
            {
              count: 1,
              name: '视频',
              children: [
                {
                  id: '1090008001000155',
                  name: '国宾馆五号楼光电',
                  longitude: 110.556215,
                  latitude: 19.13787,
                  type: 'video',
                  effect: 1500,
                  altitude: 20,
                },
              ],
            },
            {
              count: 0,
              name: '诱导',
              children: [],
            },
            {
              count: 0,
              name: '周扫',
              children: [],
            },
            {
              count: 0,
              name: '转台',
              children: [],
            },
          ],
        },
      ],
    }

    this.placeDate = this.dealData([data])
    // console.log(this.placeDate)
  },
  methods: {
    // 数据处理
    dealData(tree) {
      function loopFun(data, func) {
        data.forEach((el, i) => {
          // 移除chilren为空的节点
          if (
            Object.keys(el).includes('children') &&
            el.children.length === 0
          ) {
            data.splice(i, 1)
          }
          func(el, i + 1)
          if (el.children && el.children.length) {
            loopFun(el.children, func)
          }
          el.children && loopFun(el.children, func)
        })
      }

      loopFun(tree, (node, index) => {
        // 添加节点id
        node.nodeId = node.nodePId ? `${node.nodePId}-${index}` : `${index}`
        // 节点层级
        node.level = node.nodeId.split('-').length
        // 判断是否叶子节点
        if (Object.keys(node).includes('children')) {
          if (node.children.length) {
            node.children.forEach((el) => {
              el.nodePId = node.nodeId
              el.pData = node
            })
          }
          node.isLeaf = false
        } else {
          node.isLeaf = true
        }
        // 是否是第一个节点
        if (index === 1) {
          node.isFirst = true
        }
        // 是否是最后一个节点
        if (
          node.pData &&
          node.pData.children &&
          node.pData.children.length &&
          index === node.pData.children.length
        ) {
          node.isLast = true
        }
      })

      return tree[0]
    },
  },
}
</script>
<style lang="scss">
#place {
  width: 100%;
  height: 100vh;
  // height: 100%;
  // background-color: #0e3234;
  color: #fff;
  .content {
    // height: calc(100vh - 79px);
    display: flex;
    background-image: url('../../assets/images/placeBg.png');
    background-size: 100% 100%;
    .tree-content {
      z-index: 9;
      width: 100%;
      height: 100%;
      background-color: rgba(14, 50, 52, 0.8);
      padding: 20px 0 160px 200px;
    }
  }
}

// .tree-diagram ul {
//   display: flex;
//   flex-direction: column;
//   position: relative;

//   /* Reset ul 样式*/
//   list-style-type: none;
//   margin: 0;
//   padding: 2px 0 2px 60px;
// }

// .tree-diagram ul ul::before {
//   border-top: 2px solid #a0a0a0;
//   content: '';

//   /* Position */
//   position: absolute;
//   bottom: 0;
//   left: 0;

//   /* Size */
//   width: 60px;
//   height: 50%;
// }

// .tree-diagram li {
//   display: flex;
//   padding: 2px 0 2px 60px;
//   position: relative;

//   /* Center the content */
//   align-items: center;
// }

// .tree-diagram li::before {
//   border-left: 2px solid #a0a0a0;
//   border-bottom: 2px solid #a0a0a0;
//   content: '';

//   /* Position */
//   position: absolute;
//   left: 0;
//   bottom: 50%;

//   /* Size */
//   width: 60px;
//   height: 50%;
// }

// .tree-diagram li::after {
//   border-left: 2px solid #a0a0a0;
//   content: '';

//   /* Position */
//   position: absolute;
//   left: 0;
//   bottom: 0;

//   /* Size */
//   width: 60px;
//   height: 50%;
// }

// .tree-diagram li:first-child::before,
// .tree-diagram li:last-child::after {
//   /* Remove the top of border from the first and last items */
//   border-left: none;
// }

// .tree-diagram li:last-child::before {
//   /* Remove the top of border from the first and last items */
//   border-bottom-left-radius: 4px;
// }
// .tree-diagram li:first-child::before {
//   /* Remove the top of border from the first and last items */
//   border-bottom: none;
// }
// .tree-diagram li:not(.tree-diagram_root):first-child::after {
//   /* Remove the top of border from the first and last items */
//   border-top: 2px solid #a0a0a0;
//   border-top-left-radius: 4px;
// }
</style>

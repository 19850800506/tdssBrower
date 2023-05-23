<template>
  <div class="tree-custom" @click.stop="clickNode(treeData)">
    <!-- v-if="(treeData.children && treeData.children.length) || treeData.isLeaf" -->
    <div
      class="node-label"
      :class="{ 'node-label-first': treeData.level === 1 }"
    >
      {{ treeData.name }}
      <span>{{ treeData.nodeId }}</span>
    </div>
    <div class="tree-custom-node">
      <place-tree
        v-for="(children, index) in treeData.children"
        :key="index"
        :treeData="children"
        v-bind="$attrs"
        v-on="$listeners"
      >
      </place-tree>
    </div>
  </div>
</template>
<script>
export default {
  name: 'placeTree',
  props: {
    treeData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {},
  data() {
    return {
      nodeDate: null,
    }
  },
  mounted() {
    // const data = JSON.parse(JSON.stringify(this.treeData))
    // // this.dealData([data])
    // this.nodeDate = this.dealData([data])
    // console.log(this.nodeDate)
  },
  methods: {
    // nodeShow(node){
    //   if(Object.keys(node).includes('children')){

    //   }else {
    //     return true
    //   }
    // },
    // 点击节点
    clickNode(node) {
      console.log(node)
    },
  },
}
</script>
<style lang="scss">
// .tree-custom {
//   display: flex;
//   position: relative;
//   align-items: center;
//   height: 100%;
//   .node-label {
//     display: flex;
//     align-items: center;
//     padding-left: 60px;
//     min-width: 200px;
//     width: 200px;
//     &::after {
//       border-left: 2px solid #a0a0a0;
//       content: '';
//       position: absolute;
//       bottom: 50%;
//       left: 0;
//       width: 60px;
//       height: 50%;
//     }
//   }
//   .tree-custom-node {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     height: 100%;

//     div:first-child {
//       > .node-label {
//         &::after {
//           border-left: none;
//         }
//       }
//     }
//     div:last-child {
//       &::after {
//         border-left: none;
//       }
//     }
//   }
//   &::before {
//     border-top: 2px solid #a0a0a0;
//     content: '';
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     width: 60px;
//     height: 50%;
//   }
//   &::after {
//     border-left: 2px solid #a0a0a0;
//     content: '';
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     width: 60px;
//     height: 50%;
//   }
//   .node-label-first {
//     width: 60px;
//     height: 280px;
//     writing-mode: vertical-rl;
//     text-align: center;
//     display: flex;
//     // flex-direction: column;
//     justify-content: center;
//   }
// }

// .tree-custom > div::before {
//   border-top: 2px solid #a0a0a0;
//   content: '';

//   position: absolute;
//   bottom: 0;
//   left: 0;

//   width: 60px;
//   height: 50%;
// }
// .tree-custom > div::after {
//   border-left: 2px solid #a0a0a0;
//   content: '';

//   position: absolute;
//   left: 0;
//   bottom: 0;

//   width: 60px;
//   height: 50%;
// }
// .tree-diagram li {
//   display: flex;
//   padding: 2px 0 2px 60px;
//   position: relative;

//   align-items: center;
// }

// .tree-diagram li::before {
//   border-left: 2px solid #a0a0a0;
//   border-bottom: 2px solid #a0a0a0;
//   content: '';

//   position: absolute;
//   left: 0;
//   bottom: 50%;

//   width: 60px;
//   height: 50%;
// }

// .tree-diagram li:first-child::before,
// .tree-diagram li:last-child::after {
//   border-left: none;
// }

// .tree-diagram li:last-child::before {
//   border-bottom-left-radius: 4px;
// }
// .tree-diagram li:first-child::before {
//   border-bottom: none;
// }
// .tree-diagram li:not(.tree-diagram_root):first-child::after {
//   border-top: 2px solid #a0a0a0;
//   border-top-left-radius: 4px;
// }
</style>

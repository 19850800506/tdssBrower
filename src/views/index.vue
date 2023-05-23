<template>
  <div id="index">
    <map-control v-show="dateViewShow" />
    <dataView />
    <Login />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mapControl from './mars3d/mapControl.vue'
import dataView from './dataView/index.vue'
import Login from './login.vue'

export default {
  name: 'Index',
  computed: {
    ...mapGetters(['dateViewShow']),
  },
  data() {
    return {
      sectorTree: [], // 防区树形结构
    }
  },
  components: {
    mapControl,
    dataView,
    Login,
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss">
#index {
  position: relative;
  color: #d3d6dd;
  background-color: #000000;
  width: 100%;
  // min-width: 1366px;
  height: 100vh;
}
</style>

<template>
  <div
    id="xianttiao"
    :class="animated ? 'animat' : ''"
    :style="compStyle"
  ></div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'xianttiao', // 线条封装组件
  props: ['height', 'time', 'bgcolor', 'serverdata', 'animated'],
  computed: {
    compStyle() {
      return {
        '--height': `${Math.random() * this.height}px`,
        '--time': `${Math.random() * this.time}s`,
        '--bgcolor': this.bgcolor,
      }
    },
  },
}
</script>
<style scoped lang="scss">
@keyframes animated-height {
  0% {
    height: 0%;
  }
  100% {
    height: var(--height);
  }
}
#xianttiao {
  width: 2px;
  background: var(--bgcolor);
  height: var(--height);
}
.animat {
  animation: animated-height var(--time) infinite;
}
</style>

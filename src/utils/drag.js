/**
 * v-dialogDrag 弹窗拖拽
 *
 */

export default {
  bind(el, binding, vnode, oldVnode) {
    const { value } = binding
    if (value === false) return
    // 获取拖拽内容头部
    const dialogHeaderEl = el.querySelector('.dialog_header')
    const dragDom = el
    dialogHeaderEl.style.cursor = 'move'

    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
    dragDom.style.position = 'absolute'

    // 鼠标按下事件
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL
      let styT

      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.body.style.userSelect = 'none' // 消除拖拽中选中文本干扰

      // 鼠标拖拽事件
      document.onmousemove = (e) => {
        // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
        const l = e.clientX - disX
        const t = e.clientY - disY

        const finallyL = l + styL
        const finallyT = t + styT

        // 移动当前元素
        dragDom.style.left = `${finallyL}px`
        dragDom.style.top = `${finallyT}px`
      }

      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
}

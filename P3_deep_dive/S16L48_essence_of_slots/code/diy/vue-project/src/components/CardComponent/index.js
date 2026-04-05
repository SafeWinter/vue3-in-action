import { defineComponent, h, ref } from 'vue'
import styles from './styles.module.css'

function getHeaderVNode(renderFn) {
  const title = ref('这是从子组件传递的标题数据')
  const slotProps = { title: title.value }
  const vnodeFromParent = renderFn(slotProps)
  console.log('vnodeFromParent:', vnodeFromParent)
  return vnodeFromParent.length === 0 ? h('div', null, '默认标题') : vnodeFromParent
}

export default defineComponent({
  name: 'CardComponent',
  setup(_, { slots }) {
    const headerVNode = getHeaderVNode(slots.header)
    console.log('headerVNode:', headerVNode)
    const defaultVNode = slots.default()
    return () =>
      h('div', { class: styles.card }, [
        h('div', { class: styles['card-header'] }, headerVNode),
        h('div', { class: styles['card-body'] }, defaultVNode)
      ])
  }
})

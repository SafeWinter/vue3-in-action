import { defineComponent, h, ref } from 'vue'
import styles from './CardComponent.module.css'

export default defineComponent({
  name: 'CardComponent',
  setup(_, { slots }) {
    const title = ref('这是子组件标题222')
    const deaultSlotsVNode = slots.default()
    let headerSlotsVnode = null
    // 如果传递了header插槽，就调用header插槽
    if (slots.header) {
      headerSlotsVnode = slots.header({
        title: title.value
      })
    }
    // 但是要注意，调用了之后，不见得有值，所以要判断一下
    if (!headerSlotsVnode.length) {
      headerSlotsVnode = h('div', null, '默认标题')
    }
    return () =>
      h('div', { class: styles.card }, [
        h('div', { class: styles['card-header'] }, headerSlotsVnode),
        h('div', { class: styles['card-body'] }, deaultSlotsVNode)
      ])
  }
})

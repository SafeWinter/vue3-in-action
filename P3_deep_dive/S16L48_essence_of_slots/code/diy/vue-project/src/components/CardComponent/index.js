import { defineComponent, h } from 'vue'
import styles from './styles.module.css'

export default defineComponent({
  name: 'CardComponent',
  setup(_, { slots }) {
    console.log('slots:', slots)
    const headerVNode = slots.header()
    const defaultVNode = slots.default()
    console.log('headerVNode:', headerVNode)
    console.log('defaultVNode', defaultVNode)
    return () =>
      h('div', { class: styles.card }, [
        h('div', { class: styles['card-header'] }, headerVNode),
        h('div', { class: styles['card-body'] }, defaultVNode)
      ])
  }
})

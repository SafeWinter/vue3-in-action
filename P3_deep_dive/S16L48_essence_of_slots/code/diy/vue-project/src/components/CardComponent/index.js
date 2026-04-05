import { defineComponent, h } from 'vue';
import styles from './styles.module.css';

export default defineComponent({
  name: 'CardComponent',
  setup(_, { slots }) {
    console.log('slots:', slots);
    return () => {
      h('div', { class: styles.card }, [
        h('div', { class: styles['card-header']}),
        h('div', { class: styles['card-body']})
      ])
    }
  }
})
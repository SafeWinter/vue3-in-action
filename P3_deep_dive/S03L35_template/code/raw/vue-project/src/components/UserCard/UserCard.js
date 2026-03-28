import { defineComponent, h } from 'vue'
import styles from './UserCard.module.css'
export default defineComponent({
  name: 'UserCard',
  props: {
    name: String,
    email: String,
    avatarUrl: String
  },
  setup(props) {
    // 下面我们使用了渲染函数的形式来描述了原本在模板中所描述的视图结构
    return () =>
      h('div', { class: styles.userCard }, [
      h('img', {
        class: styles.avatar,
        src: props.avatarUrl,
        alt: 'User avatar'
      }),
      h('div', { class: styles.userInfo }, [
        h('h2', props.name), h('p', props.email)
      ])
    ])
  }
})

// import styles from './UserCard.module.css'
// import { h } from 'vue'
// export default {
//   name: 'UserCard',
//   props: {
//     name: String,
//     email: String,
//     avatarUrl: String
//   },
//   render() {
//     return h('div', { class: styles.userCard }, [
//       h('img', {
//         class: styles.avatar,
//         src: this.avatarUrl,
//         alt: 'User avatar'
//       }),
//       h('div', { class: styles.userInfo }, [
//         h('h2', this.name), h('p', this.email)
//       ])
//     ])
//   }
// }

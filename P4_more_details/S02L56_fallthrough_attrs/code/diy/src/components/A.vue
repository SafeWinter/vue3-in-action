<template>
  <h2>组件A</h2>
</template>

<script>
export default {
  setup(_, { attrs }) {
    console.log(attrs.onClick)
  }
}
</script>

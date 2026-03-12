# P2S08L10：类名与样式的绑定在 Vue 3 中的写法

---





# 类与样式绑定

前面有介绍过属性动态绑定数据。有两个属性比较特殊：`class` 和 `style`

这两个用得很多，如果数据那一边使用字符串拼接很容易出错。因此 `Vue` 针对这两个属性提供了特殊的功能增强。除了字符串的值以外还可以是 **对象** 和 **数组**。



## 1 绑定类

### 1.1 对象语法

可以给 `class` 绑定一个对象来切换 `class`，该对象的键（`key`）就是要挂上去的样式类，值（`value`）对应的是一个布尔值，`true` 表示挂上去，`false` 表示不挂上去：

```vue
<template>
  <div
    class="demo"
    :class="{
      active: isActive,
      'text-danger': hasError
    }"
  >
    绑定样式类
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isActive = ref(true)
const hasError = ref(false)
setTimeout(() => {
  hasError.value = true
}, 3000)
</script>

<style scoped></style>
```



如果一个元素要挂的类比较多，那么推荐将对象写到 **数据** 里面，**不要写到模板里面**：

```vue
<template>
  <div class="demo" :class="classObj">绑定样式类</div>
</template>

<script setup>
import { reactive } from 'vue'
const classObj = reactive({
  active: true,
  isFinite: true,
  'text-danger': false
})

setTimeout(() => {
  classObj['text-danger'] = true
}, 3000)
</script>

<style scoped></style>
```

这样做的好处在于模板会比较清爽。



另外，也可以绑定一个计算属性的样式对象：

```vue
<template>
  <div class="demo" :class="classObj">绑定样式类</div>
</template>

<script setup>
import { ref, computed } from 'vue'
const isActive = ref(true)
const error = ref(null)

const classObj = computed(() => {
  return {
    active: isActive.value && !error.value,
    'text-danger': error.value && error.value.type === 'fatal'
  }
})
setTimeout(() => {
  error.value = {
    type: 'fatal'
  }
}, 3000)
</script>

<style scoped></style>
```



### 1.2 数组语法

数组语法中，数组的每一项一般都是一个 `ref` 值，`ref` 所对应的就是真实的要挂上去的类名：

```vue
<template>
  <div class="demo" :class="[isActive, error]">绑定样式类</div>
</template>

<script setup>
import { ref } from 'vue'
const isActive = ref('active') // 类名为 active
const error = ref('text-danger') // 类名为 text-danger
setTimeout(() => {
  isActive.value = 'normal'
}, 3000)
</script>

<style scoped></style>
```

数组写法也支持三目运算表达式：

```vue
<template>
  <div :class="[isActive ? activeClass : '', errorClass]">绑定样式类</div>
</template>

<script setup>
import { ref } from 'vue'
const isActive = ref(false)
const activeClass = ref('active')
const errorClass = ref('text-danger')
setTimeout(() => {
  isActive.value = true
}, 3000)
</script>

<style lang="scss" scoped></style>

```

另外，三目运算表达式可能依赖多个条件，这个时候就会显得该表达式非常冗长，此时可以在数组里面使用嵌套对象的方式：

```vue
<div :class="[{ active: isActive }, errorClass]"></div>
```



## 2 绑定内联样式

内联样式，也就是 `style` 的绑定，这个更加需要功能增强。

### 2.1 对象方式

```vue
<template>
  <div
    :style="{
      color: activeColor,
      fontSize: fontSize + 'px'
    }"
  >
    绑定内连样式
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activeColor = ref('red')
const fontSize = ref(30)
setTimeout(() => {
  activeColor.value = 'blue'
}, 3000)
</script>

<style lang="scss" scoped></style>
```

`style` 绑定的是一个对象，对象的键（`key`）是样式属性（`property`），值对应的是 `ref` 形式的样式属性值。

同样可以将 `style` 所绑定的对象在 `script` 里声明，这样模板更加清爽：

```vue
<template>
  <div :style="styleObj">绑定内连样式</div>
</template>

<script setup>
import { reactive } from 'vue'
const styleObj = reactive({
  color: 'red',
  fontSize: '30px'
})
</script>

<style lang="scss" scoped></style>
```



### 2.2 数组方式

数组的方式是结合着上面的对象的形式来使用的，在数组中会绑定多个样式对象：

```vue
<template>
  <div :style="styleArr">绑定内连样式</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const styleObj = reactive({
  color: 'red',
  fontSize: '30px'
})
const styleObj2 = reactive({
  textDecoration: 'underline'
})
const styleArr = ref([styleObj, styleObj2])
setTimeout(() => {
  styleArr.value.pop()
}, 3000)
</script>

<style lang="scss" scoped></style>
```

可见，数组的方式可以非常方便地操控一组样式。


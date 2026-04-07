# P4S04L58：组合式函数在 Vue3 中的应用

---



> [!tip]
>
> `Vue` 组合式函数官方文档：https://cn.vuejs.org/guide/reusability/composables



组合式函数（`Composables`），本质上也就是 **代码复用** 的一种方式：

- 组件：对 **结构 + 样式 + 逻辑** 进行复用；
- 组合式函数：侧重于对 **有状态的逻辑** 进行复用。



## 1 快速上手

实现一个鼠标坐标值的追踪器：

```vue
<template>
  <div>当前鼠标位置: {{ x }}, {{ y }}</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<style scoped></style>
```

实测效果：

![](../../assets/58.1.png)

多个组件中 **复用这个相同的逻辑**，该怎么办？

答：使用组合式函数。将包含了状态的相关逻辑，一起提取到一个单独的函数中，该函数就是组合式函数。



## 2 用法细节

### 2.1 组合式函数本身还可以相互嵌套

通过导入细分模块实现。



### 2.2 和 Vue2 时期的 mixin 的区别

解决了 `Vue2` 时期 `mixin` 的一些问题——

:one: 不清晰的数据来源：当引入多个 `minxin` 时，实例上的数据属性无法准确分辨 `mixin` 来源。

:two: 命名空间冲突：多个 `mixin` 来自于不同的作者，可能会注册相同的属性名而冲突（详见 **示例1**）。

:three: 隐式的跨 `mixin` 通信问题（不推荐，且加大运维难度）；



示例1：解决命名冲突——假设 `Vue2` 中存在多个 `mixin`：

```js
const mixinA = {
  methods: {
    fetchData() {
      // fetch data logic for mixin A
      console.log('Fetching data from mixin A');
    }
  }
};

const mixinB = {
  methods: {
    fetchData() {
      // fetch data logic for mixin B
      console.log('Fetching data from mixin B');
    }
  }
};

new Vue({
  mixins: [mixinA, mixinB],
  template: `
    <div>
      <button @click="fetchData">Fetch Data</button>
    </div>
  `
});
```

改为等效的组合式函数版：

```js
// useMixinA.js
import { ref } from 'vue';

export function useMixinA() {
  function fetchData() {
    // fetch data logic for mixin A
    console.log('Fetching data from mixin A');
  }

  return { fetchData };
}

// useMixinB.js
import { ref } from 'vue';

export function useMixinB() {
  function fetchData() {
    // fetch data logic for mixin B
    console.log('Fetching data from mixin B');
  }

  return { fetchData };
}
```

在目标组件中使用上述组合式函数：

```js
import { defineComponent } from 'vue';
import { useMixinA } from './useMixinA';
import { useMixinB } from './useMixinB';

export default defineComponent({
  setup() {
    // 这里必须要给别名
    const { fetchData: fetchDataA } = useMixinA();
    const { fetchData: fetchDataB } = useMixinB();

    fetchDataA();
    fetchDataB();

    return { fetchDataA, fetchDataB };
  },
  template: `
    <div>
      <button @click="fetchDataA">Fetch Data A</button>
      <button @click="fetchDataB">Fetch Data B</button>
    </div>
  `
});
```

示例2：消除 `mixin` 间的隐式通信问题——

`mixin` 可能的隐式通信问题：

```js
export const mixinA = {
  data() {
    return {
      sharedValue: 'some value'
    };
  }
};
```

```js
export const minxinB = {
  computed: {
    dValue(){
      // 和 mixinA 具有隐式的交流
      // 因为最终 mixin 的内容会被合并到组件实例上面，因此在 mixinB 里面可以直接访问 mixinA 的数据
      return this.sharedValue + 'xxxx';
    }
  }
}
```

组合式函数：所有交流都是 **显式的**——

```js
import { ref } from 'vue';

export function useMixinA() {
  const sharedValue = ref('some value');
  return { sharedValue };
}
```

```js
import { computed } from 'vue';

export function useMixinB(sharedValue) {
  const derivedValue = computed(() => sharedValue.value + ' extended');
  return { derivedValue };
}
```

使用时在 `setup` 阶段明确定义依赖关系，消除隐式通信：

```vue
<template>
  <div>
    {{ derivedValue }}
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useMixinA } from './useMixinA';
import { useMixinB } from './useMixinB';

export default defineComponent({
  setup() {
    const { sharedValue } = useMixinA();
    
    // 两个组合式函数的交流是显式的
    const { derivedValue } = useMixinB(sharedValue);

    return { derivedValue };
  }
});
</script>
```



### 2.3 异步状态

根据异步请求的情况显示不同的信息：

```vue
<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref } from 'vue'

// 发送请求获取数据
const data = ref(null)
// 错误
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>
```

如何复用这段逻辑？仍然是提取成一个 **组合式函数**：

```js
import { ref } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

现在重构上面的组件：

```vue
<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import {useFetch} from './hooks/useFetch';
const {data, error} = useFetch('xxxx')
</script>
```



这里为了更加灵活，我们想要传递一个响应式数据：

```js
const url = ref('first-url');
// 请求数据
const {data, error} = useFetch(url);
// 修改 url 的值后重新请求数据
url.value = 'new-url';
```

此时我们就需要重构上面的组合式函数：

```js
import { ref, watchEffect, toValue } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // 每次执行 fetchData 的时候，重制 data 和 error 的值
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```



#### 相关约定和最佳实践

**1. 命名**：组合式函数约定用 **驼峰命名法** 命名，并 **以 use 作为开头**：`useMouse`、`useEvent`……

**2. 输入参数**：注意参数是 **响应式数据** 的情况。如果你的组合式函数在输入参数是 `ref` 或 `getter` 的情况下创建了响应式 `effect`，为了让它能够被正确追踪，请确保要么使用 `watch()` 显式地监视 `ref` 或 `getter`；要么在 `watchEffect()` 中调用 `toValue()`。

**3. 返回值**

组合式函数中推荐返回一个 **普通对象**，该对象的每一项是 `ref` 数据，这样可以保证在解构的时候仍然能够保持其响应式的特性：

```js
// 组合式函数
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  // ...
  
  return { x, y }
}
```

```js
import { useMouse } from './hooks/useMouse'
// 可以解构
const { x, y } = useMouse()
```

如果希望以对象属性的形式来使用组合式函数中返回的状态，可以将返回的对象用 `reactive` 再包装一次即可：

```js
import { useMouse } from './hooks/useMouse'
const mouse = reactive(useMouse())
```



### 2.4 关于副作用

在组合式函数中可以执行副作用，例如添加 `DOM` 事件监听器或者请求数据。但是请 **确保在 onUnmounted 里面清理副作用**。

例如：在一个组合式函数设置了一个事件监听器，那么就需要在 `onUnmounted` 时移除该事件监听器：

```js
export function useMouse() {
  // ...
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
	// ...
}
```

也可以像前面 `useEvent` 一样，专门定义一个组合式函数来处理副作用：

```js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 专门处理副作用的组合式函数
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```



### 2.5 使用限制

:one: 只能在 `<script setup>` 或 `setup()` 钩子中调用：确保在组件实例被创建时，所有的组合式函数都被正确初始化。特别如果你使用的是选项式 `API`，那么需要在 `setup` 方法中调用组合式函数，**并且返回**，这样才能暴露给 `this` 及其模板使用：

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    // 因为组合式函数会返回一些状态
    // 为了后面通过 this 能够正确访问到这些数据状态
    // 必须在 setup 的时候调用组合式函数
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的属性可以在通过 `this` 访问到
    console.log(this.x)
  }
  // ...其他选项
}
```

:two: 只能被同步调用：组合式函数需要 **同步调用**，以确保在组件实例的初始化过程中，所有相关的状态和副作用都能被正确地设置和处理；否则可能会导致在组件实例还未完全初始化时就尝试访问未定义的实例数据，从而引发错误。

:three: 可以在像 `onMounted` 这样的生命周期钩子中调用组合式函数：前提是这些生命周期钩子也是 **同步执行** 的，且在组件实例初始化后调用。

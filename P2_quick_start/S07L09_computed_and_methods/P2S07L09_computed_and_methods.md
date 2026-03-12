# P2S07L09：Vue3 中的计算属性及方法的使用

---



## 1 引子

模板表达式：

```vue
<template>
<span>Name: {{ author.name }}</span>
  <p>Has published books:</p>
  <span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
</template>

<script setup>
import { reactive } from 'vue'
const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})
</script>

<style lang="scss" scoped></style>
```

本例之所以选用模板表达式，是因为要渲染的数据和模板之间，**并非简单的对应关系**：需要进行二次处理之后，才能够在模板上渲染。

虽然模板表达式能够满足对数据做二次处理的需求，但也存在一些问题：

1. 仅限表达式，不能写语句，无法支持复杂的运算；
2. 将计算逻辑写入模板，模板显得非常臃肿；
3. 如果相同的计算逻辑在模板中多次出现，则不易维护：计算逻辑理应是能够复用的。

为了解决上述问题，**计算属性** 闪亮登场。



## 2 基本用法

例如：

```vue
<template>
  <span>Name: {{ author.name }}</span>
  <p>Has published books:</p>
  <span>{{ isPublishBook }}</span>
</template>

<script setup>
import { reactive, computed } from 'vue'
const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})

const isPublishBook = computed(() => {
  // 在计算属性里面，我们就对数据进行二次处理
  return author.books.length > 0 ? 'Yes' : 'No'
})

// 计算属性也是响应式，当依赖的数据发生变化，那么计算属性也会重新计算
setTimeout(() => {
  author.books = []
}, 2000)
</script>

<style lang="scss" scoped></style>
```

总结：计算属性常用于对响应式数据进行二次计算，返回一个表征计算属性的 `ref` 值；该 `ref` 值可以在模板中使用。如果所依赖的响应式数据发生了变化，那么该计算属性会重新进行计算。



## 3 可写计算属性

计算属性是对某个响应式数据进行二次计算的结果，以便后期在模板中读取计算属性的值——这是绝大多数场景下的用法，因此计算属性默认也就是 **只读模式**。

但计算属性是也可以是 **可写的（writable）**，需要往 `computed` 方法中传入一个配置对象，该对象中有对应的 `getter` 和 `setter` 方法，例如：

```vue
<template>
  <span>name:{{ fullName }}</span>
</template>

<script setup>
import { ref, computed } from 'vue'
const firstName = ref('Xie')
const lastName = ref('Jie')

const fullName = computed({
  // 在读取计算属性值的时候会触发
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // 在设置计算属性值的时候会触发
  set(newName) {
    ;[firstName.value, lastName.value] = newName.split(' ')
  }
})

// 接下来可能因为某种原因，要设置计算属性
setTimeout(() => {
  // 这里就涉及到了设置计算属性
  fullName.value = 'Zhang San'
}, 3000)
</script>

<style lang="scss" scoped></style>
```



## 4 最佳实践

1. Getter 不应该有副作用

现实生活中，也有使用 **副作用** 这个词的场景。

现实生活中的副作用指的就是 **不期待的效果，但是它发生了**。

程序中的副作用也是类似的意思：

```js
function effect(){
  document.body.innerText = 'hello';
}
```

在上面的例子中，`effect` 函数内部修改了 `document.body` 的值，这就直接或者间接影响了其他函数（可能也需要读取 `document.body` 的值）的执行结果，这个时候我们就称 `effect` 函数 **是有副作用的**。

再比如，一个函数修改了全局变量，也是一个副作用操作：

```js
let val = 1;
function effect(){
  val = 2; // 修改全局变量，产生副作用
}
```

常见的副作用操作还有很多：

- 调用系统 `I/O` 的 `API`
- 发送网络请求
- 在函数体内修改外部变量的值
- 使用 `console.log` 等方法进行输出
- 调用存在副作用的函数

回到 `Vue` 中的计算属性。一个计算属性的声明中应该描述的是 **根据一个值派生另外一个值**，不应该改变其他的状态，也不应该在 `getter` 中做诸如异步请求、更改 `DOM` 一类的操作。



2. 避免直接修改计算属性的值

绝大多数场景下，都应该是读取计算属性的值，而非设置计算属性的值。

>从计算属性返回的值是 **派生状态**。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。



## 4 计算属性和方法

除了计算属性以外，我们还可以定义方法：

```vue
<template>
  <span>Name: {{ author.name }}</span>
  <p>Has published books:</p>
  <span>{{ isPublishBook() }}</span>
</template>

<script setup>
import { reactive } from 'vue'
const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})

function isPublishBook() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
</script>

<style lang="scss" scoped></style>
```

计算属性依赖于响应式数据，然后对响应式数据进行二次计算。只有在响应式数据发生变化的时候，才会重新计算，换句话说，**计算属性会缓存所计算的值**。

而方法在重新渲染时，每次都是重新调用：

```vue
<template>
  <button v-on:click="a++">A++</button>
  <button v-on:click="b++">B++</button>
  <p>computedA: {{ computedA }}</p>
  <p>computedB: {{ computedB }}</p>
  <p>methodA: {{ methodA() }}</p>
  <p>methodB: {{ methodB() }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'
const a = ref(1)
const b = ref(1)
// 创建两个计算属性，分别依赖 a 和 b
const computedA = computed(() => {
  console.log('计算属性 A 重新计算了')
  return a.value + 1
})
const computedB = computed(() => {
  console.log('计算属性 B 重新计算了')
  return b.value + 1
})
function methodA() {
  console.log('method A 执行了')
  return a.value + 1
}
function methodB() {
  console.log('method B 执行了')
  return b.value + 1
}
</script>

<style lang="scss" scoped></style>
```

> [!tip]
>
> **最佳实践**
>
> 当需要对数据进行二次计算的时候，就是使用计算属性即可。方法一般是和事件相关联，作为事件的事件处理方法来使用。


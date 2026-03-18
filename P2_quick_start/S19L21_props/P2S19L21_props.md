# P2S19L21：Vue3 中的 props 属性

---



所谓 `props`，即父组件在使用子组件时，向子组件传递数据的通信机制。



## 1 快速入门

定义一个 `UserCard.vue` 组件：

```vue
<template>
  <div class="user-card">
    <img :src="user.avatarUrl" alt="用户头像" class="avatar" />
    <div class="user-info">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
// defineProps 是一个编译器宏，用于声明组件接收哪些 props
const user = defineProps({
  name: String,
  email: String,
  avatarUrl: String
})
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-info h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.user-info p {
  margin: 5px 0 0;
  font-size: 16px;
  color: #666;
}
</style>

```

该组件接收 `name`、`email` 及 `avatrUrl` 三个 `prop` 值，使用 `defineProps` 来定义要接收的 `props`。这里的 `defineProps` 是一个 **编译器宏**，会在代码实际执行之前进行一个替换操作（官方文档原文：`defineProps` 和 `defineEmits` 都是只能在 `<script setup>` 中使用的 **编译器宏**。他们不需要导入，且会随着 `<script setup>` 的处理过程一同被编译掉）。

之后 `App.vue` 作为父组件，在父组件中使用上面的 `UserCard.vue` 组件（子组件）：

```vue
<template>
  <div class="app-container">
    <!-- 父组件在使用 UserCard 这个组件的时候，向内部传递数据 -->
    <UserCard name="张三" email="123@gamil.com" avatar-url="src/assets/yinshi.jpg" />
    <UserCard name="莉丝" email="456@gamil.com" avatar-url="src/assets/jinzhu.jpeg" />
  </div>
</template>

<script setup>
import UserCard from './components/UserCard.vue'
</script>

<style scoped>
.app-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
</style>
```



## 2 用法细节

### 2.1 关于 prop 的命名

组件内部在声明 `props` 时推荐使用 **驼峰命名法**：

```js
defineProps({
  greetingMessage: String
})
```

```vue
<span>{{ greetingMessage }}</span>
```

当作为某父组件的子组件属性时，推荐使用更加贴近 `HTML` 的书写风格：

```vue
<MyComponent greeting-message="hello" />
```



### 2.2 动态 Props

以下 `props` 为静态数据：

```vue
<UserCard name="张三" email="123@gamil.com" avatar-url="src/assets/yinshi.jpg" />
```

所谓动态 `props`，即父组件所传递的属性值，是和父组件本身的状态绑定在一起的：

`UserCard.vue`

```js
// defineProps 是一个编译器宏，用于声明组件接收哪些 props
defineProps({
  user: {
    type: Object,
    required: true
  }
})
```

`App.vue`

```vue
<template>
  <div class="app-container">
    <!-- 父组件在使用 UserCard 这个组件的时候，向内部传递数据 -->
    <UserCard :user="user" />
    <div class="input-group">
      <input type="text" placeholder="请输入新的名字" v-model="newName" />
      <button @click="changeName">确定修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserCard from './components/UserCard.vue'
// 父组件所维护的一份数据
const user = ref({
  name: '张三',
  email: '123@gamil.com',
  avatarUrl: 'src/assets/yinshi.jpg'
})
const newName = ref('')

// 根据用户输入的新名字
// 更新 user 这个数据
function changeName() {
  if (newName.value.trim()) {
    user.value.name = newName.value
  }
}
</script>

<style scoped>
.app-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
.input-group {
  display: flex;
  margin-top: 20px;
}

input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}
</style>
```

还需要注意一个细节：如果想要向组件传递 **非字符串** 类型的值，例如 `number`、`boolean`、`array`… 时，必须以动态 `props` 的方式传参，否则组件内部拿到的是一个 **字符串**。



### 2.3 单向数据流

`props` 会因为父组件传递数据的更新而随之变化，此时的数据流是从父组件流向子组件的单向流。这意味着子组件不应修改父组件传递的 `props` 数据：

如果强行修改，`Vue` 会在控制台抛出警告：

```js
const props = defineProps(['foo'])

// ❌ 警告！prop 是只读的！
props.foo = 'bar'
```

有时，我们期望子组件在局部保存一份父组件传递下来的数据，此时应该在子组件中重新定义一个子组件的数据来存储 `props` 中的值即可：

```js
import { ref } from 'vue'
const prop = defineProps(['user', 'age'])
// 在子组件中，使用 ref 创建一个响应式数据
// 值为父组件传递过来的 props 值
const age = ref(prop.age)
```

当需要对父组件传递过来的数据进行二次计算，也可以在子组件内部创建一个 **计算属性**，仅仅使用父组件传递的 `props` 值来做二次计算：

```js
const props = defineProps(['size'])

// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```



## 3 校验

子组件在声明 `props` 时，是可以书写该属性的校验规则，如果父组件在传参时不符合 `props` 的校验规则，`Vue` 会在开发阶段的控制台给出警告：

```js
defineProps({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // 带默认值的 Number 类型
  propD: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propE: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propF: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propG: {
    type: Function,
    // 不像对象或数组的默认，这不是一个
    // 工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
```

例如为 `UserCard.vue` 组件添加如下自定义校验规则：

```js
defineProps({
  user: {
    type: Object,
    required: true,
    // 自定义校验规则
    validator: (usr) => {
      return usr.name && usr.email && usr.avatarUrl
    }
  },
  age: {
    type: [Number, String],
    default: 18
  }
})
```


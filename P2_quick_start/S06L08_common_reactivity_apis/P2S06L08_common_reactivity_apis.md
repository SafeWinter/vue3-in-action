# P2S06L08：响应式常用 API（补充）



> [!tip]
>
> 主要分四大类：
>
> - `ref` 相关：`toRef`、`toRefs`、`unref`
> - 只读代理：`readonly`
> - 判断相关：`isRef`、`isReactive`、`isProxy`、`isReadonly`
> - `v3.3` 新增 `API`：`toValue`



## 1 ref 相关

`toRef`：基于响应式对象的某一个属性，将其转换为 `ref` 值：

```js
import { reactive, toRef } from 'vue'
const state = reactive({
  count: 0
})
const countRef = toRef(state, 'count')
// 这里其实就等价于 ref(state.count)
console.log(countRef)
console.log(countRef.value)
```

```js
import { reactive, isReactive, toRef } from 'vue'
const state = reactive({
  count: {
    value: 0
  }
})
console.log(isReactive(state)) // true
console.log(isReactive(state.count)) // true
const countRef = toRef(state, 'count')
// 相当于 ref(state.count)
console.log(countRef)
console.log(countRef.value)
console.log(countRef.value.value)
```

`toRefs`：将一个响应式对象转为一个普通对象，普通对象的每一个属性对应的是一个 `ref` 值

```js
import { reactive, toRefs } from 'vue'
const state = reactive({
  count: 0,
  message: 'hello'
})
const stateRefs = toRefs(state)
console.log(stateRefs) // {count: RefImpl, message: RefImpl}
console.log(stateRefs.count.value)
console.log(stateRefs.message.value)
```

`unref`: 如果参数给的是一个 `ref` 值，那么就返回内部的值，如果不是 `ref`，那么就返回参数本身。

这个 `API` 实际上是一个语法糖： `val = isRef(val) ? val.value : val`

```js
import { ref, unref } from 'vue'
const countRef = ref(10)
const normalValue = 20

console.log(unref(countRef)) // 10
console.log(unref(normalValue)) // 20
```



## 2 只读代理

接收一个对象（不论是响应式的还是普通的）或者一个 `ref`，返回一个原来值的 **只读代理**。

```js
import { ref, readonly } from 'vue'
const count = ref(0)
const count2 = readonly(count) // 相当于创建了一个 count 的只读版本
count.value++;
count2.value++; // 会给出警告
```

在某些场景下，我们就是希望一些数据只能读取不能修改：

```js
const rawConfig = {
  apiEndpoint: 'https://api.example.com',
  timeout: 5000
};
// 例如在这个场景下，我们就期望这个配置对象是不能够修改的
const config = readonly(rawConfig)
```





## 3 判断相关

`isRef` 和 `isReactive`

```js
import { ref, shallowRef, reactive, shallowReactive, isRef, isReactive } from 'vue'
const obj = {
  a:1,
  b:2,
  c: {
    d:3,
    e:4
  }
}
const state1 = ref(obj)
const state2 = shallowRef(obj)
const state3 = reactive(obj)
const state4 = shallowReactive(obj)
console.log(isRef(state1)) // true
console.log(isRef(state2)) // true
console.log(isRef(state1.value.c)) // false
console.log(isRef(state2.value.c)) // false
console.log(isReactive(state1.value.c)) // true
console.log(isReactive(state2.value.c)) // false
console.log(isReactive(state3)) // true
console.log(isReactive(state4)) // true
console.log(isReactive(state3.c)) // true
console.log(isReactive(state4.c)) // false
```



`isProxy`: 检查一个对象是否为以下 `API` 创建的代理：`reactive`、`readonly`、`shallowReactive`、`shallowReadonly`（唯独不包含 `ref` 和 `shallowRef`）。

```js
import { reactive, readonly, shallowReactive, shallowReadonly, isProxy } from 'vue'
// 创建 reactive 代理对象
const reactiveObject = reactive({ message: 'Hello' })
// 创建 readonly 代理对象
const readonlyObject = readonly({ message: 'Hello' })
// 创建 shallowReactive 代理对象
const shallowReactiveObject = shallowReactive({ message: 'Hello' })
// 创建 shallowReadonly 代理对象
const shallowReadonlyObject = shallowReadonly({ message: 'Hello' })
// 创建普通对象
const normalObject = { message: 'Hello' }

console.log(isProxy(reactiveObject)) // true
console.log(isProxy(readonlyObject)) // true
console.log(isProxy(shallowReactiveObject)) // true
console.log(isProxy(shallowReadonlyObject)) // true
console.log(isProxy(normalObject)) // false
```



## 4. v3.3 新增 API

`toValue`

这个 `API` 和前面介绍的 `unref` 相似：

```js
import { ref, toValue } from 'vue'
const countRef = ref(10)
const normalValue = 20

console.log(toValue(countRef)) // 10
console.log(toValue(normalValue)) // 20
```

区别：`toValue` 比 `unref` 更加灵活一些，它支持传入 `getter` 函数（`L4`、`L8`），并且返回函数的执行结果：

```js
import { ref, toValue } from 'vue'
const countRef = ref(10)
const normalValue = 20
const getter = () => 30;

console.log(toValue(countRef)) // 10
console.log(toValue(normalValue)) // 20
console.log(toValue(getter)) // 30
```

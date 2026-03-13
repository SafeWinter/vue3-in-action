# P2S12L14：购物车页面实战演练

---



## 1 要点梳理

本节通过一个简单的购物车页面练习 `Vue3` 的写法，尤其是演示了 `computed` 计算属性的另一种写法（`getter` + `setter`），极大简化了全选复选框的交互实现。

核心逻辑：

```js
// <input id="all" type="checkbox" v-model="isCheckedAll" />
// 全选所有的商品
const isCheckedAll = computed({
  get() {
    return goods.value.every((item) => item.checked)
  },
  set(newValue) {
    goods.value.forEach((item) => item.checked = newValue)
  }
})
```

实测时的平替版本：

```js
// <input id="all1" type="checkbox" :checked="allChecked" @change="selAll" />
// 全选状态及其初始化
const allChecked = ref(true)
onMounted(() => {
  allChecked.value = goods.value.every((e) => e.checked)
})
// 全选与全不选
const selAll = () => {
  allChecked.value = !allChecked.value
  const checked = allChecked.value
  goods.value.forEach((item) => (item.checked = checked))
}
// 判定是否勾选全选
const updateSelectAll = () => (allChecked.value = goods.value.every((e) => e.checked))
```



## 2 实测备忘

添加 `label` 标签后，无需为其单独注册 `click` 事件，通过 `for` 属性关联后，点击 `label` 就等效于点击复选框：

```html
<th>
  <input id="all1" type="checkbox" :checked="allChecked" @change="selAll" />
  <label for="all1">全选</label>
</th>
```

数量的递增和递减可以通过高阶函数实现：

```js
// 数量递增/递减
const changeItem = (obj, delta) => {
  obj.goods_num = Math.max(obj.goods_num + delta, 0)
}
const incr = (obj) => changeItem(obj, 1)
const decr = (obj) => changeItem(obj, -1)
```


<template>
  <div id="shoppingcart">
    <table>
      <thead>
        <tr>
          <th>
            <input id="all1" type="checkbox" :checked="allChecked" @change="selAll" />
            <label for="all1">全选</label>
          </th>
          <th>商品</th>
          <th>单价(元)</th>
          <th>数量</th>
          <th>小记(元)</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in goods" :key="item.id">
          <td>
            <input type="checkbox" v-model="item.checked" @change="updateSelectAll(item)" />
          </td>
          <td>{{ item.goods_name }}</td>
          <td>{{ item.goods_price }}</td>
          <td>
            <button @click="decr(item)">&minus;</button>
            <input type="text" v-model="item.goods_num" class="ipt" />
            <button @click="incr(item)">&plus;</button>
          </td>
          <td>{{ item.goods_price * item.goods_num }}</td>
          <td><button class="danger" @click="delItem(item.id)">删除</button></td>
        </tr>
      </tbody>
    </table>
    <footer class="footer">
      <div class="footer-left">
        <input id="all2" type="checkbox" :checked="allChecked" @change="selAll" />
        <label for="all2">全选</label>
        <a @click="delChecked" class="del-checked">删除选中的商品</a>
        <span>共 {{ goods.length }} 件商品，已选择 {{ checkedCount }} 件</span>
      </div>
      <div class="footer-right">
        <div>
          合计（不含运费）:<span>￥ {{ totalAmount }}</span>
        </div>
        <button>去结算</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// 商品数据
const goods = ref([
  {
    id: 1,
    goods_name: '华为手环',
    goods_price: 169,
    goods_num: 1,
    checked: true
  },
  {
    id: 2,
    goods_name: '索尼耳机',
    goods_price: 163,
    goods_num: 1,
    checked: true
  },
  {
    id: 3,
    goods_name: '小米汽车',
    goods_price: 1890,
    goods_num: 1,
    checked: false
  },
  {
    id: 4,
    goods_name: 'iPhone14',
    goods_price: 1699,
    goods_num: 1,
    checked: true
  }
])

// 全选状态及其初始化
const allChecked = ref(true)
onMounted(() => {
  allChecked.value = goods.value.every((e) => e.checked)
})

// 数量递增/递减
const changeItem = (obj, delta) => {
  obj.goods_num = Math.max(obj.goods_num + delta, 0)
}
const incr = (obj) => changeItem(obj, 1)
const decr = (obj) => changeItem(obj, -1)

// 删除商品
const delItem = (id) =>
  window.confirm('确定要删除该商品吗？')
    ? (goods.value = goods.value.filter((e) => e.id !== id))
    : void 0

// 全选与全不选
const selAll = () => {
  allChecked.value = !allChecked.value
  const checked = allChecked.value
  goods.value.forEach((item) => (item.checked = checked))
}
// 判定是否勾选全选
const updateSelectAll = () => (allChecked.value = goods.value.every((e) => e.checked))

// 已选中的数量
const checkedCount = computed(() => goods.value.filter((e) => e.checked).length)

// 选中的总价
const totalAmount = computed(() =>
  goods.value.filter((e) => e.checked).reduce((acc, g) => (acc += g.goods_num * g.goods_price), 0)
)

// 删除所有选中项
const delChecked = () =>
  window.confirm('确定删除已选中的商品？')
    ? (goods.value = goods.value.filter((e) => !e.checked))
    : void 0
</script>

<style scoped>
@import '@/assets/shopping-cart.css';
label[for] {
  cursor: pointer;
  user-select: none;
}
.del-checked {
  cursor: pointer;
}
</style>

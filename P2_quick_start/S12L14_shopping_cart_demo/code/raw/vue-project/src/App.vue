<template>
  <div id="app">
    <div id="shoppingcart">
      <table>
        <!-- 第一行 标题行 -->
        <tr>
          <td>
            <input id="all" type="checkbox" v-model="isCheckedAll" />
            <label for="all">全选</label>
          </td>
          <td>商品</td>
          <td>单价(元)</td>
          <td>数量</td>
          <td>小记(元)</td>
          <td>操作</td>
        </tr>
        <!-- 第二行开始需要使用循环来渲染 -->
        <tr v-for="item in goods" :key="item.id">
          <td><input type="checkbox" v-model="item.checked" /></td>
          <td>{{ item.goods_name }}</td>
          <td>{{ item.goods_price }}</td>
          <td>
            <button @click="item.goods_num > 0 ? item.goods_num-- : ''">-</button>
            <input type="text" v-model="item.goods_num" class="ipt" />
            <button @click="item.goods_num++">+</button>
          </td>
          <td>{{ item.goods_num * item.goods_price }}</td>
          <td>
            <button class="danger" @click="deleteItem(item.id)">删除</button>
          </td>
        </tr>
      </table>
      <!-- footer部分 -->
      <footer class="footer">
        <div class="footer-left">
          <input id="all1" type="checkbox" v-model="isCheckedAll" />
          <label for="all1">全选</label>
          <a @click="deleteChecked">删除选中的商品</a>
          <span>共{{ goods.length }}件商品，已选择{{ checkedLength }}件</span>
        </div>
        <div class="footer-right">
          <div>
            合计(不含运费): <span>¥ {{ totalPrice }}</span>
          </div>
          <button>去结算</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// 要渲染的数据
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

// 方法
// 根据 id 删除某一个项目
function deleteItem(id) {
  if (window.confirm('确定要删除该商品吗？'))
    goods.value = goods.value.filter((item) => {
      return item.id !== id
    })
}
// 删除选中的项目
function deleteChecked() {
  if (window.confirm('确定要删除勾选的商品吗？'))
    goods.value = goods.value.filter((item) => {
      return !item.checked
    })
}

// 计算属性
// 计算商品总价
const totalPrice = computed(() => {
  let total = 0
  for (let item of goods.value) {
    if (item.checked) {
      total += item.goods_num * item.goods_price
    }
  }
  return total
})
// 计算选中的商品个数
const checkedLength = computed(() => {
  return goods.value.filter((item) => {
    return item.checked
  }).length
})
// 全选所有的商品
const isCheckedAll = computed({
  get() {
    return goods.value.every((item) => {
      return item.checked
    })
  },
  set(newValue) {
    goods.value.forEach((item) => {
      item.checked = newValue
    })
  }
})
</script>

<style scoped>
@import './assets/shopping-cart.css';
label[for] {
  cursor: pointer;
  user-select: none;
}
</style>

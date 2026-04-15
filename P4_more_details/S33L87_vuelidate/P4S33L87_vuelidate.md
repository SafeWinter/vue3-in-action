# P4S33L87：Vue 第三方库 vuelidate 实战

---



## 1 概述

`Vuelidate` 是一款专为 `Vue.js` 设计的轻量级 **表单验证库**，提供简单而灵活的方式来验证表单输入。它可以与 `Vue2` 和 `Vue3` 一起使用，并且支持各种常见的验证规则，如必填字段、最小和最大长度、模式匹配等。



## 2 基本用法

首先安装这个库：

```bash
npm install @vuelidate/core @vuelidate/validators
```

安装的版本信息：

- `"@vuelidate/core": "^2.0.3"`
- `"@vuelidate/validators": "^2.0.4"`

核心代码：

```js
const v$ = useVuelidate(rules, state)

// 提交表单的处理函数
function submitForm() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    console.log('Form is invalid')
  } else {
    console.log('Form is valid')
  }
}
```

重要解释：

```js
// 创建一个表单验证的实例对象
const v$ = useVuelidate(rules, state)
```

这行代码调用 `useVuelidate` 组合式函数，将 **验证规则 rules** 和 **验证状态 state** 作为参数传入，并将返回的验证对象赋值给 `v$` 变量。

`v$` 是一个代理对象，包含了 **所有表单字段的验证状态**，以及一系列用于检查和操作验证状态的属性和方法。

```js
// 触发验证
v$.value.$touch()
```

`$touch()` 方法用于标记所有验证规则为【已触摸】状态。这个方法通常在提交表单时调用，以 **触发所有字段的验证**。

```js
v$.value.$invalid
```

`$invalid` 用于标识整个表单是否校验失败。如果 **表单中有任一字段不符合验证规则，$invalid 属性值则为 true**。

实测截图：

![](../../assets/87.1.png)



## 3 常用校验规则

1. `required`：字段必须填写。
2. `minLength`：字段值的最小长度。
3. `maxLength`：字段值的最大长度。
4. `minValue`：字段值的最小数值。
5. `maxValue`：字段值的最大数值。
6. `between`：字段值必须在指定的数值范围内。
7. `alpha`：字段值只能包含字母。
8. `alphaNum`：字段值只能包含字母和数字。
9. `numeric`：字段值必须是数字。
10. `integer`：字段值必须是整数。
11. `decimal`：字段值必须是小数。
12. `email`：字段值必须是有效的电子邮件地址。
13. `ipAddress`：字段值必须是有效的 `IP` 地址。
14. `macAddress`：字段值必须是有效的 `MAC` 地址。
15. `url`：字段值必须是有效的 `URL` 地址。
16. `sameAs`：字段值必须与另一个字段的值相同。
17. `or`：多个验证规则中至少一个为 `true`。
18. `and`：多个验证规则必须都为 `true`。
19. `not`：验证规则必须为 `false`。
20. `requiredIf`：字段必须在某个条件为 `true` 时填写。
21. `requiredUnless`：字段必须在某个条件为 `false` 时填写。

你可以在 [Vuelidate官方文档](https://vuelidate-next.netlify.app/validators.html) 看到每一条规则的说明。



## 4 实战案例

用户注册的实战案例，在这个案例里面，尽可能多的用到 `Vuelidate` 里面的验证规则，并且 **显示自定义中文提示**。

实测截图：

![](../../assets/87.2.png)



## 5 其他用法细节

### 5.1 使用正则表达式

`Vuelidate` 可通过 `helpers.regex` 来创建一个自定义的正则验证器：

```js
const phoneNumberWithMessage = helpers.withMessage(
  '必须是一个有效的电话号码',
  helpers.regex(/^1[3-9]\d{9}$/)
)

const rules = {
  phoneNumber: {
    required: requiredWithMessage,
    numeric: numericWithMessage,
    phoneNumber: phoneNumberWithMessage
  },
}
```



### 5.2 自定义验证规则

通过 `helpers` 可以自定义验证规则。

更多进阶用法可以参阅官方文档：https://vuelidate-next.netlify.app/advanced_usage.html


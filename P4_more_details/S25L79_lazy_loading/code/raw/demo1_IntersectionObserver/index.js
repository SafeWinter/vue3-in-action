// 示例一

// // 先获取要观察的目标元素
// const target = document.querySelector(".target");

// // 当被观察的元素的可见性发生变化时，会调用回调函数
// const callback = (entries, observer) => {
//   console.log("回调函数触发了");
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       console.log("目标元素进入视口");
//     } else {
//       console.log("目标元素离开视口");
//     }
//   });
// };

// const ob = new IntersectionObserver(callback, {
//   root: null, // 默认将视口作为根元素
//   rootMargin: "0px", // 根元素的边距
//   threshold: 0, // 交叉比例
// });

// // 观察target元素
// ob.observe(target);

// 示例二

// 先获取要观察的目标元素
const target = document.querySelector(".target");

// 当被观察的元素的可见性发生变化时，会调用回调函数
const callback = (entries, observer) => {
  console.log("回调函数触发了");
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log("目标元素进入视口");
    } else {
      console.log("目标元素离开视口");
    }
  });
};

const ob = new IntersectionObserver(callback, {
  root: document.querySelector(".container"), // 将 container 元素作为根元素
  rootMargin: "-50px", // 根元素的边距
  threshold: 0, // 交叉比例
});

// 观察target元素
ob.observe(target);

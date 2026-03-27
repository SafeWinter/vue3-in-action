// 通过 innerHTML 来更新 content 里面的内容
document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const updateButton = document.getElementById("updateButton");

  updateButton.addEventListener("click", function () {
    const currentTime = new Date().toTimeString().split(" ")[0]; // 获取当前时间
    contentDiv.innerHTML = `
        <div class="message">
            <div class="info">
                <span>张三</span>
                <span>${currentTime}</span>
            </div>
            <p>这是一堂讲解虚拟DOM的课</p>
            <div class="btn">
                <a href="#" class="removeBtn" _id="1">删除</a>
            </div>
        </div>`;
  });
});

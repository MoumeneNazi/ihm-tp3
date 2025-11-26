document.querySelectorAll('[data-cmd]').forEach(button => {
  button.addEventListener('click', () => {
    let command = button.getAttribute('data-cmd');
    document.execCommand(command, false, null);
  });
});

document.getElementById("font-size").addEventListener("change", function () {
  document.execCommand("fontSize", false, this.value);
});

document.getElementById("text-color").addEventListener("change", function () {
  document.execCommand("foreColor", false, this.value);
});

document.getElementById("highlight-color").addEventListener("change", function () {
  document.execCommand("hiliteColor", false, this.value);
});

document.getElementById("insert-link").addEventListener("click", function () {
  const url = prompt("Enter link URL:");
  if (url) document.execCommand("createLink", false, url);
});

document.getElementById("insert-image").addEventListener("click", function () {
  const url = prompt("Enter image URL:");
  if (url) document.execCommand("insertImage", false, url);
});

document.getElementById("insert-code").addEventListener("click", function () {
  const code = prompt("Enter code:");
  if (code) {
    const html = "<pre><code>" + code.replace(/</g, "&lt;") + "</code></pre>";
    document.execCommand("insertHTML", false, html);
  }
});

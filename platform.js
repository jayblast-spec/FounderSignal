document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copy);
    if (!target) return;
    await navigator.clipboard.writeText(target.textContent.trim());
    const original = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => { button.textContent = original; }, 1200);
  });
});

function escapeCode(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function syntaxLine(line) {
  let html = escapeCode(line);
  html = html.replace(/(https:\/\/[^\s\\]+)/g, '<span class="code-url">$1</span>');
  html = html.replace(/\b(curl)\b/g, '<span class="code-command">$1</span>');
  html = html.replace(/\b(GET|POST|PUT|PATCH|DELETE)\b/g, '<span class="code-method">$1</span>');
  html = html.replace(/(\s|^)(-[A-Za-z])\b/g, '$1<span class="code-flag">$2</span>');
  html = html.replace(/("[^"]*"|'[^']*')/g, '<span class="code-string">$1</span>');
  html = html.replace(/(&quot;[^&]+&quot;)(\s*:)/g, '<span class="code-key">$1</span>$2');
  html = html.replace(/^(\$)/, '<span class="code-prompt">$1</span>');
  if (html.trim().startsWith("//")) return `<span class="code-comment">${html}</span>`;
  return html;
}

document.querySelectorAll("pre code").forEach((code) => {
  if (code.querySelector("[class^='code-'], [class*=' code-']")) return;
  const lines = code.textContent.split("\n");
  code.innerHTML = lines.map(syntaxLine).join("\n");
});

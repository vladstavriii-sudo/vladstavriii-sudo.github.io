const attach = () => {
  const panel = document.querySelector('.nav-faq-panel');
  const text = panel?.querySelector('p');
  if (!text) return false;
  const fit = () => {
    const style = getComputedStyle(panel);
    const available = panel.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    text.style.fontSize = '20px';
    const range = document.createRange();
    range.selectNodeContents(text);
    const width = range.getBoundingClientRect().width;
    if (width) text.style.fontSize = `${20 * available / width}px`;
  };
  new ResizeObserver(fit).observe(panel);
  document.fonts.ready.then(fit);
  fit();
  return true;
};
if (!attach()) {
  const observer = new MutationObserver(() => { if (attach()) observer.disconnect(); });
  observer.observe(document.body, {childList:true,subtree:true});
}

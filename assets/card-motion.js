const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
function frames(name) {
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules) {
      if (rule.type !== CSSRule.KEYFRAMES_RULE || rule.name !== name) continue;
      return [...rule.cssRules].map(frame => {
        const style = {};
        for (const prop of frame.style) style[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = frame.style.getPropertyValue(prop);
        return frame.keyText.split(',').map(key => ({...style, offset:parseFloat(key)/100}));
      }).flat().sort((a,b)=>a.offset-b.offset);
    }
  }
  return [];
}
function attach() {
  const cards = document.querySelectorAll('.feature-card');
  if (cards.length !== 3) return false;
  const setup = (card, specs) => {
    let animations = [];
    card.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || reduced.matches) return;
      for (const animation of animations) animation.cancel();
      animations = specs.map(([selector,name,duration]) => card.querySelector(selector).animate(frames(name), {duration,easing:'ease-in-out',fill:'both'}));
    });
    card.addEventListener('pointerleave', () => {
      for (const animation of animations) {
        if (animation.currentTime == null) continue;
        // Reverse from the current frame, preserving the visible state.
        animation.updatePlaybackRate(-1);
        animation.play();
        animation.onfinish = () => animation.cancel();
      }
    });
  };
  setup(cards[1], [['.feature-circle-sheen','circle-surface-pass',1800]]);
  setup(cards[2], [['.control-fill-line','control-fill-pulse',3200],['.control-fill-dot--top','control-top-touch',3200],['.control-fill-dot--bottom','control-bottom-touch',3200]]);
  return true;
}
if (!attach()) {
  const observer = new MutationObserver(() => { if(attach()) observer.disconnect(); });
  observer.observe(document.body,{childList:true,subtree:true});
}

// ===== Claude AI / LinkedIn RTL Persian Extension - content.js =====
// Right-aligns (and sets RTL on) any element that actually holds Persian/Arabic
// text — detected by content, not by fragile class names. English-only text,
// English prompts and code stay LTR — even when that English block sits
// inside a Persian article/editor whose container is itself dir="rtl"
// (we explicitly stamp LTR on it instead of just "leaving it alone", since
// leaving it alone lets it inherit rtl/right-align from the ancestor).

(function () {
  'use strict';

  // Persian / Arabic Unicode ranges (Persian letters, presentation forms, Persian digits)
  const RTL_REGEX =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

  // Tags that may directly hold visible text. We only style an element when its
  // OWN direct text is present (Persian or not), so layout wrapper <div>s that
  // hold no text of their own stay untouched.
  const TEXT_TAGS =
    'p, li, h1, h2, h3, h4, h5, h6, blockquote, div, span, td, th, dd, dt, figcaption, a, label';

  const EDITOR_SELECTORS = '.ProseMirror, div[contenteditable="true"]';
  const BLOCK_TAGS = new Set([
    'P','LI','H1','H2','H3','H4','H5','H6','BLOCKQUOTE','DIV','TD','TH','DD','DT','FIGCAPTION',
  ]);

  function isPersian(t) {
    return RTL_REGEX.test(t || '');
  }

  function insideCode(el) {
    return !!(el.closest && el.closest('pre, code'));
  }

  // Concatenated text from DIRECT child text nodes only (ignores descendants),
  // so we can tell whether THIS element holds its own text, vs. being a
  // wrapper around other elements.
  function ownDirectText(el) {
    let out = '';
    for (let n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) out += n.nodeValue;
    }
    return out.trim();
  }

  function applyDir(el, dir) {
    if (el.dataset.rtlDir === dir) return;
    const isBlock = BLOCK_TAGS.has(el.tagName);
    el.setAttribute('dir', dir);
    el.style.setProperty('direction', dir, 'important');
    if (isBlock) {
      el.style.setProperty('text-align', dir === 'rtl' ? 'right' : 'left', 'important');
    }
    el.style.setProperty('unicode-bidi', 'isolate', 'important');
    el.dataset.rtlDir = dir;
  }

  function applyListDir(list, dir) {
    if (list.dataset.rtlDir === dir) return;
    list.setAttribute('dir', dir);
    list.style.setProperty('direction', dir, 'important');
    list.style.setProperty('text-align', dir === 'rtl' ? 'right' : 'left', 'important');
    list.style.setProperty('padding-right', dir === 'rtl' ? '1.5em' : '0', 'important');
    list.style.setProperty('padding-left', dir === 'rtl' ? '0' : '1.5em', 'important');
    list.dataset.rtlDir = dir;
  }

  // Block-level code (<pre>, or standalone <pre><code>) always renders LTR,
  // left-aligned, on its own line. Inline <code> sitting in the middle of an
  // RTL paragraph must stay LTR too, but text-align is meaningless on an
  // inline element and unicode-bidi:isolate (not "normal") keeps it from
  // getting visually reshuffled by the surrounding RTL text.
  function forceCodeLTR(el) {
    const isInline = el.tagName === 'CODE' && !el.closest('pre');
    el.style.setProperty('direction', 'ltr', 'important');
    if (!isInline) el.style.setProperty('text-align', 'left', 'important');
    el.style.setProperty('unicode-bidi', isInline ? 'isolate' : 'normal', 'important');
  }

  // ---- main content (assistant + user messages, articles, anywhere) ----
  function processContent() {
    document.querySelectorAll(TEXT_TAGS).forEach(el => {
      if (insideCode(el)) return;
      if (el.isContentEditable) return;          // editors handled separately
      const text = ownDirectText(el);
      if (!text) return;                          // pure wrapper: leave untouched
      applyDir(el, isPersian(text) ? 'rtl' : 'ltr');
    });

    // Lists: flip bullets/numbers to the right ONLY when the list itself is
    // Persian; pure-English lists (even inside a Persian article) get an
    // explicit LTR + left padding so they don't inherit right-alignment from
    // an RTL ancestor.
    document.querySelectorAll('ul, ol').forEach(list => {
      if (insideCode(list)) return;
      applyListDir(list, isPersian(list.textContent) ? 'rtl' : 'ltr');
    });

    // Code always LTR
    document.querySelectorAll('pre, code').forEach(forceCodeLTR);
  }

  // ---- input editors: toggle direction live as the user types ----
  function processEditors() {
    document.querySelectorAll(EDITOR_SELECTORS).forEach(editor => {
      const blocks = editor.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote, div');
      const targets = blocks.length ? blocks : [editor];
      targets.forEach(el => {
        if (insideCode(el)) return;
        applyDir(el, isPersian(el.textContent) ? 'rtl' : 'ltr');
      });

      editor.querySelectorAll('ul, ol').forEach(list => {
        if (insideCode(list)) return;
        applyListDir(list, isPersian(list.textContent) ? 'rtl' : 'ltr');
      });

      editor.querySelectorAll('pre, code').forEach(forceCodeLTR);
    });

    document.querySelectorAll('textarea').forEach(ta => {
      applyDir(ta, isPersian(ta.value) ? 'rtl' : 'ltr');
    });
  }

  function processAll() {
    processContent();
    processEditors();
  }

  // ---- scheduling: debounce with rAF so typing/streaming stays smooth ----
  let scheduled = false;
  function scheduleProcess() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      processAll();
    });
  }

  processAll();

  const observer = new MutationObserver(scheduleProcess);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  document.addEventListener('input', scheduleProcess, true);

  // Re-apply on SPA route changes
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(processAll, 400);
    }
  }, 600);
})();

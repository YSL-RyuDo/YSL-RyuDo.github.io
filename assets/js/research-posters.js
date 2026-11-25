"use strict";
(() => {
  const links = [...document.querySelectorAll("a.poster-trigger")];
  if (!links.length || typeof HTMLDialogElement === "undefined") return;
  const lang = document.documentElement.lang;
  const labels = { en: ["Close", "Zoom in", "Fit to screen"], ko: ["닫기", "확대", "화면에 맞추기"], ja: ["閉じる", "拡大", "画面に合わせる"] }[lang] || ["Close", "Zoom in", "Fit to screen"];
  const dialog = document.createElement("dialog");
  dialog.className = "poster-dialog";
  dialog.setAttribute("aria-labelledby", "poster-dialog-title");
  const toolbar = document.createElement("div");
  toolbar.className = "poster-toolbar";
  const title = document.createElement("strong");
  title.id = "poster-dialog-title";
  const zoom = document.createElement("button");
  zoom.type = "button";
  zoom.textContent = labels[1];
  zoom.setAttribute("aria-pressed", "false");
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = labels[0];
  close.autofocus = true;
  const viewport = document.createElement("div");
  viewport.className = "poster-viewport";
  const img = document.createElement("img");
  img.className = "poster-image";
  viewport.append(img);
  toolbar.append(title, zoom, close);
  dialog.append(toolbar, viewport);
  document.body.append(dialog);
  let trigger;
  let previousOverflow;
  links.forEach(link => {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      title.textContent = link.dataset.posterLabel;
      img.alt = link.dataset.posterLabel;
      img.src = link.href;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
    });
  });
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  zoom.addEventListener("click", () => {
    const expanded = viewport.classList.toggle("is-zoomed");
    zoom.textContent = labels[expanded ? 2 : 1];
    zoom.setAttribute("aria-pressed", String(expanded));
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    viewport.classList.remove("is-zoomed");
    viewport.scrollTo(0, 0);
    zoom.textContent = labels[1];
    zoom.setAttribute("aria-pressed", "false");
    img.removeAttribute("src");
    trigger?.focus({ preventScroll: true });
  });
})();

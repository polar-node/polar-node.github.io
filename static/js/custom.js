(function() {
  const text = "❯ polar-node // runbooks";
  const cursor = "█";
  let i = 0;
  let showCursor = true;

  function type() {
    if (i <= text.length) {
      document.title = text.slice(0, i) + (showCursor ? cursor : " ");
      i++;
      setTimeout(type, 100);
    } else {
      blink();
    }
  }

  function blink() {
    showCursor = !showCursor;
    document.title = text + (showCursor ? cursor : " ");
    setTimeout(blink, 500);
  }

  type();
})();

(function () {
  "use strict";

  var SEEN_KEY = "fs_tour_seen";
  var STEPS = [
    {
      target: "cta",
      title: "Start with the console",
      body: "This is the one button that matters first - it opens the real Agent Console, where VC, security, and growth specialists confront your idea live.",
      placement: "bottom",
    },
    {
      target: "cockpit",
      title: "The four-stage pipeline",
      body: "Agent confrontation, Codex brief, Workspace packet, Vault continuity - one founder intent moves through all four, in order, on the live system.",
      placement: "bottom",
    },
    {
      target: "judge-strip",
      title: "The judge path",
      body: "This is the fastest way to see the whole system: a 90-second verification run through every stage, plus the live status contract behind it.",
      placement: "bottom",
    },
    {
      target: "products-nav",
      title: "Every surface, one menu",
      body: "Validation Engine, Codex Compiler, Agent Console, GitHub Loop, Vault Continuity - each is a real deployed surface, not a mockup page.",
      placement: "bottom",
    },
  ];

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function seen() {
    try {
      return window.localStorage.getItem(SEEN_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markSeen() {
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch (e) {
      /* localStorage unavailable - tour just won't remember */
    }
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  var BOOT_LINES = [
    { html: '<span class="fs-ok">$</span> founder-signal --compile', ok: false },
    { html: "&gt; loading judge path…", ok: false },
    { html: '&gt; <span class="fs-ok">OK</span> agent console', ok: true },
    { html: '&gt; <span class="fs-ok">OK</span> codex brief', ok: true },
    { html: '&gt; <span class="fs-ok">OK</span> workspace packet', ok: true },
    { html: '&gt; <span class="fs-ok">OK</span> vault continuity', ok: true },
    { html: '<span class="fs-ok">compiler ready.</span>', ok: false },
  ];

  function runSlate(onDone, onSkip) {
    var overlay = el("div", "fs-tour-slate");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "FounderSignal introduction");

    var skip = el("button", "fs-tour-skip", "Skip");
    skip.type = "button";
    skip.addEventListener("click", onSkip);
    overlay.appendChild(skip);

    var terminal = el("div", "fs-tour-terminal");
    var head = el(
      "div",
      "fs-tour-terminal-head",
      "<span></span><span></span><span></span><b>founder-signal.sh</b>"
    );
    var body = el("div", "fs-tour-terminal-body");
    terminal.appendChild(head);
    terminal.appendChild(body);
    overlay.appendChild(terminal);
    document.body.appendChild(overlay);

    if (reducedMotion()) {
      setTimeout(onDone, 400);
      return;
    }

    var i = 0;
    function nextLine() {
      if (i >= BOOT_LINES.length) {
        setTimeout(onDone, 500);
        return;
      }
      var line = el("p", "fs-line", BOOT_LINES[i].html);
      body.appendChild(line);
      requestAnimationFrame(function () {
        line.classList.add("fs-in");
      });
      i += 1;
      setTimeout(nextLine, i === BOOT_LINES.length ? 260 : 220);
    }
    var caret = el("span", "fs-caret");
    body.appendChild(caret);
    setTimeout(nextLine, 200);
    return overlay;
  }

  function runSpotlight(onFinish) {
    var index = 0;
    var overlay = el("div", "fs-tour-overlay");
    overlay.setAttribute("role", "dialog");
    document.body.appendChild(overlay);

    var dim = el("div", "fs-tour-dim");
    var hole = el("div", "fs-tour-hole");
    hole.style.display = "none";
    var skip = el("button", "fs-tour-skip", "Skip");
    skip.type = "button";
    var card = el("div", "fs-tour-card");

    overlay.appendChild(dim);
    overlay.appendChild(hole);
    overlay.appendChild(skip);
    overlay.appendChild(card);

    function finish() {
      overlay.remove();
      onFinish();
    }
    skip.addEventListener("click", finish);

    function onKey(e) {
      if (e.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKey);

    function render() {
      var step = STEPS[index];
      var target = document.querySelector('[data-tour="' + step.target + '"]');

      if (target) {
        target.scrollIntoView({ block: "center", behavior: "smooth" });
      }

      setTimeout(function () {
        var rect = target ? target.getBoundingClientRect() : null;
        var pad = 10;

        if (rect) {
          hole.style.display = "block";
          hole.style.top = rect.top - pad + "px";
          hole.style.left = rect.left - pad + "px";
          hole.style.width = rect.width + pad * 2 + "px";
          hole.style.height = rect.height + pad * 2 + "px";
        } else {
          hole.style.display = "none";
        }

        var dots = STEPS.map(function (_, i) {
          return '<span class="' + (i === index ? "fs-active" : "") + '"></span>';
        }).join("");

        var isLast = index === STEPS.length - 1;
        card.innerHTML =
          '<p class="fs-step">Step ' + (index + 1) + " / " + STEPS.length + "</p>" +
          "<h3>" + step.title + "</h3>" +
          "<p>" + step.body + "</p>" +
          '<div class="fs-tour-card-footer">' +
          '<div class="fs-tour-dots">' + dots + "</div>" +
          '<div class="fs-tour-actions">' +
          (index > 0 ? '<button type="button" class="fs-tour-back">Back</button>' : "") +
          '<button type="button" class="fs-tour-next">' + (isLast ? "Done" : "Next") + "</button>" +
          "</div></div>";

        var backBtn = card.querySelector(".fs-tour-back");
        if (backBtn) {
          backBtn.addEventListener("click", function () {
            index = Math.max(0, index - 1);
            render();
          });
        }
        card.querySelector(".fs-tour-next").addEventListener("click", function () {
          if (isLast) {
            window.removeEventListener("keydown", onKey);
            finish();
            return;
          }
          index += 1;
          render();
        });

        var placement = step.placement || "bottom";
        var cardTop;
        if (rect) {
          var holeTop = rect.top - pad;
          var holeBottom = rect.bottom + pad;
          cardTop =
            placement === "bottom"
              ? Math.min(holeBottom + 16, window.innerHeight - 220)
              : Math.max(holeTop - 16, 16);
        } else {
          cardTop = window.innerHeight / 2 - 90;
        }
        card.style.top = cardTop + "px";
        var cardLeft = rect
          ? Math.min(Math.max(rect.left - pad, 20), window.innerWidth - 380)
          : window.innerWidth / 2 - 180;
        card.style.left = cardLeft + "px";
      }, 260);
    }

    render();
  }

  function startTour() {
    var slateOverlay = runSlate(
      function () {
        if (slateOverlay) slateOverlay.remove();
        runSpotlight(markSeen);
      },
      function () {
        if (slateOverlay) slateOverlay.remove();
        markSeen();
      }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!seen()) startTour();

    var replayButtons = document.querySelectorAll("[data-tour-replay]");
    replayButtons.forEach(function (btn) {
      btn.addEventListener("click", startTour);
    });
  });
})();

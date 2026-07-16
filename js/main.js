/* ==========================================================================
   Pedro Magno — Portfólio
   i18n · scroll reveal · nav ativa · partículas do hero · menu mobile
   ========================================================================== */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== i18n ===== */
  function setLang(lang) {
    var dict = I18N[lang];
    if (!dict) return;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.title = dict["meta.title"];
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", dict["meta.description"]);
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
    try { localStorage.setItem("lang", lang); } catch (e) { /* modo privado */ }
  }

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
    });
  });

  var savedLang = null;
  try { savedLang = localStorage.getItem("lang"); } catch (e) { /* modo privado */ }
  if (savedLang && savedLang !== "pt") setLang(savedLang);

  /* ===== Scroll reveal (IntersectionObserver) ===== */
  var reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ===== Nav: sombra ao rolar + link ativo ===== */
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("nav--scrolled", window.scrollY > 8);
  }, { passive: true });

  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav__link");
  function linkFor(id) {
    return document.querySelector('.nav__link[href="#' + id + '"]');
  }
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.remove("active"); });
        var link = linkFor(entry.target.id);
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ===== Menu mobile ===== */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ===== Hero: partículas conectadas (canvas) + parallax leve ===== */
  var canvas = document.getElementById("heroCanvas");
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var W, H, COUNT;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      COUNT = Math.min(90, Math.floor(W / 16));
      if (particles.length > COUNT) particles.length = COUNT;
      while (particles.length < COUNT) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }
    resize();
    window.addEventListener("resize", resize);

    var LINK_DIST = 130;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10, 132, 255, 0.55)";
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(10, 132, 255, " + (0.16 * (1 - dist / LINK_DIST)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      // roda só enquanto o hero está visível
      if (window.scrollY < window.innerHeight * 1.2) {
        requestAnimationFrame(frame);
      } else {
        heroAnimPaused = true;
      }
    }
    var heroAnimPaused = false;
    requestAnimationFrame(frame);
    window.addEventListener("scroll", function () {
      // parallax leve no canvas + retomada da animação ao voltar ao topo
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        canvas.style.transform = "translateY(" + y * 0.25 + "px)";
        if (heroAnimPaused) {
          heroAnimPaused = false;
          requestAnimationFrame(frame);
        }
      }
    }, { passive: true });
  }

  /* ===== Hero: efeito de digitação no nome ===== */
  var heroTitle = document.querySelector(".hero__title");
  if (heroTitle && !reducedMotion) {
    var fullName = heroTitle.textContent;
    heroTitle.textContent = "";
    heroTitle.classList.add("typing");
    heroTitle.setAttribute("aria-label", fullName);
    var typed = 0;
    var typeNext = function () {
      typed++;
      heroTitle.textContent = fullName.slice(0, typed);
      if (typed < fullName.length) {
        setTimeout(typeNext, 85 + Math.random() * 70);
      } else {
        // caret continua piscando um instante e some
        setTimeout(function () { heroTitle.classList.remove("typing"); }, 2200);
      }
    };
    setTimeout(typeNext, 500);
  }

  /* ===== Cursor customizado (só desktop com ponteiro fino) ===== */
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reducedMotion) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add("cursor-on");

    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = "translate(" + (mx - 3.5) + "px," + (my - 3.5) + "px)";
    }, { passive: true });

    (function followLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%, -50%)";
      requestAnimationFrame(followLoop);
    })();

    document.addEventListener("mouseover", function (e) {
      var root = document.documentElement;
      if (e.target.closest("a, button, .chip")) {
        root.classList.add("cursor--link");
        root.classList.remove("cursor--project");
      } else if (e.target.closest(".project")) {
        root.classList.add("cursor--project");
        root.classList.remove("cursor--link");
      } else {
        root.classList.remove("cursor--link", "cursor--project");
      }
    });

    document.addEventListener("mouseleave", function () {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });
  }

  /* ===== E-mail: copia o endereço + confirma (mailto pode não ter app padrão) ===== */
  var mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (mailLinks.length) {
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    var toastTimer;
    var showToast = function (msg) {
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2800);
    };

    var legacyCopy = function (text) {
      return new Promise(function (resolve, reject) {
        try {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.top = "0";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          var ok = document.execCommand("copy");
          document.body.removeChild(ta);
          ok ? resolve() : reject(new Error("execCommand copy falhou"));
        } catch (err) { reject(err); }
      });
    };

    // Tenta a Clipboard API moderna; se ela existir mas for bloqueada
    // (ex.: sem gesto de usuário), cai para o método legado execCommand.
    var copyText = function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(function () {
          return legacyCopy(text);
        });
      }
      return legacyCopy(text);
    };

    mailLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var email = link.getAttribute("href").replace(/^mailto:/, "");
        var lang = document.documentElement.lang === "en" ? "en" : "pt";
        // Um mailto sem cliente de e-mail padrão "não faz nada". Em vez de
        // depender disso, cancelamos a navegação e copiamos o endereço,
        // dando um retorno visível em qualquer máquina. O href continua
        // sendo mailto: (semântica, acessibilidade e "copiar link" seguem ok).
        e.preventDefault();
        copyText(email).then(function () {
          showToast(I18N[lang]["contact.copied"]);
        }).catch(function () {
          // Se a área de transferência for bloqueada, tenta o mailto como fallback.
          window.location.href = link.getAttribute("href");
        });
      });
    });
  }

})();

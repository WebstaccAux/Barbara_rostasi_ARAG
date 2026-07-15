document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const year = document.querySelector("[data-year]");
const form = document.querySelector("[data-contact-form]");
const legalDialog = document.querySelector("[data-legal-dialog]");
const legalTitle = document.querySelector("[data-legal-title]");
const legalContent = document.querySelector("[data-legal-content]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const cursorGlow = document.querySelector("[data-cursor-glow]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (year) year.textContent = new Date().getFullYear();

requestAnimationFrame(() => {
  document.body.classList.add("page-ready");
});

const getHeaderOffset = () => {
  const headerHeight = header?.getBoundingClientRect().height || 0;
  return Math.ceil(headerHeight + 24);
};

const updateAnchorOffset = () => {
  document.documentElement.style.setProperty("--anchor-offset", `${getHeaderOffset()}px`);
};

updateAnchorOffset();
window.addEventListener("resize", updateAnchorOffset, { passive: true });

const getHashTarget = (hash) => {
  if (!hash || hash === "#") return null;
  const id = decodeURIComponent(hash.slice(1));
  return document.getElementById(id);
};

const scrollToTarget = (target, updateHash = true) => {
  if (!target) return;

  updateAnchorOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion ? "auto" : "smooth",
  });

  if (updateHash && target.id) {
    window.history.pushState(null, "", `#${target.id}`);
  }
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = getHashTarget(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    closeMenu();
    requestAnimationFrame(() => scrollToTarget(target));
  });
});

window.addEventListener("load", () => {
  const target = getHashTarget(window.location.hash);
  if (target) {
    requestAnimationFrame(() => scrollToTarget(target, false));
  }
});

let scrollFrame;
const updateScrollProgress = () => {
  if (!scrollProgress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
};

const requestScrollProgress = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateScrollProgress();
    scrollFrame = null;
  });
};

updateScrollProgress();
window.addEventListener("scroll", requestScrollProgress, { passive: true });
window.addEventListener("resize", requestScrollProgress, { passive: true });

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealElements = document.querySelectorAll(
    [
      ".hero__footnote",
      ".motion-strip",
      ".section-heading",
      ".solution-card",
      ".insurance-bridge",
      ".insurance-bridge__points p",
      ".section-note",
      ".process__intro",
      ".process-list li",
      ".about__portrait",
      ".about__copy",
      ".about__promises > div",
      ".reassurance__panel",
      ".reassurance__points p",
      ".faq__intro",
      ".accordion details",
      ".contact__copy",
      ".contact__direct a",
      ".contact__hours",
      ".contact-form",
      ".footer__top > div",
      ".footer__legal p",
    ].join(","),
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 5) * 75}ms`);

    if (element.matches(".about__portrait, .process__intro, .faq__intro, .contact__copy")) {
      element.style.setProperty("--reveal-x", "-34px");
      element.style.setProperty("--reveal-y", "0");
    }

    if (element.matches(".about__copy, .contact-form")) {
      element.style.setProperty("--reveal-x", "34px");
      element.style.setProperty("--reveal-y", "0");
    }

    if (
      element.matches(
        ".solution-card:nth-child(even), .process-list li:nth-child(even), .reassurance__points p:nth-child(even), .contact__direct a:nth-child(even)",
      )
    ) {
      element.style.setProperty("--reveal-x", "30px");
    }

    if (
      element.matches(
        ".solution-card:nth-child(odd), .process-list li:nth-child(odd), .reassurance__points p:nth-child(odd), .contact__direct a:nth-child(odd)",
      )
    ) {
      element.style.setProperty("--reveal-x", "-24px");
    }

    revealObserver.observe(element);
  });
}

if (finePointer && !reduceMotion) {
  let cursorFrame;
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  const updateCursorGlow = () => {
    cursorGlow?.style.setProperty("--cursor-x", `${cursorX}px`);
    cursorGlow?.style.setProperty("--cursor-y", `${cursorY}px`);
    cursorFrame = null;
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      document.body.classList.add("has-pointer");

      if (!cursorFrame) {
        cursorFrame = requestAnimationFrame(updateCursorGlow);
      }
    },
    { passive: true },
  );

  document.addEventListener("pointerleave", () => {
    document.body.classList.remove("has-pointer");
  });

  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const bounds = button.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      button.style.setProperty("--btn-x", `${x}%`);
      button.style.setProperty("--btn-y", `${y}%`);
    });
  });

  document.querySelectorAll(".solution-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });

  const heroVisual = document.querySelector(".hero__visual");
  const heroImage = document.querySelector(".hero__image-wrap");

  heroVisual?.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    heroImage?.style.setProperty("--hero-x", `${x}px`);
    heroImage?.style.setProperty("--hero-y", `${y}px`);
  });

  heroVisual?.addEventListener("pointerleave", () => {
    heroImage?.style.setProperty("--hero-x", "0px");
    heroImage?.style.setProperty("--hero-y", "0px");
  });
}

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeMenu = () => {
  menu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menu?.classList.toggle("is-open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  document.body.classList.toggle("menu-open", willOpen);
});

menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

menu?.addEventListener("click", (event) => {
  if (event.target === menu) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});

const legalPages = {
  kozvetito: {
    title: "Közvetítői tájékoztató",
    content: `
      <h3>A közvetítő státusza</h3>
      <p>Barbara Rostasi az ipari törvénykönyv (Gewerbeordnung, GewO) 34d. § (7) bekezdése szerinti kötött biztosításközvetítőként az ARAG biztosítócsoport megbízásából és javára közvetít biztosításokat.</p>
      <h3>Elérhetőség</h3>
      <p>Wankelstraße 2, 86356 Neusäß, Deutschland<br>Telefon: <a href="tel:+491732360415">+49 173 2360415</a><br>E-mail: <a href="mailto:Barbara.Rostasi@arag-partner.de">Barbara.Rostasi@arag-partner.de</a></p>
      <h3>Nyilvántartás és ellenőrzés</h3>
      <p>A közvetítői státuszra vonatkozó adatok a közvetítői nyilvántartásban ellenőrizhetők: Deutscher Industrie- und Handelskammertag (DIHK) e. V., Breite Straße 29, 10178 Berlin, <a href="https://www.vermittlerregister.info" rel="noopener">www.vermittlerregister.info</a>.</p>
      <h3>Javadalmazás és összeférhetetlenség</h3>
      <p>A biztosításközvetítői tevékenység javadalmazása a választott terméktől és a közvetítői megállapodástól függhet. A konkrét információkat a szerződéskötés előtt, a kötelező tájékoztatás keretében kell megadni.</p>
      <h3>Panaszkezelés</h3>
      <p>Panasz vagy kérdés esetén elsőként közvetlenül Barbara Rostasihoz fordulhat a fenti elérhetőségeken. A további jogorvoslati fórumokat és határidőket a szerződéskötés előtti hivatalos közvetítői dokumentumokban kell feltüntetni.</p>
      <h3>Terméktájékoztatás</h3>
      <p>A biztosítás megkötése előtt az ügyfélnek meg kell kapnia és át kell tekintenie a hivatalos termékismertetőt, biztosítási feltételeket, díjtájékoztatást és minden kötelező szerződéskötés előtti dokumentumot.</p>
    `,
  },
};

const openLegal = (pageKey) => {
  const page = legalPages[pageKey];
  if (!page || !legalDialog) return;
  legalTitle.textContent = page.title;
  legalContent.innerHTML = page.content;
  legalDialog.showModal();
};

document.querySelectorAll("[data-legal]").forEach((button) => {
  button.addEventListener("click", () => openLegal(button.dataset.legal));
});

document.querySelectorAll("[data-close-legal]").forEach((button) => {
  button.addEventListener("click", () => legalDialog?.close());
});

legalDialog?.addEventListener("click", (event) => {
  if (event.target === legalDialog) legalDialog.close();
});

const showFieldState = (field, isValid) => {
  field.classList.toggle("is-invalid", !isValid);
  const error = field.closest("label")?.querySelector(".field-error");
  error?.classList.toggle("is-visible", !isValid);
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.elements.name;
  const phone = form.elements.phone;
  const email = form.elements.email;
  const topic = form.elements.topic;
  const message = form.elements.message;
  const privacy = form.elements.privacy;
  const privacyError = form.querySelector(".field-error--privacy");

  const nameValid = name.value.trim().length >= 2;
  const phoneValid = phone.value.replace(/\D/g, "").length >= 8;
  const emailValid = !email.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  const privacyValid = privacy.checked;

  showFieldState(name, nameValid);
  showFieldState(phone, phoneValid);
  showFieldState(email, emailValid);
  privacyError?.classList.toggle("is-visible", !privacyValid);

  if (!nameValid || !phoneValid || !emailValid || !privacyValid) {
    const firstInvalid = form.querySelector(".is-invalid");
    (firstInvalid || privacy).focus();
    return;
  }

  const targetEmail = form.dataset.contactEmail || "Barbara.Rostasi@arag-partner.de";
  const subject = `Visszahívási kérés - ${name.value.trim()}`;
  const body = [
    "Új kapcsolatfelvételi kérés a weboldalról:",
    "",
    `Név: ${name.value.trim()}`,
    `Telefonszám: ${phone.value.trim()}`,
    `E-mail: ${email.value.trim() || "-"}`,
    `Téma: ${topic.value || "-"}`,
    "",
    "Üzenet:",
    message.value.trim() || "-",
    "",
    "Adatkezelési hozzájárulás: igen",
    `Oldal: ${window.location.href}`,
  ].join("\n");
  const mailto = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const success = form.querySelector(".form-success");
  success.hidden = false;
  success.scrollIntoView({ behavior: "smooth", block: "nearest" });
  window.location.href = mailto;
});

form?.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid")) showFieldState(field, field.checkValidity());
    if (field.name === "privacy" && field.checked) {
      form.querySelector(".field-error--privacy")?.classList.remove("is-visible");
    }
  });
});

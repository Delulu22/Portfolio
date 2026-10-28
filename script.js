/* ==========================================================================
   JASPER TANG SEE YONG — PORTFOLIO INTERACTIVITY (script.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Light / Dark Mode Theme Toggle
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("jasper-portfolio-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    htmlEl.setAttribute("data-theme", savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      htmlEl.setAttribute("data-theme", next);
      localStorage.setItem("jasper-portfolio-theme", next);
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu when clicking a nav link
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 4. Interactive "Pick A-Frame" Frame Switcher inside Project Card #1
  const demoFrame = document.getElementById("demoFrame");
  const frameSwatches = document.querySelectorAll(".frame-swatch");

  if (demoFrame && frameSwatches.length > 0) {
    frameSwatches.forEach((btn) => {
      btn.addEventListener("click", () => {
        const frameClass = btn.getAttribute("data-frame");
        demoFrame.className = `artwork-frame ${frameClass}`;

        frameSwatches.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  // 5. Project Category Filter Tabs
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";
        if (filter === "all" || categories.includes(filter)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // 6. Funnel UI Design Lightbox Modal
  const designModal = document.getElementById("designModal");
  const openModalBtn1 = document.getElementById("openDesignModalBtn");
  const openModalBtn2 = document.getElementById("openDesignModalBtn2");
  const closeModalBtn = document.getElementById("closeDesignModalBtn");

  const openModal = () => {
    if (!designModal) return;
    designModal.classList.add("open");
    designModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!designModal) return;
    designModal.classList.remove("open");
    designModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (openModalBtn1) openModalBtn1.addEventListener("click", openModal);
  if (openModalBtn2) openModalBtn2.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

  if (designModal) {
    designModal.addEventListener("click", (e) => {
      if (e.target === designModal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // 7. One-Click Copy Email Button
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = copyEmailBtn.getAttribute("data-email") || "jaspertsy2005@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = "✓ Copied!";
        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
        }, 2000);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // 8. Quick Mail Form (Opens pre-filled Email Client)
  const quickMailForm = document.getElementById("quickMailForm");
  if (quickMailForm) {
    quickMailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const sender = document.getElementById("senderName")?.value.trim() || "Recruiter";
      const message = document.getElementById("senderMessage")?.value.trim() || "";
      const subject = encodeURIComponent(`Portfolio Inquiry from ${sender}`);
      const body = encodeURIComponent(`${message}\n\n— Sent via Jasper Tang's Portfolio`);
      window.location.href = `mailto:jaspertsy2005@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});

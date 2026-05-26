const devkitContainer = document.getElementById("devkit-container");
const navDevkit = document.getElementById("nav-devkit");
const navHhhl = document.getElementById("nav-hhhl");
let currentFlow = "landing";

const setActiveNav = (sectionKey) => {
  document.querySelectorAll(".nav-btn").forEach((b) =>
    b.classList.remove("active", "bg-blue-200")
  );
  const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionKey}"]`);
  if (activeBtn) activeBtn.classList.add("active", "bg-blue-200");
};

const showFlow = (flow) => {
  currentFlow = flow;
  if (flow === "devkit") {
    devkitContainer.classList.remove("hidden");
    navDevkit.classList.remove("hidden");
    navHhhl.classList.add("hidden");
  } else if (flow === "hhhl") {
    devkitContainer.classList.remove("hidden");
    navDevkit.classList.add("hidden");
    navHhhl.classList.remove("hidden");
  } else {
    devkitContainer.classList.remove("hidden");
    navDevkit.classList.add("hidden");
    navHhhl.classList.add("hidden");
  }
};

const showSection = (sectionKey) => {
  document.querySelectorAll(".content-section").forEach((sec) =>
    sec.classList.add("hidden")
  );
  const target = document.getElementById(`section-${sectionKey}`);
  if (target) {
    const flow = target.dataset.flow;
    if (flow && flow !== currentFlow) {
      showFlow(flow);
    }
    target.classList.remove("hidden");
  }
  setActiveNav(sectionKey);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ───────────────────────────────────────────────
// Sidebar tab switching
// ───────────────────────────────────────────────
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    showSection(btn.dataset.section);
  });
});

// ───────────────────────────────────────────────
// Hotspot tooltip system (supports hover + click)
// ───────────────────────────────────────────────
document.querySelectorAll(".hotspot").forEach((spot) => {
  const label = spot.dataset.label || "";
  const title = spot.dataset.title || "";
  const desc = spot.dataset.desc || "";

  // Render the numeric label
  spot.textContent = label;

  // Create tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "hotspot-tooltip";
  tooltip.innerHTML = `<h4>${title}</h4><p class="hotspot-desc">${desc}</p>`;

  const container = spot.closest(".hotspot-container") || document.body;
  container.appendChild(tooltip);

  // Function to position tooltip
  const positionTooltip = () => {
    const spotRect = spot.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const offsetX = 40;
    const offsetY = -10;

    tooltip.style.position = "absolute";
    tooltip.style.left = `${spotRect.left - containerRect.left + offsetX}px`;
    tooltip.style.top = `${spotRect.top - containerRect.top + offsetY}px`;
    tooltip.style.zIndex = "9999";
  };

  const showTooltip = () => {
    positionTooltip();
    tooltip.classList.add("visible");
  };

  const hideTooltip = () => {
    tooltip.classList.remove("visible");
  };

  // Desktop hover support
  spot.addEventListener("mouseenter", showTooltip);
  spot.addEventListener("mouseleave", hideTooltip);

  // Mobile click/tap support
  spot.addEventListener("click", (e) => {
    e.stopPropagation();

    // Hide all other tooltips first
    document.querySelectorAll(".hotspot-tooltip.visible").forEach((t) =>
      t.classList.remove("visible")
    );

    // Toggle this one
    if (tooltip.classList.contains("visible")) {
      hideTooltip();
    } else {
      showTooltip();
    }
  });

  // Click anywhere outside to close tooltip (mobile)
  document.addEventListener("click", (e) => {
    if (!spot.contains(e.target) && !tooltip.contains(e.target)) {
      hideTooltip();
    }
  });

  // Adjust on window resize
  window.addEventListener("resize", () => {
    if (tooltip.classList.contains("visible")) {
      positionTooltip();
    }
  });
});


// ───────────────────────────────────────────────
// "Next Step" navigation between sections
// ───────────────────────────────────────────────
document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const nextSection = btn.dataset.next;
    if (!nextSection) return;
    showSection(nextSection);
  });
});

// ───────────────────────────────────────────────
// Accordion toggle logic
// ───────────────────────────────────────────────
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    const body = item.querySelector(".accordion-body");
    const icon = item.querySelector(".accordion-icon");

    // Toggle visibility
    const isOpen = !body.classList.contains("hidden");
    document.querySelectorAll(".accordion-body").forEach((b) => b.classList.add("hidden"));
    document.querySelectorAll(".accordion-icon").forEach((i) => (i.textContent = "+"));

    if (!isOpen) {
      body.classList.remove("hidden");
      icon.textContent = "–";
    } else {
      body.classList.add("hidden");
      icon.textContent = "+";
    }
  });
});


// ───────────────────────────────────────────────
// Mobile Sidebar Toggle
// ───────────────────────────────────────────────
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("menu-toggle");
const closeBtn = document.getElementById("menu-close");

// Open sidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.remove("-translate-x-full");
});

// Close sidebar
closeBtn.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
});

// Optional: close sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (
    !sidebar.contains(e.target) &&
    !toggleBtn.contains(e.target) &&
    window.innerWidth < 1024
  ) {
    sidebar.classList.add("-translate-x-full");
  }
});

// ───────────────────────────────────────────────
// Landing page choice
// ───────────────────────────────────────────────
document.querySelectorAll(".landing-choice").forEach((card) => {
  card.addEventListener("click", () => {
    const flow = card.dataset.flow;
    const start = card.dataset.start;
    showFlow(flow);
    showSection(start);
  });
});

const homeBtn = document.getElementById("qsg-home");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    showFlow("landing");
    showSection("landing");
  });
}

// Default to landing view
showFlow("landing");
showSection("landing");

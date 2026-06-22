const normalizePath = (value) => {
  if (!value || value === "/") {
    return "index.html";
  }

  return value.replace(/^\.?\//, "") || "index.html";
};

const currentPath = normalizePath(window.location.pathname.split("/").pop());

document.querySelectorAll("[data-nav-link]").forEach((link) => {
  const href = normalizePath(link.getAttribute("href"));
  const isActive = href === currentPath;

  link.classList.toggle("is-active", isActive);

  if (isActive) {
    link.setAttribute("aria-current", "page");
  }
});

const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const enquiryForm = document.querySelector("[data-enquiry-form]");
const enquiryResponse = document.querySelector("[data-enquiry-response]");

if (enquiryForm && enquiryResponse) {
  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    enquiryResponse.textContent = "Thank you for your enquiry. Our team will connect with you shortly.";
    enquiryForm.reset();
  });
}

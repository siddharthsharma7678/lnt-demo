import emailjs from "@emailjs/browser";

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

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();

document.querySelectorAll("[data-contact-email-row]").forEach((row) => {
  row.hidden = !contactEmail;
});

document.querySelectorAll("[data-contact-email-link]").forEach((link) => {
  if (!contactEmail) {
    link.hidden = true;
    return;
  }

  link.hidden = false;
  link.href = `mailto:${contactEmail}`;
  link.textContent = contactEmail;
});

const enquiryForm = document.querySelector("[data-enquiry-form]");
const enquiryResponse = document.querySelector("[data-enquiry-response]");
const emailjsConfig = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim(),
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim(),
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim(),
};

if (enquiryForm && enquiryResponse) {
  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = enquiryForm.querySelector('button[type="submit"]');

    if (!emailjsConfig.publicKey || !emailjsConfig.serviceId || !emailjsConfig.templateId) {
      enquiryResponse.textContent = "Enquiry service is not configured yet.";
      return;
    }

    const formData = new FormData(enquiryForm);
    const templateParams = {
      to_email: contactEmail || "",
      from_name: String(formData.get("name") || ""),
      from_phone: String(formData.get("phone") || ""),
      reply_to: String(formData.get("email") || ""),
      interested_in: String(formData.get("interest") || ""),
      message: String(formData.get("message") || ""),
    };

    if (submitButton) {
      submitButton.disabled = true;
    }

    enquiryResponse.textContent = "Sending your enquiry...";

    try {
      await emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, templateParams, {
        publicKey: emailjsConfig.publicKey,
      });

      enquiryResponse.textContent = "Thank you for your enquiry. Our team will connect with you shortly.";
      enquiryForm.reset();
    } catch (error) {
      enquiryResponse.textContent = "We could not send your enquiry right now. Please try again shortly.";
      console.error("EmailJS send failed", error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

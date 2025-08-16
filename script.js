// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initProgressBar();
  initNavigation();
  initBackToTop();
  initSmoothScrolling();
  initScrollAnimations();
  initToolCardAnimations();
  initMobileMenu();
});

// Progress Bar
function initProgressBar() {
  const progressBar = document.getElementById("progressBar");

  window.addEventListener("scroll", () => {
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = Math.min(scrolled, 100) + "%";
  });
}

// Navigation
function initNavigation() {
  const navbar = document.querySelector(".navbar");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove scrolled class for styling
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });

  // Highlight active navigation link
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });
}

// Back to Top Button
function initBackToTop() {
  const backToTopButton = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');

  [...navLinks, ...tocLinks].forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navMenu = document.getElementById("navMenu");
        const navToggle = document.getElementById("navToggle");
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  });
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all sections and tool cards
  const elementsToObserve = document.querySelectorAll(
    ".content-section, .tool-card, .toc, .download-card"
  );
  elementsToObserve.forEach((element) => {
    observer.observe(element);
  });
}

// Tool Card Animations
function initToolCardAnimations() {
  const toolCards = document.querySelectorAll(".tool-card");

  toolCards.forEach((card, index) => {
    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;

    // Add hover sound effect (visual feedback)
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });

    // Add click ripple effect
    card.addEventListener("click", (e) => {
      const ripple = document.createElement("div");
      ripple.classList.add("ripple");

      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

      card.style.position = "relative";
      card.style.overflow = "hidden";
      card.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add ripple animation CSS
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
}

// Mobile Menu
function initMobileMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });

  // Close menu on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
}

// Reading Progress Indicator
function updateReadingProgress() {
  const article = document.querySelector(".main-content");
  const scrolled = window.scrollY;
  const articleTop = article.offsetTop;
  const articleHeight = article.scrollHeight;
  const windowHeight = window.innerHeight;

  const progress = Math.min(
    Math.max((scrolled - articleTop) / (articleHeight - windowHeight), 0),
    1
  );
  document.getElementById("progressBar").style.width = progress * 100 + "%";
}

// Lazy Loading for Better Performance
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Search Functionality (if needed in future)
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const toolCards = document.querySelectorAll(".tool-card");

      toolCards.forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const description = card.querySelector("p").textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll(".tool-tags span"))
          .map((tag) => tag.textContent.toLowerCase())
          .join(" ");

        const isMatch =
          title.includes(query) ||
          description.includes(query) ||
          tags.includes(query);

        card.style.display = isMatch ? "block" : "none";
      });
    });
  }
}

// Performance Monitoring
function initPerformanceMonitoring() {
  // Monitor page load performance
  window.addEventListener("load", () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    console.log(`Page load time: ${pageLoadTime}ms`);

    // Send analytics if needed (placeholder)
    if (typeof gtag !== "undefined") {
      gtag("event", "page_load_time", {
        value: pageLoadTime,
        custom_parameter: "performance",
      });
    }
  });
}

// Dark Mode Toggle (Future Enhancement)
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");

  if (darkModeToggle) {
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
      );
    });
  }
}

// Keyboard Navigation
function initKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    // Press 'T' to go to top
    if (e.key === "t" || e.key === "T") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Press 'B' to go to bottom
    if (e.key === "b" || e.key === "B") {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }

    // Press 'Escape' to close mobile menu
    if (e.key === "Escape") {
      const navMenu = document.getElementById("navMenu");
      const navToggle = document.getElementById("navToggle");
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
}

// Copy to Clipboard Functionality
function initCopyToClipboard() {
  const copyButtons = document.querySelectorAll(".copy-button");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const textToCopy = button.getAttribute("data-copy");

      try {
        await navigator.clipboard.writeText(textToCopy);
        button.textContent = "Copied!";
        button.classList.add("copied");

        setTimeout(() => {
          button.textContent = "Copy";
          button.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    });
  });
}

// Social Share Functionality
function initSocialShare() {
  const shareButtons = document.querySelectorAll(".share-button");

  shareButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const platform = button.getAttribute("data-platform");
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);

      let shareUrl = "";

      switch (platform) {
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case "email":
          shareUrl = `mailto:?subject=${title}&body=${url}`;
          break;
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    });
  });
}

// Form Validation (if contact form is added)
function initFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const errors = [];

      // Validate required fields
      const requiredFields = form.querySelectorAll("[required]");
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          errors.push(`${field.name} is required`);
          field.classList.add("error");
        } else {
          field.classList.remove("error");
        }
      });

      // Validate email
      const emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach((field) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value && !emailRegex.test(field.value)) {
          errors.push("Please enter a valid email address");
          field.classList.add("error");
        }
      });

      if (errors.length === 0) {
        // Submit form
        console.log("Form submitted successfully");
        form.reset();
        showNotification("Thank you for your message!", "success");
      } else {
        showNotification(errors[0], "error");
      }
    });
  });
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#f44336"
            : "#2196F3"
        };
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize additional features when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initLazyLoading();
  initPerformanceMonitoring();
  initKeyboardNavigation();
  initCopyToClipboard();
  initSocialShare();
  initFormValidation();
});

// Service Worker Registration (for future PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

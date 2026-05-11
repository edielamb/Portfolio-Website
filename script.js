const projectMenu = document.querySelector(".project-menu");

// Page-load reveal animation on landing page.
document.documentElement.classList.add("reveal-ready");

requestAnimationFrame(() => {
  document.documentElement.classList.add("reveal-in");
});

const revealItems = document.querySelectorAll(".reveal-on-scroll");
const projectMainImage = document.querySelector("[data-project-main-image]");
const projectThumbnails = document.querySelectorAll("[data-image-class], [data-video-src]");
const projectFooter = document.querySelector(".project-footer");

// Previous/next project footer links on project pages.
if (projectFooter) {
  const projectOrder = [
    "project1.html",
    "subversitype.html",
    "mixedmedia.html",
    "rebirth.html",
    "instructionmanual.html",
  ];
  const currentProject = window.location.pathname.split("/").pop();
  const currentIndex = projectOrder.indexOf(currentProject);
  const [previousLink, nextLink] = projectFooter.querySelectorAll("a");

  if (currentIndex >= 0 && previousLink && nextLink) {
    previousLink.href =
      projectOrder[(currentIndex - 1 + projectOrder.length) % projectOrder.length];
    nextLink.href = projectOrder[(currentIndex + 1) % projectOrder.length];
  }
}

// Scroll reveal function for marked content sections.
if (revealItems.length) {
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${index * 90}ms`);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 18% 0px",
      },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

// Thumbnail-to-main-image swap and carousel scroll on project pages.
if (projectMainImage && projectThumbnails.length) {
  const placeholderClasses = [
    "placeholder-one",
    "placeholder-two",
    "placeholder-three",
    "placeholder-four",
    "placeholder-five",
    "project-image-main",
    "project-image-sketch-one",
    "project-image-sketch-two",
    "project-image-sketch-three",
    "project-image-gallery",
    "project-image-sub-main",
    "project-image-sub-cover",
    "project-image-card-one",
    "project-image-card-two",
    "project-image-card-three",
    "project-image-specimen-main",
    "project-image-specimen-1",
    "project-image-specimen-2",
    "project-image-specimen-3",
    "project-image-specimen-4",
    "project-image-specimen-5",
    "project-image-specimen-6",
    "project-image-specimen-7",
    "project-image-specimen-8",
    "project-image-video-cover",
    "project-image-video-page-one",
    "project-image-video-page-two",
    "project-image-demo-page",
    "project-image-rebirth-main",
    "project-image-rebirth-trunk",
    "project-image-rebirth-papers",
    "project-image-instruction-1",
    "project-image-instruction-2",
    "project-image-instruction-3",
    "project-image-instruction-4",
    "project-image-instruction-5",
    "project-image-instruction-6",
    "project-image-instruction-7",
    "project-image-instruction-8",
    "project-image-instruction-9",
    "project-image-instruction-10",
    "project-image-instruction-11",
    "project-image-instruction-12",
    "project-image-instruction-13",
    "project-image-instruction-14",
    "project-image-instruction-15",
    "project-image-downscaling",
    "project-image-overlayed",
  ];

  projectThumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const nextClass = thumbnail.dataset.imageClass;

      projectMainImage.querySelector("iframe")?.remove();
      projectMainImage.classList.remove(...placeholderClasses);

      if (thumbnail.dataset.videoSrc) {
        projectMainImage.classList.remove("project-image");
        projectMainImage.insertAdjacentHTML(
          "afterbegin",
          `<iframe src="${thumbnail.dataset.videoSrc}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
        );
      } else {
        projectMainImage.classList.add("project-image");
        projectMainImage.classList.add(nextClass);
      }

      projectThumbnails.forEach((item) => {
        const isActive = item === thumbnail;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      thumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    });
  });
}

// Smooth open/close animation for portfolio menu on home and project pages.
if (projectMenu) {
  const summary = projectMenu.querySelector(".project-menu-toggle");
  const animationTiming = {
    duration: 220,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  };

  let activeAnimation = null;

  const getClosedHeight = () => `${summary.offsetHeight}px`;

  const animateMenu = (isOpening) => {
    if (activeAnimation) {
      activeAnimation.cancel();
    }

    const startHeight = `${projectMenu.offsetHeight}px`;

    if (isOpening) {
      projectMenu.open = true;
    } else {
      projectMenu.style.minHeight = "0";
    }

    const endHeight = isOpening
      ? `${projectMenu.offsetHeight}px`
      : getClosedHeight();

    activeAnimation = projectMenu.animate(
      {
        height: [startHeight, endHeight],
      },
      animationTiming,
    );

    activeAnimation.onfinish = () => {
      if (!isOpening) {
        projectMenu.open = false;
      }

      projectMenu.style.height = "";
      projectMenu.style.minHeight = "";
      activeAnimation = null;
    };

    activeAnimation.oncancel = () => {
      activeAnimation = null;
    };
  };

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    animateMenu(!projectMenu.open);
  });
}

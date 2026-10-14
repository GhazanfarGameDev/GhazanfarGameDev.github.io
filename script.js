"use strict";

const projectCards = Array.from(document.querySelectorAll(".project-card"));
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const projectFilters = document.querySelector(".project-filters");
const projectStatus = document.getElementById("project-status");

if (projectFilters && filterButtons.length) {
    projectFilters.hidden = false;
    for (const button of filterButtons) {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            let visibleCount = 0;
            for (const card of projectCards) {
                const visible = filter === "all" || card.dataset.category.split(" ").includes(filter);
                card.hidden = !visible;
                if (visible) visibleCount += 1;
                else {
                    const video = card.querySelector("video");
                    if (video && !video.paused) video.pause();
                }
            }
            for (const filterButton of filterButtons) {
                const active = filterButton === button;
                filterButton.classList.toggle("active", active);
                filterButton.setAttribute("aria-pressed", String(active));
            }
            projectStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "project" : "projects"}: ${button.textContent}.`;
        });
    }
}

// Keep previews lightweight and let visitors choose when to play a video.
const videos = Array.from(document.querySelectorAll("video"));
for (const video of videos) {
    // Show the poster without loading the video until the visitor presses play.
    const cover = document.createElement("button");
    cover.type = "button";
    cover.className = "video-preview-cover";
    cover.setAttribute("aria-label", `Play ${video.getAttribute("aria-label")}`);
    const poster = document.createElement("img");
    poster.src = video.poster;
    poster.alt = "";
    poster.loading = "lazy";
    const playIcon = document.createElement("span");
    playIcon.className = "play-icon";
    playIcon.textContent = "▶";
    playIcon.setAttribute("aria-hidden", "true");
    cover.append(poster, playIcon);
    video.parentElement.append(cover);
    video.hidden = true;
    cover.addEventListener("click", async () => {
        video.hidden = false;
        cover.remove();
        video.focus();
        try { await video.play(); } catch { /* Native controls remain available. */ }
    });
    video.addEventListener("play", () => {
        for (const otherVideo of videos) {
            if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
        }
    });
}
if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
        }
    }, { threshold: 0 });
    for (const video of videos) videoObserver.observe(video);
}
document.addEventListener("visibilitychange", () => {
    if (document.hidden) videos.forEach((video) => { if (!video.paused) video.pause(); });
});

const copyButton = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");
if (copyButton && copyStatus) {
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText("mailtoghazanfar@gmail.com");
            copyStatus.textContent = "Email copied. Let's talk!";
        } catch {
            copyStatus.textContent = "Please copy mailtoghazanfar@gmail.com or use the email link above.";
        }
    });
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name-input").value.trim();
        const subject = document.getElementById("subject-input").value.trim() || "Project inquiry";
        const message = document.getElementById("message-input").value.trim();
        const body = message + (name ? `\n\n— ${name}` : "");
        const draftUrl = new URL("https://mail.google.com/mail/");
        draftUrl.search = new URLSearchParams({view: "cm", fs: "1", to: "mailtoghazanfar@gmail.com", su: subject, body}).toString();
        window.open(draftUrl.href, "_blank", "noopener,noreferrer");
    });
}

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

document.addEventListener("DOMContentLoaded", () => {
  /* Apply saved theme on load */
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark-mode", savedTheme === "dark");

  /* Tab navigation */
  const menuItems = document.querySelectorAll(".menu-item");
  const panels = document.querySelectorAll(".settings-panel");

  function openTab(tabId) {
    menuItems.forEach(item => {
      item.classList.toggle("active", item.dataset.tab === tabId);
    });

    panels.forEach(panel => {
      panel.classList.toggle("active", panel.id === tabId);
    });

    localStorage.setItem("activeTab", tabId);
  }

  menuItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openTab(item.dataset.tab);
    });
  });

  openTab(localStorage.getItem("activeTab") || "profile");

  /* Profile data */
  const avatars = [
    { img: "../images/avatar-noodles.png", name: "Cozy Noodles" },
    { img: "../images/avatar-dumplings.png", name: "Humpy Dumpling" },
    { img: "../images/avatar-toast.png", name: "Toasty Butter" },
    { img: "../images/avatar-sushi.png", name: "Sleepy Sushi" },
    { img: "../images/avatar-cookie.png", name: "Cookie Monster" },
    { img: "../images/avatar-cake.png", name: "Chocolat Cake" }
  ];

  const currentProfile = document.getElementById("currentProfile");
  const avatarGrid = document.getElementById("avatarGrid");
  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");

  let selectedAvatar = avatars[0];
  let editing = false;

  function getRandomAvatar() {
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  function initializeProfileData() {
    const savedAvatar = localStorage.getItem("profileAvatar");
    const savedUsername = localStorage.getItem("profileUsername");

    if (!savedAvatar || !savedUsername) {
      selectedAvatar = getRandomAvatar();
      localStorage.setItem("profileAvatar", selectedAvatar.img);
      localStorage.setItem("profileUsername", selectedAvatar.name);
      return;
    }

    selectedAvatar = avatars.find(avatar => avatar.img === savedAvatar) || avatars[0];
  }

  function renderProfile() {
    if (!currentProfile || !avatarGrid) return;

    currentProfile.innerHTML = `
      <div class="current-profile-card">
        <img src="${selectedAvatar.img}" alt="${selectedAvatar.name}">
        <div class="current-profile-info">
          <p>${selectedAvatar.name}</p>
        </div>
      </div>
    `;

    avatarGrid.innerHTML = avatars.map(avatar => `
      <img
        src="${avatar.img}"
        alt="${avatar.name}"
        class="${avatar.img === selectedAvatar.img ? "selected" : ""}"
        style="opacity:${editing ? "1" : "0.65"}; pointer-events:${editing ? "auto" : "none"}"
        data-img="${avatar.img}"
      >
    `).join("");

    avatarGrid.querySelectorAll("img").forEach(img => {
      img.addEventListener("click", () => {
        if (!editing) return;
        selectedAvatar = avatars.find(avatar => avatar.img === img.dataset.img) || selectedAvatar;
        renderProfile();
      });
    });

    if (editBtn) editBtn.disabled = editing;
    if (saveBtn) saveBtn.disabled = !editing;
  }

  editBtn?.addEventListener("click", () => {
    editing = true;
    renderProfile();
  });

  saveBtn?.addEventListener("click", () => {
    localStorage.setItem("profileAvatar", selectedAvatar.img);
    localStorage.setItem("profileUsername", selectedAvatar.name);
    editing = false;
    renderProfile();
  });

  initializeProfileData();
  renderProfile();

  /* Display theme */
  const themeCards = document.querySelectorAll(".theme-card");

  themeCards.forEach(card => {
    card.classList.toggle("active", card.dataset.theme === savedTheme);
  });

  themeCards.forEach(card => {
    card.addEventListener("click", () => {
      const selectedTheme = card.dataset.theme;

      localStorage.setItem("theme", selectedTheme);
      document.body.classList.toggle("dark-mode", selectedTheme === "dark");

      themeCards.forEach(btn => btn.classList.remove("active"));
      card.classList.add("active");
    });
  });

  /* Help form */
  const contactForm = document.getElementById("contactForm");
  const supportMessage = document.getElementById("support-message");
  const messageError = document.getElementById("messageError");
  const successMessage = document.getElementById("successMessage");

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = supportMessage.value.trim();

    if (messageError) messageError.textContent = "";
    if (successMessage) successMessage.textContent = "";

    if (message.length < 5) {
      if (messageError) messageError.textContent = "Please enter a longer message.";
      return;
    }

    if (successMessage) successMessage.textContent = "Message sent successfully!";
    contactForm.reset();
  });

  /* FAQ */
  const faqList = document.getElementById("faqList");

  const faqs = [
    ["How do I change my avatar?", "Go to Profile in Settings and choose from the preset icons."],
    ["How do I switch dark mode?", "Go to Display and select Dark Mode."],
    ["Do I need an account?", "No. This website does not require an account. Your data is stored locally on your device, and you can personalize your profile by selecting an avatar."],
    ["Is my account completely anonymous?", "Yes. This platform does not require any personal information. You are only identified by your chosen avatar."],
    ["How do I contact support?", "Use the contact form in the Help & Support section to report bugs and give feedback."]
  ];

  if (faqList) {
    faqList.innerHTML = faqs.map(([q, a]) => `
      <div class="faq-item">
        <button class="faq-question" type="button">
          <span>${q}</span>
          <span class="faq-arrow">▼</span>
        </button>
        <div class="faq-answer">
          <p>${a}</p>
        </div>
      </div>
    `).join("");

    faqList.addEventListener("click", (e) => {
      const button = e.target.closest(".faq-question");
      if (!button) return;

      const item = button.parentElement;
      const answer = button.nextElementSibling;

      item.classList.toggle("active");
      answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
  }
});
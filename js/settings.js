document.addEventListener("DOMContentLoaded", () => {

  // ================= TAB NAVIGATION =================
  const menuItems = document.querySelectorAll(".menu-item");
  const panels = document.querySelectorAll(".settings-panel");

  function openTab(tabId) {
    // switch active menu + panel
    menuItems.forEach((item) =>
      item.classList.toggle("active", item.dataset.tab === tabId)
    );
    panels.forEach((panel) =>
      panel.classList.toggle("active", panel.id === tabId)
    );

    // save tab
    localStorage.setItem("activeTab", tabId);
  }

  // click sidebar tabs
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openTab(item.dataset.tab);
    });
  });

  // restore tab on refresh
  openTab(localStorage.getItem("activeTab") || "profile");



  // ================= PROFILE (AVATAR SYSTEM) =================
  const avatars = [
    { img: "avatar-noodles.png", name: "Cozy Noodles" },
    { img: "avatar-dumplings.png", name: "Happy Dumpling" },
    { img: "avatar-toast.png", name: "Toasty Butter" },
    { img: "avatar-sushi.png", name: "Sleepy Sushi" },
    { img: "avatar-cookie.png", name: "Cookie Monster" },
    { img: "avatar-cake.png", name: "Sweet Cake" }
  ];

  const currentProfile = document.getElementById("currentProfile");
  const avatarGrid = document.getElementById("avatarGrid");
  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");

  let selectedAvatar = avatars[0];
  let editing = false;

  function renderProfile() {
    if (!currentProfile || !avatarGrid) return;

    // current selected avatar
    currentProfile.innerHTML = `
      <div class="current-profile-card">
        <img src="${selectedAvatar.img}" alt="${selectedAvatar.name}">
        <div class="current-profile-info">
          <p>${selectedAvatar.name}</p>
        </div>
      </div>
    `;

    // avatar choices
    avatarGrid.innerHTML = "";
    avatars.forEach((avatar) => {
      const img = document.createElement("img");
      img.src = avatar.img;
      img.alt = avatar.name;

      if (avatar.name === selectedAvatar.name) img.classList.add("selected");

      // enable/disable clicking
      img.style.opacity = editing ? "1" : "0.65";
      img.style.pointerEvents = editing ? "auto" : "none";

      img.addEventListener("click", () => {
        if (!editing) return;
        selectedAvatar = avatar;
        renderProfile();
      });

      avatarGrid.appendChild(img);
    });

    // edit/save button states
    if (editBtn && saveBtn) {
      editBtn.disabled = editing;
      saveBtn.disabled = !editing;
      editBtn.style.opacity = editing ? "0.6" : "1";
      saveBtn.style.opacity = editing ? "1" : "0.6";
    }
  }

  // edit mode
  editBtn?.addEventListener("click", () => {
    editing = true;
    renderProfile();
  });

  // save mode
  saveBtn?.addEventListener("click", () => {
    editing = false;
    renderProfile();
  });

  renderProfile();



  // ================= DISPLAY (LIGHT / DARK MODE) =================
  const themeCards = document.querySelectorAll(".theme-card");

  themeCards.forEach((card) => {
    card.addEventListener("click", () => {
      themeCards.forEach((item) => item.classList.remove("active"));
      card.classList.add("active");

      // toggle dark mode
      document.body.classList.toggle("dark-mode", card.dataset.theme === "dark");
    });
  });



  // ================= HELP FORM (VALIDATION) =================
  const contactForm = document.getElementById("contactForm");
  const supportMessage = document.getElementById("support-message");
  const messageError = document.getElementById("messageError");
  const successMessage = document.getElementById("successMessage");

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = supportMessage.value.trim();

    // reset messages
    messageError.textContent = "";
    successMessage.textContent = "";

    // validation
    if (message.length < 5) {
      messageError.textContent = "Please enter a longer message.";
      return;
    }

    // success
    successMessage.textContent = "Message sent successfully!";
    contactForm.reset();
  });



  // ================= FAQ (EXPAND / COLLAPSE) =================
  const faqList = document.getElementById("faqList");

  const faqs = [
    ["How do I change my avatar?", "Go to Profile in Settings and choose from the preset icons."],
    ["How do I switch dark mode?", "Go to Display and select Dark Mode."],
    ["Do I need an account?", "No. This website does not require an account. Your data is stored locally on your device, and you can personalize your profile by selecting an avatar and optional nickname in Settings."],
    ["Is my account completely anonymous?", "Yes. This platform does not require any personal information. You are only identified by your chosen avatar and optional nickname."],
    ["How do I contact support?", "Use the contact form in the Help & Support section to report bugs and give feedback.."]
  ];

  if (faqList) {
    // generate FAQ items
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

    // toggle FAQ answers
    faqList.addEventListener("click", (e) => {
      const button = e.target.closest(".faq-question");
      if (!button) return;

      const answer = button.nextElementSibling;
      const item = button.parentElement;

      item.classList.toggle("active");
      answer.style.display =
        answer.style.display === "block" ? "none" : "block";
    });
  }

});
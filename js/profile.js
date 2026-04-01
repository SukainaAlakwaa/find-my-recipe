// ================= APPLY SAVED THEME =================
const savedTheme = localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

/* Profile info */
const profileAvatar = document.getElementById("profileAvatar");
const profileUsername = document.getElementById("profileUsername");

/* Default profile */
function ensureProfileData() {
  const avatars = [
    "../images/avatar-noodles.png",
    "../images/avatar-dumplings.png",
    "../images/avatar-toast.png",
    "../images/avatar-sushi.png",
    "../images/avatar-cookie.png",
    "../images/avatar-cake.png"
  ];

  const names = [
    "Cozy Noodles",
    "Humpy Dumpling",
    "Toasty Butter",
    "Sleepy Sushi",
    "Cookie Monster",
    "Chocolat Cake"
  ];

  if (!localStorage.getItem("profileAvatar")) {
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    localStorage.setItem("profileAvatar", randomAvatar);
  }

  if (!localStorage.getItem("profileUsername")) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    localStorage.setItem("profileUsername", randomName);
  }
}

/* Load profile */
function loadProfileInfo() {
  ensureProfileData();

  const savedAvatar = localStorage.getItem("profileAvatar");
  const savedUsername = localStorage.getItem("profileUsername");

  if (profileAvatar && savedAvatar) {
    profileAvatar.src = savedAvatar;
  }

  if (profileUsername && savedUsername) {
    profileUsername.textContent = savedUsername;
  }
}

loadProfileInfo();

/* Storage keys */
const SAVED_KEY = "savedRecipes";
const FAVORITES_KEY = "favoriteRecipes";
const COLLECTIONS_KEY = "recipeCollections";
const ACTIVE_TAB_KEY = "activeProfileTab";

/* Page elements */
const tabLinks = document.querySelectorAll(".tab-link");
const sectionTitle = document.getElementById("sectionTitle");
const profileOutput = document.getElementById("profileOutput");
const collectionsPanel = document.getElementById("collectionsPanel");
const collectionNameInput = document.getElementById("collectionNameInput");
const addCollectionBtn = document.getElementById("addCollectionBtn");

/* Starter data */
function addStarterData() {
  if (!localStorage.getItem(SAVED_KEY)) {
    setSavedRecipes([
      { id: 1, title: "Pasta", image: "noodles.png" },
      { id: 2, title: "Burger", image: "noodles.png" },
      { id: 3, title: "Salad", image: "noodles.png" }
    ]);
  }

  if (!localStorage.getItem(FAVORITES_KEY)) {
    setFavoriteRecipes([1]);
  }

  if (!localStorage.getItem(COLLECTIONS_KEY)) {
    setCollections([
      { id: Date.now(), name: "Quick Meals", recipes: [1, 2] }
    ]);
  }
}

/* Storage helpers */
function getData(key, fallback = []) {
  return JSON.parse(localStorage.getItem(key)) || fallback;
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSavedRecipes() {
  return getData(SAVED_KEY);
}

function setSavedRecipes(data) {
  setData(SAVED_KEY, data);
}

function getFavoriteRecipes() {
  return getData(FAVORITES_KEY);
}

function setFavoriteRecipes(data) {
  setData(FAVORITES_KEY, data);
}

function getCollections() {
  return getData(COLLECTIONS_KEY);
}

function setCollections(data) {
  setData(COLLECTIONS_KEY, data);
}

function getActiveTab() {
  return localStorage.getItem(ACTIVE_TAB_KEY) || "saved";
}

function setActiveTab(tab) {
  localStorage.setItem(ACTIVE_TAB_KEY, tab);
}

/* Tabs UI */
function updateActiveTabUI(tab) {
  tabLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.tab === tab);
  });

  sectionTitle.textContent =
    tab === "saved" ? "Saved Recipes" :
    tab === "collections" ? "Collections" :
    "Favorites";

  collectionsPanel.classList.toggle("hidden", tab !== "collections");
}

/* Save / favorite */
function toggleSaveRecipe(id) {
  let saved = getSavedRecipes();

  if (saved.some((r) => r.id === id)) {
    saved = saved.filter((r) => r.id !== id);
  } else {
    const newRecipe = { id, title: "New Recipe", image: "noodles.png" };
    saved.unshift(newRecipe);
  }

  setSavedRecipes(saved);
  renderCurrentTab();
}

function toggleFavoriteRecipe(id) {
  let fav = getFavoriteRecipes();

  if (fav.includes(id)) {
    fav = fav.filter((r) => r !== id);
  } else {
    fav.unshift(id);
  }

  setFavoriteRecipes(fav);
  renderCurrentTab();
}

/* Collections */
function createCollection(name) {
  const n = name.trim();
  if (!n) return;

  const collections = getCollections();
  collections.unshift({ id: Date.now(), name: n, recipes: [] });

  setCollections(collections);
  collectionNameInput.value = "";
  renderCurrentTab();
}

/* Card */
function recipeCardHTML(r) {
  const fav = getFavoriteRecipes();

  return `
    <article class="recipe-card">
      <img src="${r.image}" alt="${r.title}">
      <div class="recipe-card-content">
        <h3>${r.title}</h3>
        <div class="recipe-actions">
          <button onclick="toggleSaveRecipe(${r.id})">Remove</button>
          <button onclick="toggleFavoriteRecipe(${r.id})">
            ${fav.includes(r.id) ? "Unheart" : "Heart"}
          </button>
        </div>
      </div>
    </article>
  `;
}

/* Render saved */
function renderSavedRecipes() {
  const data = getSavedRecipes();

  if (!data.length) {
    profileOutput.innerHTML = `<p class="empty-message">No recipes.</p>`;
    return;
  }

  profileOutput.innerHTML = data.map(recipeCardHTML).join("");
}

/* Render favorites */
function renderFavorites() {
  const favIds = getFavoriteRecipes();
  const saved = getSavedRecipes();
  const data = saved.filter((r) => favIds.includes(r.id));

  if (!data.length) {
    profileOutput.innerHTML = `<p class="empty-message">No favorites.</p>`;
    return;
  }

  profileOutput.innerHTML = data.map(recipeCardHTML).join("");
}

/* Render collections */
function renderCollections() {
  const collections = getCollections();

  if (!collections.length) {
    profileOutput.innerHTML = `<p class="empty-message">No collections.</p>`;
    return;
  }

  profileOutput.innerHTML = collections.map((c) => `
    <div class="collection-card">
      <h3>${c.name}</h3>
      <p>${c.recipes.length} recipes</p>
    </div>
  `).join("");
}

/* Main render */
function renderCurrentTab() {
  const tab = getActiveTab();
  updateActiveTabUI(tab);

  if (tab === "saved") renderSavedRecipes();
  if (tab === "collections") renderCollections();
  if (tab === "favorites") renderFavorites();
}

/* Events */
tabLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveTab(link.dataset.tab);
    renderCurrentTab();
  });
});

addCollectionBtn?.addEventListener("click", () => {
  createCollection(collectionNameInput.value);
});

/* Init */
addStarterData();
loadProfileInfo();
renderCurrentTab();
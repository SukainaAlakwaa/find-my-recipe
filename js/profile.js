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

  if (!localStorage.getItem("profileAvatar")) {
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    localStorage.setItem("profileAvatar", randomAvatar);
  }

  if (!localStorage.getItem("profileUsername")) {
    localStorage.setItem("profileUsername", "Chef" + (Math.floor(Math.random() * 900) + 100));
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
const collectionEditor = document.getElementById("collectionEditor");
const editCollectionName = document.getElementById("editCollectionName");
const collectionRecipesList = document.getElementById("collectionRecipesList");

/* Starter data */
function addStarterData() {
  if (!localStorage.getItem(SAVED_KEY)) {
    setSavedRecipes([]);
  }

  if (!localStorage.getItem(FAVORITES_KEY)) {
    setFavoriteRecipes([]);
  }

  if (!localStorage.getItem(COLLECTIONS_KEY)) {
    setCollections([]);
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
  collectionEditor.classList.add("hidden");
}

/* Render favorites */
function renderFavorites() {
  const favIds = getFavoriteRecipes().map(String);
  const saved = getSavedRecipes();
  const data = saved.filter((r) => favIds.includes(String(r.id)));

  if (!data.length) {
    profileOutput.innerHTML = `<p class="empty-message">No favorites.</p>`;
    return;
  }

  profileOutput.innerHTML = data.map(recipeCardHTML).join("");
}

/* Remove saved recipe */
function toggleSaveRecipe(id) {
  const recipeId = String(id);

  let saved = getSavedRecipes();
  saved = saved.filter((r) => String(r.id) !== recipeId);
  setSavedRecipes(saved);

  let favorites = getFavoriteRecipes().map(String);
  favorites = favorites.filter((favId) => favId !== recipeId);
  setFavoriteRecipes(favorites);

  let collections = getCollections();
  collections = collections.map((collection) => ({
    ...collection,
    recipes: collection.recipes.filter((recipe) => String(recipe.id) !== recipeId)
  }));
  setCollections(collections);

  if (selectedCollectionId) {
    const currentCollection = collections.find(
      (c) => String(c.id) === String(selectedCollectionId)
    );

    if (currentCollection) {
      openCollectionEditor(selectedCollectionId);
    } else {
      collectionEditor.classList.add("hidden");
      selectedCollectionId = null;
      localStorage.removeItem("activeCollectionId");
    }
  }

  renderCurrentTab();
}

/* Toggle favorite */
function toggleFavoriteRecipe(id) {
  let fav = getFavoriteRecipes().map(String);
  const stringId = String(id);

  if (fav.includes(stringId)) {
    fav = fav.filter((r) => r !== stringId);
  } else {
    fav.unshift(stringId);
  }

  setFavoriteRecipes(fav);
  renderCurrentTab();
}

/* Create collection */
function createCollection(name) {
  const n = name.trim();
  if (!n) return;

  const collections = getCollections();
  collections.unshift({
    id: Date.now(),
    name: n,
    recipes: [],
    locked: false
  });

  setCollections(collections);
  collectionNameInput.value = "";
  renderCurrentTab();
}

/* Collection state */
let selectedCollectionId = null;
let selectedRecipeId = null;

/* Render collections */
function renderCollections() {
  const collections = getCollections();

  if (!collections.length) {
    profileOutput.innerHTML = `<p class="empty-message">No collections.</p>`;
    return;
  }

  profileOutput.innerHTML = collections.map((c) => `
    <div class="collection-card" onclick="openCollectionEditor('${String(c.id)}')">
      <h3>${c.name}</h3>
      <p>${c.recipes.length} recipes</p>
    </div>
  `).join("");
}

/* Check collection save */
function isRecipeInCollection(recipeId) {
  const collections = getCollections();

  return collections.some((collection) =>
    !collection.locked &&
    collection.recipes.some((recipe) => String(recipe.id) === String(recipeId))
  );
}

/* Recipe card */
function recipeCardHTML(r) {
  const favIds = getFavoriteRecipes().map(String);
  const isFav = favIds.includes(String(r.id));
  const isCollected = isRecipeInCollection(r.id);

  return `
    <article class="recipe-card">
      <div class="recipe-click" onclick="openSavedRecipeDetails('${String(r.id)}')">
        <img src="${r.image}" alt="${r.title}">
        <div class="recipe-card-content">
          <h3>${r.title}</h3>
        </div>
      </div>

      <div class="recipe-actions">
        <button onclick="toggleSaveRecipe('${String(r.id)}')" class="icon-btn" title="Remove">
          <i class="fa-solid fa-trash"></i>
        </button>

        <button onclick="toggleFavoriteRecipe('${String(r.id)}')" class="icon-btn" title="Favorite">
          <i class="${isFav ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
        </button>

        <button onclick="openCollectionPopup('${String(r.id)}')" class="icon-btn" title="Add to collection">
          <i class="${isCollected ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}"></i>
        </button>
      </div>
    </article>
  `;
}

/* Open recipe details */
function openRecipeDetails(recipe) {
  localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
  localStorage.setItem("fromPage", "profile");
  window.location.href = "../pages/recipe.html";
}

/* Open saved recipe details */
function openSavedRecipeDetails(recipeId) {
  const savedRecipes = getSavedRecipes();
  const recipe = savedRecipes.find((r) => String(r.id) === String(recipeId));
  if (!recipe) return;

  openRecipeDetails(recipe);
}

/* Open collection recipe details */
function openCollectionRecipeDetails(collectionId, recipeId) {
  const collections = getCollections();
  const collection = collections.find((c) => String(c.id) === String(collectionId));
  if (!collection) return;

  const recipe = collection.recipes.find((r) => String(r.id) === String(recipeId));
  if (!recipe) return;

  openRecipeDetails(recipe);
}

/* Open collection popup */
function openCollectionPopup(recipeId) {
  const popup = document.getElementById("collectionPopup");
  const popupList = document.getElementById("collectionPopupList");
  const collections = getCollections().filter((c) => !c.locked);

  selectedRecipeId = recipeId;

  if (!collections.length) {
    popupList.innerHTML = `<p class="empty-message">No collections yet.</p>`;
  } else {
    popupList.innerHTML = collections.map((collection) => `
      <button
        type="button"
        class="collection-option-btn"
        onclick="addRecipeToCollection('${String(recipeId)}', '${String(collection.id)}')">
        ${collection.name}
      </button>
    `).join("");
  }

  popup.classList.remove("hidden");
}

/* Close collection popup */
document.getElementById("closeCollectionPopupBtn")?.addEventListener("click", () => {
  document.getElementById("collectionPopup").classList.add("hidden");
  selectedRecipeId = null;
});

/* Add recipe to collection */
function addRecipeToCollection(recipeId, collectionId) {
  const savedRecipes = getSavedRecipes();
  const collections = getCollections();

  const recipe = savedRecipes.find((r) => String(r.id) === String(recipeId));
  const collection = collections.find((c) => String(c.id) === String(collectionId));

  if (!recipe || !collection) return;

  const alreadyExists = collection.recipes.some(
    (r) => String(r.id) === String(recipe.id)
  );

  if (alreadyExists) {
    alert("Recipe is already in this collection.");
    return;
  }

  collection.recipes.unshift(recipe);
  setCollections(collections);

  document.getElementById("collectionPopup").classList.add("hidden");
  selectedRecipeId = null;
  renderCurrentTab();
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

/* Open collection editor */
function openCollectionEditor(id) {
  const collections = getCollections();
  const collection = collections.find((c) => String(c.id) === String(id));
  if (!collection) return;

  selectedCollectionId = id;
  localStorage.setItem("activeCollectionId", String(id));

  collectionEditor.classList.remove("hidden");
  editCollectionName.value = collection.name;

  const deleteBtn = document.getElementById("deleteCollectionBtn");
  deleteBtn.style.display = collection.locked ? "none" : "inline-block";

  if (!collection.recipes.length) {
    collectionRecipesList.innerHTML = "<p>No recipes in this collection.</p>";
    return;
  }

  collectionRecipesList.innerHTML = collection.recipes.map((recipe) => `
    <article class="collection-recipe-card">
      <div class="collection-recipe-click" onclick="openCollectionRecipeDetails('${id}', '${recipe.id}')">
        <img src="${recipe.image}" alt="${recipe.title}" class="collection-recipe-image">
        <div class="collection-recipe-content">
          <h4>${recipe.title}</h4>
        </div>
      </div>
      <button
        type="button"
        class="collection-remove-btn"
        onclick="event.stopPropagation(); removeRecipeFromCollection('${id}', '${recipe.id}')">
        Remove
      </button>
    </article>
  `).join("");
}

/* Remove recipe from collection */
function removeRecipeFromCollection(collectionId, recipeId) {
  const collections = getCollections();
  const collection = collections.find((c) => String(c.id) === String(collectionId));
  if (!collection) return;

  collection.recipes = collection.recipes.filter(
    (recipe) => String(recipe.id) !== String(recipeId)
  );

  setCollections(collections);
  renderCollections();

  const updatedCollection = collections.find(
    (c) => String(c.id) === String(collectionId)
  );

  if (!updatedCollection) {
    collectionEditor.classList.add("hidden");
    selectedCollectionId = null;
    localStorage.removeItem("activeCollectionId");
    return;
  }

  selectedCollectionId = collectionId;
  collectionEditor.classList.remove("hidden");
  openCollectionEditor(collectionId);
}

/* Save edited collection name */
document.getElementById("saveCollectionEditBtn")?.addEventListener("click", () => {
  const collections = getCollections();
  const collection = collections.find(
    (c) => String(c.id) === String(selectedCollectionId)
  );
  if (!collection) return;

  if (!collection.locked) {
    collection.name = editCollectionName.value.trim() || collection.name;
  }

  setCollections(collections);
  renderCurrentTab();
  openCollectionEditor(selectedCollectionId);
});

/* Delete collection */
document.getElementById("deleteCollectionBtn")?.addEventListener("click", () => {
  let collections = getCollections();
  const collection = collections.find(
    (c) => String(c.id) === String(selectedCollectionId)
  );

  if (!collection || collection.locked) return;

  collections = collections.filter(
    (c) => String(c.id) !== String(selectedCollectionId)
  );

  setCollections(collections);
  collectionEditor.classList.add("hidden");
  selectedCollectionId = null;
  localStorage.removeItem("activeCollectionId");
  renderCurrentTab();
});

/* Close collection editor */
document.getElementById("closeCollectionEditorBtn")?.addEventListener("click", () => {
  collectionEditor.classList.add("hidden");
  selectedCollectionId = null;
  localStorage.removeItem("activeCollectionId");
});

/* Main render */
function renderCurrentTab() {
  const tab = getActiveTab();
  updateActiveTabUI(tab);

  if (tab === "saved") renderSavedRecipes();
  if (tab === "collections") renderCollections();
  if (tab === "favorites") renderFavorites();
}

/* Restore open collection */
function restoreOpenCollection() {
  const activeId = localStorage.getItem("activeCollectionId");
  const activeTab = getActiveTab();

  if (activeTab !== "collections" || !activeId) return;

  const collections = getCollections();
  const foundCollection = collections.find(
    (c) => String(c.id) === String(activeId)
  );

  if (foundCollection) {
    openCollectionEditor(activeId);
  }
}

/* Events */
tabLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveTab(link.dataset.tab);
    renderCurrentTab();
    restoreOpenCollection();
  });
});

addCollectionBtn?.addEventListener("click", () => {
  createCollection(collectionNameInput.value);
});

collectionNameInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    createCollection(collectionNameInput.value);
  }
});

/* Init */
addStarterData();
loadProfileInfo();
renderCurrentTab();
restoreOpenCollection();
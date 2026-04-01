const savedTheme = localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

const hero = document.getElementById("hero");
const recipesContainer = document.getElementById("recipesContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestionsBox = document.getElementById("suggestionsBox");

let heroRecipes = [];
let currentHeroIndex = 0;
let heroInterval = null;
let suggestionTimeout = null;

// Save recipe in the same format the profile page uses
function saveRecipeToProfile(meal) {
  let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

  const recipeToSave = {
    id: Number(meal.idMeal),
    title: meal.strMeal,
    image: meal.strMealThumb
  };

  const alreadySaved = savedRecipes.some(
    (recipe) => recipe.id === recipeToSave.id
  );

  if (!alreadySaved) {
    savedRecipes.unshift(recipeToSave);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    return true;
  }

  return false;
}

// Load hero images from API
async function loadHeroImages(query = "chicken") {
  heroRecipes = await fetchRecipes(query);
  currentHeroIndex = 0;

  if (heroRecipes.length > 0) {
    changeHeroImage();

    clearInterval(heroInterval);
    heroInterval = setInterval(changeHeroImage, 3000);
  }
}

// Change hero background image
function changeHeroImage() {
  if (!heroRecipes.length) return;

  const heroImage = heroRecipes[currentHeroIndex].strMealThumb;

  hero.style.background = `
    linear-gradient(rgba(243, 239, 226, 0.55), rgba(243, 239, 226, 0.55)),
    url('${heroImage}') center/cover no-repeat
  `;

  currentHeroIndex = (currentHeroIndex + 1) % heroRecipes.length;
}

// Display recipes on home page
async function displayRecipes(query = "chicken") {
  const recipes = await fetchRecipes(query);

  recipesContainer.innerHTML = "";

  if (!recipes.length) {
    recipesContainer.innerHTML = `
      <p class="no-results">No recipes found for "${query}"</p>
    `;
    return;
  }

  recipes.slice(0, 6).forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <a href="pages/recipe.html?id=${meal.idMeal}" class="recipe-link">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h3>${meal.strMeal}</h3>
      </a>
      <button class="save-btn">Save</button>
    `;

    const saveBtn = card.querySelector(".save-btn");

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const saved = saveRecipeToProfile(meal);

      if (saved) {
        saveBtn.textContent = "Saved ✓";
      } else {
        saveBtn.textContent = "Already Saved";
      }
    });

    recipesContainer.appendChild(card);
  });
}

// Go to search results page
function goToSearchResults(query) {
  if (!query) return;
  window.location.href = `pages/search-results.html?query=${encodeURIComponent(query)}`;
}

// Handle search
function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  suggestionsBox.style.display = "none";
  goToSearchResults(query);
}

// Show suggestions
async function showSuggestions(query = "") {
  const suggestions = await fetchRecipeSuggestions(query);

  suggestionsBox.innerHTML = "";

  if (!suggestions.length) {
    suggestionsBox.style.display = "none";
    return;
  }

  suggestions.forEach((meal) => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");
    item.textContent = meal.strMeal;

    item.addEventListener("click", () => {
      searchInput.value = meal.strMeal;
      suggestionsBox.style.display = "none";
      goToSearchResults(meal.strMeal);
    });

    suggestionsBox.appendChild(item);
  });

  suggestionsBox.style.display = "block";
}

// Show suggestions when user clicks/focuses the search bar
searchInput.addEventListener("focus", () => {
  showSuggestions(searchInput.value.trim());
});

// Update suggestions while typing
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  clearTimeout(suggestionTimeout);
  suggestionTimeout = setTimeout(() => {
    showSuggestions(query);
  }, 200);
});

// Search button click
searchBtn.addEventListener("click", handleSearch);

// Enter key search
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// Hide suggestions if user clicks outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    suggestionsBox.style.display = "none";
  }
});

// Initial page load
loadHeroImages("chicken");
displayRecipes("chicken");
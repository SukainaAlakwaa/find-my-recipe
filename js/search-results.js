const savedTheme = localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

const recipesContainer = document.getElementById("recipesContainer");
const resultsTitle = document.getElementById("resultsTitle");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestionsBox = document.getElementById("suggestionsBox");

let suggestionTimeout = null;

function getQueryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("query") || "";
}

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
    localStorage.setItem("fromPage", "home");
    return true;
  }

  return false;
}

async function displaySearchResults(query) {
  const recipes = await fetchRecipes(query);

  recipesContainer.innerHTML = "";
  resultsTitle.textContent = `Results for "${query}"`;

  if (!recipes.length) {
    recipesContainer.innerHTML = `<p class="no-results">No recipes found for "${query}"</p>`;
    return;
  }

  recipes.slice(0, 9).forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <a href="recipe.html?id=${meal.idMeal}" class="recipe-link">
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

function goToSearchResults(query) {
  if (!query) return;
  window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
}

function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  suggestionsBox.style.display = "none";
  goToSearchResults(query);
}

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

searchInput.addEventListener("focus", () => {
  showSuggestions(searchInput.value.trim());
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  clearTimeout(suggestionTimeout);
  suggestionTimeout = setTimeout(() => {
    showSuggestions(query);
  }, 200);
});

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    suggestionsBox.style.display = "none";
  }
});

const query = getQueryFromURL();

if (query) {
  searchInput.value = query;
  displaySearchResults(query);
}
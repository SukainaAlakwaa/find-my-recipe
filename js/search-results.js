const recipesContainer = document.getElementById("recipesContainer");
const resultsTitle = document.getElementById("resultsTitle");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function getQueryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("query") || "";
}

async function displaySearchResults(query) {
  const recipes = await fetchRecipes(query);

  recipesContainer.innerHTML = "";
  resultsTitle.textContent = `Results for "${query}"`;

  if (!recipes.length) {
    recipesContainer.innerHTML = `<p class="no-results">No recipes found for "${query}"</p>`;
    return;
  }

  recipes.forEach((meal) => {
    const card = document.createElement("a");
    card.classList.add("recipe-card");
    card.href = `recipe.html?id=${meal.idMeal}`;

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
    `;

    recipesContainer.appendChild(card);
  });
}

function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) return;

  window.location.href = `pages/search-results.html?query=${encodeURIComponent(query)}`;
}

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

const query = getQueryFromURL();

if (query) {
  searchInput.value = query;
  displaySearchResults(query);
}
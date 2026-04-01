// ================= APPLY SAVED THEME =================
const savedTheme = localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

// ================= ELEMENTS =================
const recipeDetailsContainer = document.getElementById("recipeDetails");
const backBtn = document.getElementById("backBtn");

// ================= BACK BUTTON =================
const fromPage = localStorage.getItem("fromPage");

if (backBtn) {
  if (fromPage === "profile") {
    backBtn.href = "profile.html";
    backBtn.textContent = "← Back";
  } else {
    backBtn.href = "../index.html";
    backBtn.textContent = "← Back to Home";
  }
}

// ================= GET URL ID =================
function getRecipeIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ================= GET SELECTED RECIPE =================
function getSelectedRecipe() {
  return JSON.parse(localStorage.getItem("selectedRecipe"));
}

// ================= FETCH API RECIPE =================
async function fetchRecipeDetails(id) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipe details");
    }

    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
}

// ================= API INGREDIENTS =================
function getIngredientsList(recipe) {
  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<li>${measure ? measure : ""} ${ingredient}</li>`;
    }
  }

  return ingredients;
}

// ================= LOCAL INGREDIENTS =================
function getLocalIngredientsList(recipe) {
  if (!recipe.ingredients) return "<li>No ingredients available.</li>";

  return recipe.ingredients
    .split("\n")
    .filter(line => line.trim() !== "")
    .map(line => `<li>${line}</li>`)
    .join("");
}

// ================= RENDER LOCAL RECIPE =================
function renderLocalRecipe(recipe) {
  recipeDetailsContainer.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}" class="detail-image" />
    <h1>${recipe.title}</h1>
    <p><strong>Category:</strong> ${recipe.category || "N/A"}</p>
    <p><strong>Area:</strong> ${recipe.area || "N/A"}</p>

    <h2>Ingredients</h2>
    <ul>
      ${getLocalIngredientsList(recipe)}
    </ul>

    <h2>Instructions</h2>
    <div class="instructions">
      <p>${recipe.directions ? recipe.directions.replace(/\n/g, "<br><br>") : "No instructions available."}</p>
    </div>
  `;
}

// ================= RENDER API RECIPE =================
function renderAPIRecipe(recipe) {
  recipeDetailsContainer.innerHTML = `
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="detail-image" />
    <h1>${recipe.strMeal}</h1>
    <p><strong>Category:</strong> ${recipe.strCategory || "N/A"}</p>
    <p><strong>Area:</strong> ${recipe.strArea || "N/A"}</p>

    <h2>Ingredients</h2>
    <ul>
      ${getIngredientsList(recipe)}
    </ul>

    <h2>Instructions</h2>
    <div class="instructions">
      <p>${recipe.strInstructions ? recipe.strInstructions.replace(/\r\n/g, "<br><br>") : "No instructions available."}</p>
    </div>
  `;
}

// ================= LOAD RECIPE DETAILS =================
async function loadRecipeDetails() {
  const selectedRecipe = getSelectedRecipe();

  // If recipe came from Saved / Favorites / Collections
  if (selectedRecipe) {
    localStorage.removeItem("selectedRecipe");

    // Custom recipe made in Add New
    if (selectedRecipe.directions || selectedRecipe.ingredients) {
      renderLocalRecipe(selectedRecipe);
      return;
    }

    // API recipe saved from home page
    if (selectedRecipe.id) {
      const apiRecipe = await fetchRecipeDetails(selectedRecipe.id);

      if (apiRecipe) {
        renderAPIRecipe(apiRecipe);
        return;
      }
    }
  }

  // Fallback: recipe opened directly from API page with ?id=
  const recipeId = getRecipeIdFromURL();

  if (!recipeId) {
    recipeDetailsContainer.innerHTML = "<p>Recipe not found.</p>";
    return;
  }

  const recipe = await fetchRecipeDetails(recipeId);

  if (!recipe) {
    recipeDetailsContainer.innerHTML = "<p>Could not load recipe details.</p>";
    return;
  }

  renderAPIRecipe(recipe);
}

loadRecipeDetails();
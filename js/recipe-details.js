// ================= APPLY SAVED THEME =================
const savedTheme = localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

const recipeDetailsContainer = document.getElementById("recipeDetails");

function getRecipeIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

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

async function loadRecipeDetails() {
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

loadRecipeDetails();
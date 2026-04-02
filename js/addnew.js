// ================= APPLY SAVED THEME =================
const savedTheme = localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

const recipeDetailsContainer = document.getElementById("recipeDetails");

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

function applyTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
}



const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const label = document.getElementById("imageLabel");

// chatgpt generated code for image preview, works, will have to add a way to change img if user wants
input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
        label.style.display = "none";
    }
});

// chatgpt generated code for automatic bullet points, will read up abt more efficient ways to do this
document.querySelector(".ingredients .placeholder")
.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.execCommand("insertText", false, "\n• ");
        e.preventDefault();
    }
});

// POST RECIPE
document.querySelector(".post-btn").addEventListener("click", () => {
    const title = document.querySelector(".title .placeholder").innerText.trim();
    const category = document.querySelectorAll(".small .placeholder")[0].innerText.trim();
    const area = document.querySelectorAll(".small .placeholder")[1].innerText.trim();
    const ingredients = document.querySelector(".ingredients .placeholder").innerText.trim();
    const directions = document.querySelector(".directions .placeholder").innerText.trim();

    const image = preview.src || "../images/recipe-default.png";

    if (!title) {
        alert("Please add a title!");
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
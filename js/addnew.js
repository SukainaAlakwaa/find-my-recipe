// WAIT FOR PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    loadProfile();
    setupImageUpload();
    setupIngredientsList();
    setupCreateButton();
});


// IMAGE UPLOAD
function setupImageUpload() {
    // load all elements as vars that you can use in js
    const input = document.getElementById("imageInput");
    const preview = document.getElementById("preview");
    const label = document.getElementById("imageLabel");
    const editBtn = document.querySelector(".edit-btn");
    const wrapper = document.querySelector(".image-preview-wrapper"); 

    // if these elements don't exist, exit function
    if (!input || !preview || !label || !editBtn || !wrapper) return;

    // chatgpt generated code for image preview
    input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;

        preview.src = URL.createObjectURL(file); // creates temporary url from selected image file, sets the preview
        preview.style.display = "block"; // display image, previously hidden
        label.style.display = "none"; // hides "upload image" text
    // end of AI generated code

        // show edit button + enable hover state
        wrapper.classList.add("has-image");
    });

    // allows user to edit the picture they chose
    editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        input.click();
    });
}


// INGREDIENT LIST
function setupIngredientsList() {
    const list = document.querySelector(".ingredients-list");
    if (!list) return;

    // ensure at least one li exists
    list.addEventListener("focus", () => {
        if (list.children.length === 0) {
            list.appendChild(document.createElement("li"));
        }
    });

    // prevent deleting last item
    list.addEventListener("keydown", (e) => {
        const items = list.querySelectorAll("li");

        if (e.key === "Backspace") {
            if (items.length === 1 && items[0].innerText.trim() === "") {
                e.preventDefault(); // keep at least one empty item
            }
        }
    });
}


// CREATE RECIPE
function setupCreateButton() {
    const createBtn = document.querySelector(".create-btn");
    if (!createBtn) return;

    createBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleCreate(); 
    });
}

// connects to the profile page
function handleCreate() {

    const isValid = validateForm();
    if (!isValid) return;

    const title = document.querySelector(".title input").value.trim();

    const preview = document.getElementById("preview");
    const image = (preview && preview.src && preview.style.display === "block")
        ? preview.src
        : "../images/recipe-default.png";

    const newRecipe = {
        id: String(Date.now()),
        title,
        image,

        category: document.querySelectorAll(".small input")[0].value.trim(),
        area: document.querySelectorAll(".small input")[1].value.trim(),
        directions: document.querySelector(".directions textarea").value.trim(),
        ingredients: Array.from(document.querySelectorAll(".ingredients-list li"))
            .map(li => li.innerText.trim())
            .filter(text => text !== "")
            .join("\n"),

    isUserRecipe: true // flag to identify custom recipes
    };

    saveRecipe(newRecipe);

    // sends to profile page after saving
    window.location.href = "../pages/profile.html";
}


// STORAGE
function saveRecipe(recipe) {
    // save to Saved Recipes
    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    saved.unshift(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(saved));

    // save to My Recipes collection
    let collections = JSON.parse(localStorage.getItem("recipeCollections")) || [];

    let myRecipes = collections.find(c => c.name === "My Recipes");

    // if My Recipes doesn't exist, then create it
    if (!myRecipes) {
        myRecipes = {
            id: String(Date.now()),
            name: "My Recipes",
            recipes: [],
            locked: true // defaulting to locked so that users dont accidentally delete the collection
        };
        collections.unshift(myRecipes);
    }

    // add recipe to collection
    myRecipes.recipes.unshift(recipe);

    localStorage.setItem("recipeCollections", JSON.stringify(collections));
}


// PROFILE
function loadProfile() {

    const currentProfile = document.getElementById("currentProfile");
    const avatar = localStorage.getItem("profileAvatar");
    const username = localStorage.getItem("profileUsername");

    if (!currentProfile || !avatar || !username) return;

    currentProfile.innerHTML = `
        <div class="current-profile-card">
            <img src="${avatar}" alt="${username}">
            <div class="current-profile-info">
                <p>${username}</p>
            </div>
        </div>
    `;
}


// THEME
function applyTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
}

// FORM VALIDATION
function validateForm() {
    const title = document.querySelector(".title input");
    const category = document.querySelectorAll(".small input")[0];
    const area = document.querySelectorAll(".small input")[1];
    const directions = document.querySelector(".directions textarea");
    const ingredients = document.querySelector(".ingredients-list");

    let isValid = true;

    const setError = (element, message) => {
        const parent = element.closest(".input-control");
        const errorDisplay = parent.querySelector(".error-message");

        errorDisplay.innerText = message;
        parent.classList.add("error");
        parent.classList.remove("success");
    };

    const setSuccess = (element) => {
        const parent = element.closest(".input-control");
        const errorDisplay = parent.querySelector(".error-message");

        errorDisplay.innerText = "";
        parent.classList.remove("error");
        parent.classList.add("success");
    };

    // TITLE
    if (title.value.trim() === "") {
        setError(title, "Title is required");
        isValid = false;
    } else if (title.value.length > 50) {
        setError(title, "Max 50 characters");
        isValid = false;
    } else {
        setSuccess(title);
    }

    // CATEGORY
    if (category.value.length > 20) {
        setError(category, "Max 20 characters");
        isValid = false;
    } else {
        setSuccess(category);
    }

    // AREA
    if (area.value.length > 20) {
        setError(area, "Max 20 characters");
        isValid = false;
    } else {
        setSuccess(area);
    }

    // INGREDIENTS
    const ingredientItems = Array.from(ingredients.querySelectorAll("li"))
        .map(li => li.innerText.trim())
        .filter(text => text !== "");

    if (ingredientItems.length === 0) {
        setError(ingredients, "Add at least one ingredient");
        isValid = false;
    } else {
        setSuccess(ingredients);
    }

    // DIRECTIONS
    if (directions.value.trim() === "") {
        setError(directions, "Directions are required");
        isValid = false;
    } else {
        setSuccess(directions);
    }

    return isValid;
}
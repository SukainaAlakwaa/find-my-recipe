// WAIT FOR PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    loadProfile();
    setupImageUpload();
    setupIngredientsList();
    setupPostButton();
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

        preview.src = URL.createObjectURL(file); // creates temporary url from selected image file, sets the p
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


// POST RECIPE
function setupPostButton() {
    const createBtn = document.querySelector(".create-btn");
    if (!createBtn) return;

    createBtn.addEventListener("click", handlePost);
}
// connects to the profile page
function handlePost() {
    const title = document.querySelector(".title .placeholder")?.innerText.trim(); // removes extra spaces
    const category = document.querySelectorAll(".small .placeholder")[0]?.innerText.trim();
    const area = document.querySelectorAll(".small .placeholder")[1]?.innerText.trim();

    const ingredients = Array.from(document.querySelectorAll(".ingredients-list li"))
        .map(li => li.innerText.trim())
        .filter(text => text !== "");

    const directions = document.querySelector(".directions .placeholder")?.innerText.trim();

    const preview = document.getElementById("preview");

    const image = (preview && preview.src && preview.style.display === "block")
        ? preview.src
        : "../images/recipe-default.png";

    if (!title) {
        alert("Please add a title!");
        return;
    }

    const newRecipe = {
        id: String(Date.now()),
        title,
        image,
        category,
        area,
        ingredients,
        directions
    };

    saveRecipe(newRecipe);

    // redirect after saving
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

    // if My Recipes collection doesn't exist, then create it
    if (!myRecipes) {
        myRecipes = {
            id: String(Date.now()),
            name: "My Recipes",
            recipes: [],
            locked: true // defaulting to locked so that users dont accidentally delete it
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
document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    loadProfile();

    const input = document.getElementById("imageInput");
    const preview = document.getElementById("preview");
    const label = document.getElementById("imageLabel");
    const editBtn = document.querySelector(".edit-btn");

    // chatgpt generated code for image preview
    input.addEventListener("change", () => {
        const file = input.files[0];
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
            label.style.display = "none";
    // end of AI generated code

            document.querySelector(".image-preview-wrapper").classList.add("has-image");
        }
    });

    // allows user to edit the picture they chose
    editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        input.click();
    });
});

function loadProfile() {
    const currentProfile = document.getElementById("currentProfile");

    const avatar = localStorage.getItem("profileAvatar");
    const username = localStorage.getItem("profileUsername");

    if (!avatar || !username) return;

    currentProfile.innerHTML = `
        <div class="current-profile-card">
            <img src="${avatar}" alt="${username}">
            <div class="current-profile-info">
                <p>${username}</p>
            </div>
        </div>
    `;
}

function applyTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
}

const list = document.querySelector(".ingredients-list");

// ensure at least one li exists
list.addEventListener("focus", () => {
    if (list.children.length === 0) {
        const li = document.createElement("li");
        list.appendChild(li);
    }
});

// prevent deleting last item
list.addEventListener("keydown", (e) => {
    const items = list.querySelectorAll("li");

    if (e.key === "Backspace") {
        if (items.length === 1 && items[0].innerText.trim() === "") {
            e.preventDefault(); // keep one empty item
        }
    }
});


// POST RECIPE
document.querySelector(".post-btn").addEventListener("click", () => {
    const title = document.querySelector(".title .placeholder").innerText.trim();
    const category = document.querySelectorAll(".small .placeholder")[0].innerText.trim();
    const area = document.querySelectorAll(".small .placeholder")[1].innerText.trim();

    const ingredients = Array.from(document.querySelectorAll(".ingredients-list li"))
        .map(li => li.innerText.trim())
        .filter(text => text !== "");

    const directions = document.querySelector(".directions .placeholder").innerText.trim();

    const image = preview.src && preview.style.display === "block"
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
    window.location.href = "../pages/profile.html";
});

function saveRecipe(recipe) {
    // save to Saved Recipes
    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    saved.unshift(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(saved));

    // save to My Recipes collection
    let collections = JSON.parse(localStorage.getItem("recipeCollections")) || [];

    let myRecipes = collections.find(c => c.name === "My Recipes");

    // if My Recipes collection doesn't exist, then  create it
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
document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    loadProfile();
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


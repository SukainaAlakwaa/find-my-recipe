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
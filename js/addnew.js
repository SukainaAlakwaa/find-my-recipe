const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const label = document.getElementById("imageLabel");

input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
        label.style.display = "none";
    }
});
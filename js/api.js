// AI-assisted: Used ChatGPT to understand async/await syntax and proper error handling with try/catch
async function fetchRecipes(query = "chicken") {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

// AI-assisted: Used ChatGPT to help structure the suggestions fetch and limit results with .slice()
async function fetchRecipeSuggestions(query = "") {
  try {
    const url = query.trim()
      ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
      : `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }

    const data = await response.json();
    return (data.meals || []).slice(0, 5);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}
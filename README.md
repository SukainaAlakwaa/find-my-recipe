# Assignment 04: Team Project - FindMyRecipe

## TEAM MEMBERS & CONTRIBUTIONS

**Sukaina Al-akwaa — 101347833**
- Developed the homepage (index.html) and the recipe details page (recipe.html)
- Integrated TheMealDB recipe API for fetching and displaying recipes
- Implemented search and live search suggestions with auto-complete
- Built save functionality using localStorage
- Built the shared navigation bar (header) and footer as reusable partials
- Created the partial include system to load header/footer across all pages
- Implemented the responsive hamburger menu for mobile
- Wrote the Visual Direction and Site Organization sections of the project document

**Althea Bacon**
-

**Julia Khanyukova**
-


## DESCRIPTION OF THE SITE

FindMyRecipe is a simple recipe website where users can search for meals, save recipes, and create their own. It's made for students and busy people who don't want to scroll through a bunch of platforms just to figure out what to cook. You can search by ingredient or dish name, save what you like, and organize everything in one place.


## HOW TO NAVIGATE THE SITE

- **Home** — Browse recipe cards on the main page or click "Find Recipes" to scroll down. Click any recipe to see the full details.
- **Search** — Type in the search bar at the top. Suggestions show up as you type. Press Enter or click one to see results.
- **Search Results** — Shows recipes matching your search. You can save any of them from here.
- **Recipe Details** — Shows the full recipe with ingredients and instructions. Click the back button to go back.
- **Profile** — View your saved recipes, collections, and favorites. You can also create collections to organize recipes.
- **Add New** — Create your own recipe by filling in a title, category, ingredients, directions, and uploading an image.
- **Settings** — Change your avatar and username, switch between light/dark mode, check FAQs, or contact support.


## AI USAGE DOCUMENTATION

### Sukaina Al-akwaa

I used ChatGPT to support me while developing parts of the JavaScript functionality for the FindMyRecipe website. The AI was mainly used as a learning and debugging aid rather than to fully generate solutions. All AI-generated suggestions were reviewed, tested, and modified by me to ensure they met the project requirements and worked correctly within the application.

**api.js:** Used ChatGPT to understand and implement async/await for fetching data from TheMealDB API, and to improve error handling with try/catch blocks.

**script.js:** Used ChatGPT to help debug API fetch logic for loading recipes on the homepage, to guide the logic for dynamically updating search suggestions based on user input and limiting displayed results, and to build the save-to-localStorage functionality.

**search-results.js:** Used ChatGPT to help structure the search results display logic, including reading query parameters from the URL and rendering filtered recipe cards.

**recipe-details.js:** Used ChatGPT to help with fetching individual recipe details by ID from the API, and to structure the rendering logic for both API recipes and locally created recipes.


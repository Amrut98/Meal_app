// HTML elements
const searchInput = document.getElementById("searchInput");
const mealList = document.getElementById("mealList");
const favoritesList = document.getElementById("favoritesList");
const searchButton = document.getElementById("searchButton"); // Added search button

// Arrays to store data
let meals = [];
let favorites = [];

// Function to fetch meals from TheMealDB API
async function fetchMeals() {
    const searchValue = searchInput.value.trim();

    if (searchValue === "") {
        mealList.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
        const data = await response.json();

        if (data.meals) {
            meals = data.meals;
            displayMeals();
        } else {
            mealList.innerHTML = "No meals found.";
        }
    } catch (error) {
        console.error("Error fetching meal data:", error);
    }
}

// Function to display search results
function displayMeals() {
    mealList.innerHTML = "";

    meals.forEach((meal) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${meal.strMeal}</span>
            <button onclick="addToFavorites('${meal.idMeal}', '${meal.strMeal}')">Add to Favorites</button>
            <a href="meal.html?id=${meal.idMeal}">View Details</a> <!-- Include idMeal in href -->
        `;
        mealList.appendChild(listItem);
    });
}

// Function to display meal details
async function showMealDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get("id");

    if (!mealId) {
        // Handle the case where mealId is not present
        const mealDetails = document.getElementById("mealDetails");
        mealDetails.innerHTML = "Meal details not found.";
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();

        if (data.meals) {
            const meal = data.meals[0];
            const mealDetails = document.getElementById("mealDetails");
            mealDetails.innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>${meal.strInstructions}</p>
            `;
        } else {
            // Handle the case where meal details are not found
            const mealDetails = document.getElementById("mealDetails");
            mealDetails.innerHTML = "Meal details not found.";
        }
    } catch (error) {
        console.error("Error fetching meal details:", error);
    }
}

// Call the showMealDetails function when the page loads
window.addEventListener("load", showMealDetails);


// Function to add a meal to favorites
function addToFavorites(mealId, mealName) {
    if (!favorites.find((fav) => fav.id === mealId)) {
        favorites.push({ id: mealId, name: mealName });
        displayFavorites();
        saveFavoritesToLocalStorage();
    }
}

// Function to remove a meal from favorites
function removeFromFavorites(mealId) {
    favorites = favorites.filter((fav) => fav.id !== mealId);
    displayFavorites();
    saveFavoritesToLocalStorage();
}

// Function to display favorite meals
function displayFavorites() {
    favoritesList.innerHTML = "";

    favorites.forEach((fav) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${fav.name}</span>
            <button onclick="removeFromFavorites('${fav.id}')">Remove</button>
        `;
        favoritesList.appendChild(listItem);
    });
}

// Function to save favorites to local storage
function saveFavoritesToLocalStorage() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Function to load favorites from local storage
function loadFavoritesFromLocalStorage() {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
        displayFavorites();
    }
}

// Attach event listeners
searchInput.addEventListener("input", fetchMeals);
searchButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission
    fetchMeals();
});
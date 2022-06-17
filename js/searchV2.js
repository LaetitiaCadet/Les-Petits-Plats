async function getRecipes(){
    try {
        const response = await fetch('../data/recipes.json');
        const recipes = await response.json();
        console.log(recipes)
        return recipes

    } catch (err) {
        console.log(err)
    }
}


function searchRecipeByInput(){
    const dropdownToggle = document.querySelectorAll('.dropdown-toggle');
    const searchInput = document.querySelector('.input-search');
    const ingredientsList = document.querySelector('.ingredient-list');
    const applianceList = document.querySelector('.appliance-list');
    const ustensilsList = document.querySelector('.ustensil-list');
    let recipesList = document.getElementById('bloc-recipe');
}

async function displayRecipes(recipes) {
    const recipeTag = document.getElementById('bloc-recipe')
    recipes.forEach((recipe) => {
        const recipesModel = recipesFactory(recipe)
        const recipesDOM = recipesModel.showRecipes(recipe)
        recipeTag.innerHTML += recipesDOM
    });
};


async function init() {
    const recipes = await getRecipes()
    displayRecipes(recipes)
    searchRecipeByInput(recipes)
}
init();


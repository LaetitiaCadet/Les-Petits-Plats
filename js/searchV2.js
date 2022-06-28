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

async function dataRecipe() {
    const data = await getRecipes();
    const recipesData = data.recipes
    return recipesData
}

const dropdownToggle = document.querySelectorAll('.dropdown-toggle');
const searchInput = document.querySelector('.input-search');
const ingredientsList = document.querySelector('.ingredient-list');
const applianceList = document.querySelector('.appliance-list');
const ustensilsList = document.querySelector('.ustensil-list');
let recipesList = document.getElementById('bloc-recipe');

let isSearching = false; 
let remainingRecipes = [];
let tags = []

function displayResult(cardRecipes) {
    recipesList.innerHTML = "";
    for ( item of cardRecipes){
        const recipesModel = recipesFactory(item)
        const recipesDOM = recipesModel.showRecipes(item)
        recipesList.innerHTML += recipesDOM
    }
    if (recipesList.innerHTML == "") {
        recipesList.innerHTML = `<p class="no-found">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »</p>`
    }
}

function displayIngredients(recipes) {

    let ingredients = [];

    for( recipe of recipes){
        for (ingredient of recipe.ingredients){
            ingredients.push(ingredient.ingredient.toLowerCase())
        }
    }
    const filteredIngredients = Array.from(new Set(ingredients));
    // const ingredientsList = document.querySelector('.ingredient-list');
    ingredientsList.innerHTML = ``;

    for(item of filteredIngredients){
        ingredientsList.innerHTML += `<li class="col-4 bg-primary"><a class="dropdown-item" href="#">${item}</a></li> `
    }
}

function displayAppliances(recipes) {

    let appliances = [];

    for( recipe of recipes){
        appliances.push(recipe.appliance.toLowerCase())
    }
    const filteredAppliance = Array.from(new Set(appliances));
    // const appliancesList = document.querySelector('.appliance-list');
    applianceList.innerHTML = ``;

    for(item of filteredAppliance){
        applianceList.innerHTML += `<li class="col-4 bg-success"><a class="dropdown-item" href="#">${item}</a></li> `
    }
}

function displayUstensils(recipes) {

    let ustensils = [];

    for( recipe of recipes){
        for (ustensil of recipe.ustensils){
            console.log(ustensil)
            ustensils.push(ustensil.toLowerCase())
        }
    }
    const filteredUstensils = Array.from(new Set(ustensils));
    // const ustensilsList = document.querySelector('.ustensil-list');
    ustensilsList.innerHTML = ``;

    for(item of filteredUstensils){
        ustensilsList.innerHTML += `<li class="col-4 bg-danger"><a class="dropdown-item" href="#">${item}</a></li> `
    }
}



function searchRecipe(data){

     // j'affiche les resultat des filtre dans le dropdown des ingredients
    displayIngredients(data);
    displayAppliances(data);
    displayUstensils(data);


     function tagItems (items) {
        const tagList = document.getElementById("tags")

        items.onclick = function(e) {
            e.preventDefault()
            let item = e.target.textContent
            tags.push(item);
            console.log(tags)

            for (tag of tags){
                displayRecipeByTags(tag)
                isSearching = true
            }
            console.log(e.target)
            e.target.style.display = 'none'
            if (items == ingredientsList && item) {
                tagList.innerHTML += `<button class="tag-item btn btn-primary m-3">${item}
                                        <span class="delete-tag">
                                            <img src="./public/assets/icons/close-icon.png" alt="icon-close">
                                        </span>
                                      </button>`

            } else if (items == applianceList) {
                tagList.innerHTML += `<button class="tag-item btn btn-success m-3">${item}
                                        <span class="delete-tag">
                                            <img src="./public/assets/icons/close-icon.png" alt="icon-close">
                                        </span>
                                      </button>`
                e.target.style.display = 'none'
            } else if (items == ustensilsList) {
                tagList.innerHTML += `<button class="tag-item btn btn-danger m-3">${item}
                                        <span class="delete-tag">
                                        <img src="./public/assets/icons/close-icon.png" alt="icon-close">
                                        </span>
                                      </button`
                e.target.style.display = 'none'
            }            
        }
        
    }


    tagItems(ingredientsList)
    tagItems(applianceList)
    tagItems(ustensilsList)

    function displayRecipeByTags(tag){
        let recipes = [];
        let results = [];
        let itemsRecipes = [];
    
        console.log(data)
        console.log(tag)
    
        if(isSearching) {
            recipes = remainingRecipes;
        } else {
            recipes = itemsRecipes;
        }
    
        for(recipes of data){
            const foundRecipes = recipes.name.toLowerCase().includes(tag.toLowerCase());
            if (foundRecipes) {
                results.push(recipes)
            }
            const foundDescription = recipes.description.toLowerCase().includes(tag.toLowerCase());
            if(foundDescription){
                results.push(recipes)
            }
            console.log(recipes.ingredients)
            for (ingredient of recipes.ingredients){
                console.log(ingredient.ingredient)
                const itemsInIngredient = ingredient.ingredient.toLowerCase().includes(tag.toLowerCase());
    
              if (itemsInIngredient){
                  results.push(recipes)
              }
    
            }
        }
        remainingRecipes = results;
    
        function displayResult(cardRecipes) {
            recipesList.innerHTML = "";
            cardRecipes.forEach(item => {
                const recipesModel = recipesFactory(item)
                const recipesDOM = recipesModel.showRecipes(item)
                recipesList.innerHTML += recipesDOM              
            })
            if (recipesList.innerHTML == "") {
                recipesList.innerHTML = `<p class="no-found">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »</p>`
            }
            displayIngredients(results);
            displayAppliances(results);
            displayUstensils(results);
        }
        displayResult(results)
    }
    console.log(data)
    let result = []
    searchInput.onkeyup = function () {
         const searchInputValue = searchInput.value;
         
         if (searchInputValue.length < 2) {
             return 
         }
         result = []

         for(recipes of data){
            const foundRecipes = recipes.name.toLowerCase().includes(searchInputValue.toLowerCase());
            if (foundRecipes) {
                result.push(recipes)
            }
            const foundDescription = recipes.description.toLowerCase().includes(searchInputValue.toLowerCase());
            if(foundDescription){
                result.push(recipes)
            }
            console.log(recipes.ingredients)
            for (ingredient of recipes.ingredients){
                console.log(ingredient.ingredient)
                const itemsInIngredient = ingredient.ingredient.toLowerCase().includes(searchInputValue.toLowerCase());

              if (itemsInIngredient){
                  result.push(recipes)
              }

            }
        }

         
         if (searchInputValue.length >= 2) {
            recipesList.innerHTML = "";

            displayResult(Array.from(new Set (result)))
            displayIngredients(Array.from(new Set (result)))
            displayAppliances(Array.from(new Set (result)))
            displayUstensils(Array.from(new Set (result)))
        }

    }
    

}

async function displayRecipes(recipes) {
    const recipeTag = document.getElementById('bloc-recipe')
    for (recipe of recipes){
        const recipesModel = recipesFactory(recipe)
        const recipesDOM = recipesModel.showRecipes(recipe)
        recipeTag.innerHTML += recipesDOM
    }
}


async function init() {
    const recipes = await dataRecipe()
    displayRecipes(recipes)
    searchRecipe(recipes)
}
init();


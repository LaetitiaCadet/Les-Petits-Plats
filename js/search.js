async function getRecipes() {
    try {
        const response = await fetch("../data/recipes.json");
        const recipes = await response.json();

        return recipes;
    } catch (err) {
        console.log(err)
    }
}

async function dataRecipe() {
    const data = await getRecipes();
    const recipesData = data.recipes
    return recipesData
}

function searchRecipe(data) {
    let itemsRecipes = [];
    let itemsIngredients = [];
    let itemsAppliance = [];
    let itemsUstensils = [];

    for (const items of data) {
        itemsRecipes.push(items);
        itemsIngredients.push(items.ingredients)
        itemsAppliance.push(items.appliance)
        itemsUstensils.push(items.ustensils)
    } 

    const searchInput = document.querySelector('.input-search');
    const ingredientsList = document.querySelector('.ingredient-list');
    const applianceList = document.querySelector('.appliance-list');
    const ustensilsList = document.querySelector('.ustensil-list');
    let recipesList = document.getElementById('bloc-recipe');

    // j'affiche les resultat des filtre dans le dropdown des ingredients
    let arrayIngredient = []
    let arrayAppliance = []
    let arrayUstensiles = []
    ingredientsList.innerHTML = ""
    applianceList.innerHTML = ""
    ustensilsList.innerHTML = ""

    itemsIngredients.forEach(items => arrayIngredient.push(items.map(ingredient => ingredient.ingredient)))
    const ingredients = arrayIngredient.join(',').split(',')
    let resultIngredients = Array.from(new Set(ingredients));
    resultIngredients.forEach(item => {
        ingredientsList.innerHTML += `<li class="bg-primary"><a class="dropdown-item" href="#">${item}</a></li> `
    })

    itemsAppliance.forEach(items => arrayAppliance.push(items))
    let resultAppliance = new Set(arrayAppliance)
    resultAppliance.forEach(item => {
        applianceList.innerHTML += `<li class=""><a class="dropdown-item" href="#">${item}</a></li> `
    })

    itemsUstensils.forEach(items => items.map(newUstensil => arrayUstensiles.push(newUstensil.toLowerCase())).sort())
    let resultUstensils = Array.from(new Set(arrayUstensiles))
    resultUstensils.forEach(item => {
        ustensilsList.innerHTML += `<li class="bg-danger"><a class="dropdown-item" href="#">${item}</a></li> `
        
    })

    // recherche des recettes par nom, ingrédients et description avec la barre principale de la page.
    searchInput.onkeyup = function() {
        const searchInputValue = searchInput.value;

        if (searchInputValue.length < 2) {
            return
        }
        const foundRecipes = itemsRecipes.filter(item => item.name.toLowerCase().includes(searchInputValue.toLowerCase()));
        console.log(foundRecipes)
        const foundIngredients = itemsRecipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(searchInputValue.toLowerCase())));
        const foundDescription = itemsRecipes.filter(item => item.description.toLowerCase().includes(searchInputValue.toLowerCase()));

        if (searchInputValue.length >= 2) {
            recipesList.innerHTML = "";
            function displayResult (cardRecipes){
                recipesList.innerHTML = "";
                cardRecipes.forEach(item => {
                    const recipesModel = recipesFactory(item)
                    const recipesDOM = recipesModel.showRecipes(item)
                    if( cardRecipes == foundRecipes){
                        recipesList.innerHTML += recipesDOM
                    }else if (cardRecipes == foundIngredients){
                        recipesList.innerHTML += recipesDOM
                    }else if (cardRecipes == foundDescription){
                        recipesList.innerHTML += recipesDOM
                    }     
                })
                if (recipesList.innerHTML == ""){
                    recipesList.innerHTML = `<p class="no-found">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »</p>`
                }
            }
            displayResult(foundRecipes)
            displayResult(foundIngredients)
            displayResult(foundDescription)
        }

        let remainingIngredients = [],
        remainingAppliance = [],
        remainingUstensil = [];
        ingredientsList.innerHTML = ""
        ustensilsList.innerHTML = ""
        applianceList.innerHTML = ""

        foundRecipes.forEach(recipe =>{ 
            remainingIngredients.push(recipe.ingredients.map(ingredient => ingredient.ingredient));
            remainingAppliance.push(recipe.appliance);
            remainingUstensil.push(recipe.ustensils)    
        })
        let filterOptionIngredient = remainingIngredients.join(',').split(',');  
        let filterOptionAppliance = remainingAppliance.join(',').split(',');
        let filterOptionUstensils = remainingUstensil.join(',').split(',');

        function filterOption (arrayFilter){
            let foundItems = Array.from(new Set (arrayFilter));
            foundItems.forEach(item => {
                if (arrayFilter == filterOptionIngredient) {
                    ingredientsList.innerHTML += `<li><a class="dropdown-item" href="#">${item}</a></li> `
                } else if (arrayFilter == filterOptionAppliance){
                    applianceList.innerHTML += `<li><a class="dropdown-item" href="#">${item}</a></li> `
                } else if (arrayFilter == filterOptionUstensils){
                    ustensilsList.innerHTML += `<li><a class="dropdown-item" href="#">${item}</a></li> `
                }
                
            })
            let tagItem = function (items) {
                const tagList = document.getElementById("tags");
                const tags = document.querySelectorAll('.tag-item');
                items.onclick = function (e) {
                    console.log(items)
                    e.preventDefault()
                    let item = e.target.textContent
                    console.log(e.target.textContent)
                    if (items == ingredientsList && item ){
                        tagList.innerHTML += `<p class="tag-item btn btn-primary m-3">${item}</p>`
                        e.target.style.display = "none"
                    } else if ( items == applianceList) {
                        tagList.innerHTML += `<p class="tag-item btn btn-success m-3">${item}</p>`
                        e.target.style.display = "none"
                    } else if (items == ustensilsList){
                        tagList.innerHTML += `<p class="tag-item btn btn-danger m-3">${item}</p>`
                        e.target.style.display = "none" 
                    }

                }             
            }
            tagItem(ingredientsList)
            tagItem(applianceList)
            tagItem(ustensilsList)
        }

        filterOption(filterOptionIngredient)
        filterOption(filterOptionAppliance)
        filterOption(filterOptionUstensils)

    }


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
    const recipes = await dataRecipe()
    displayRecipes(recipes)
    searchRecipe(recipes)
}
init();
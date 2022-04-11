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

    let tagItem = function (items) {
        const tagList = document.getElementById("tags");
        const deleteTag = document.querySelectorAll('delete-tag');
        
            items.onclick = function (e) {
                e.preventDefault()
                let item = e.target.textContent
                console.log(e.target.textContent)
                if (items == ingredientsList){
                    tagList.innerHTML += `<p class="tag-item btn btn-primary m-3">${item} <span class="delete-tag"></span></p>` 
                } else if ( items == applianceList) {
                    tagList.innerHTML += `<p class="tag-item btn btn-success m-3">${item}</p>` 
                } else if (items == ustensilsList){
                    tagList.innerHTML += `<p class="tag-item btn btn-danger m-3">${item}</p>` 
                }
            }
            
    }
    tagItem(ingredientsList)
    tagItem(applianceList)
    tagItem(ustensilsList)


    // recherche des recettes par nom, ingrédients et description avec la barre principale de la page.
    searchInput.onkeyup = function() {
        const searchInputValue = searchInput.value;

        if (searchInputValue.length < 2) {
            return
        }

        const foundRecipes = itemsRecipes.filter(item => item.name.toLowerCase().includes(searchInputValue.toLowerCase()));
        const foundIngredients = itemsRecipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(searchInputValue.toLowerCase())));
        const foundDescription = itemsRecipes.filter(item => item.description.toLowerCase().includes(searchInputValue.toLowerCase()));

        if (searchInputValue.length >= 2) {
            recipesList.innerHTML = "";
            function displayResult (cardRecipes){
                cardRecipes.forEach(item => {
                    const recipesModel = recipesFactory(item)
                    const recipesDOM = recipesModel.showRecipes(item)
                    recipesList.innerHTML += recipesDOM
                })

                if (recipesList.innerHTML == ""){
                    recipesList.innerHTML = `<p class="no-found">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »</p>`
                }
            }
            displayResult(foundRecipes)
            // displayResult(foundIngredients)
            // displayResult(foundDescription)
        }

        let remainingIngredients = [],
        remainingAppliance = [],
        remainingUstensil = [];
        ingredientsList.innerHTML = ""
        ustensilsList.innerHTML = ""
        applianceList.innerHTML = ""

        foundRecipes.forEach(recipe => remainingIngredients.push(recipe.ingredients.map(ingredient => ingredient.ingredient)))
        let items = remainingIngredients.join(',').split(',');
        let foundItems = Array.from(new Set(items));
        console.log(foundItems);
        foundItems.forEach(item => {
                ingredientsList.innerHTML += `<li><a class="dropdown-item" href="#">${item}</a></li> `
            })

        foundRecipes.forEach(recipe => remainingAppliance.push(recipe.appliance))
        let itemsAppliance = remainingAppliance.join(',').split(',');
        let foundAppliance = Array.from(new Set(itemsAppliance));
        console.log(foundAppliance);
        foundAppliance.forEach(item => {
                applianceList.innerHTML += `<li><a class="dropdown-item" href="#">${item}</a></li> `
            })
        console.log(foundAppliance)

        foundRecipes.forEach(recipe => remainingUstensil.push(recipe.ustensils))
        let itemUstensils = remainingUstensil.join(',').split(',');
        let foundUstensils = Array.from(new Set (itemUstensils));
        foundUstensils.forEach(item => {
            ustensilsList.innerHTML += `<li><a class="dropdown-item" href="#">${item}</a></li> `
        })
        console.log(foundUstensils)


        tagItem(foundItems)

        // } else {
        //     console.log('Hello');
        //     resultIngredients.forEach(item => {
        //         ingredientsList.innerHTML += `<li><a class="dropdown-item" href="#">${item}</a></li> `

        //     })
        // }


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
        // displaySearchRecipes(recipes)
    searchRecipe(recipes)
        // searchRecipeAdvanced(recipes)
}
init();
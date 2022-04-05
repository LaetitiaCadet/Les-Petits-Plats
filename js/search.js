
async function getRecipes() {
    try { 
        const response = await fetch("../data/recipes.json");
        const recipes = await response.json();
        
        return recipes;
    } catch(err) {
        console.log(err)
    }
}

async function dataRecipe () {
    const data = await getRecipes();
    const recipesData = data.recipes
    return recipesData
}

function searchRecipe (data){
    let itemsRecipes = [];
    let itemsIngredients = [];
    let itemsAppliance = [];
    let itemsUstensils = [];

    for(const items of data){
        itemsRecipes.push(items);
        itemsIngredients.push(items.ingredients)
        itemsAppliance.push(items.appliance)
        itemsUstensils.push(items.ustensils)
    }

    const searchInput = document.querySelector('.input-search');
    const btnIngredient = document.getElementById('ingredients');
    const btnAppliance = document.getElementById('appliances');
    const btnUstensiles = document.getElementById('ustensils');
    const ingredientsList = document.querySelector('.ingredient-list');
    const applianceList = document.querySelector('.appliance-list');
    const ustensilsList = document.querySelector('.ustensil-list');
    let recipesList = document.getElementById('bloc-recipe');

    // j'affiche les resultat des filtre dans le dropdown des ingredients 
    let arrayIngredient = []
    ingredientsList.innerHTML = ""

    itemsIngredients.forEach(items => arrayIngredient.push(items[0].ingredient))
    let resultIngredients = Array.from(new Set(arrayIngredient))
    resultIngredients.forEach(item => {
        ingredientsList.innerHTML += `<li><a class="dropdown-item" href="#">`+ item +`</a></li> ` 

    })

        // recherche des recettes par nom, ingrédients et description avec la barre principale de la page. 
    searchInput.onkeyup = function (){
        const searchInputValue = searchInput.value;

        if (searchInputValue.length < 2) {
            return
        }
        const foundRecipes = itemsRecipes.filter(item => item.name.toLowerCase().includes(searchInputValue.toLowerCase()));

        const foundIngredients = itemsRecipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(searchInputValue.toLowerCase())));
        console.log(foundIngredients)

        const foundDescription = itemsRecipes.filter(item => item.description.toLowerCase().includes(searchInputValue.toLowerCase()));

        if(searchInputValue != ""){
            recipesList.innerHTML = ""
            foundRecipes.forEach(item => {
                const recipesModel = recipesFactory(item)
                const recipesDOM = recipesModel.showRecipes(item)
                recipesList.innerHTML += recipesDOM

            })
            foundIngredients.forEach(item => {
                const recipesModel = recipesFactory(item)
                const recipesDOM = recipesModel.showRecipes(item)
                recipesList.innerHTML += recipesDOM
                console.log(item)

                item.ingredients.forEach((ingredients) => {
                    resultIngredients.forEach((items) => { 
                        if (ingredients.ingredient == items) {
                            console.log(items)
                            ingredientsList.innerHTML = ""
                            ingredientsList.innerHTML += `<li><a class="dropdown-item" href="#">${items}</a></li> ` 
                        }
                    })
                })
            })
            foundDescription.forEach(item => {
                const recipesModel = recipesFactory(item)
                const recipesDOM = recipesModel.showRecipes(item)
                recipesList.innerHTML += recipesDOM
            })
        }
        

    }

    // btnIngredient.onclick = function (){
 

    //     ingredientsList.innerHTML = ""

    //     itemsIngredients.forEach(items => arrayIngredient.push(items[0].ingredient))
    //     console.log(arrayIngredient)
    //     let resultIngredients = Array.from(new Set(arrayIngredient))
    //     resultIngredients.forEach(item => {
    //         ingredientsList.innerHTML += `<li><a class="dropdown-item" href="#">`+ item +`</a></li> ` 
    //     })
    //     console.log(resultIngredients)

    // }

    btnAppliance.onclick = function (){
        let arrayAppliance = []

        applianceList.innerHTML = ""

        itemsAppliance.forEach(items => arrayAppliance.push(items))
        console.log(arrayAppliance)
        let resultAppliance = new Set(arrayAppliance)
        resultAppliance.forEach(item => {
            applianceList.innerHTML += `<li><a class="dropdown-item" href="#">`+ item +`</a></li> ` 
        })
        console.log(resultAppliance)
    }

    btnUstensiles.onclick = function (){
        let arrayUstensiles = []

        ustensilsList.innerHTML = ""

        itemsUstensils.forEach(items => items.map(newUstensil => arrayUstensiles.push(newUstensil.toLowerCase())).sort())
        console.log(arrayUstensiles)
        let resultUstensils = Array.from(new Set(arrayUstensiles))
        resultUstensils.forEach(item => {
            ustensilsList.innerHTML += `<li><a class="dropdown-item" href="#">`+ item +`</a></li> ` 
        })
        console.log(resultUstensils)
    }

}


// function searchRecipeAdvanced(data){
//     let itemsRecipes = [],
//         itemsIngredients = [],
//         itemsUstensils = [],
//         itemsAppliances = [];

//     for (const items of data){
//         itemsRecipes.push(items)
//         itemsIngredients.push(items.ingredients)
//         itemsUstensils.push(items.ustensils)
//         itemsAppliances.push(items.appliance)
//     }



//     const searchInputIngredient = document.getElementById('ingredients');
//     const ingredientsUl = document.querySelector('ingredients-list');
//     let arrayIngredient = []

//     itemsIngredients.forEach(items => arrayIngredient.push(items[0].ingredient))
//     let ingredientsTag = Array.from(new Set(arrayIngredient))
//     ingredientsUl.innerHTML += `<li><a class="dropdown-item" href="#">${ingredientsTag}</a></li> `
//     console.log(ingredientsTag)

//     searchInputIngredient.addEventListener('click', function(){
//         let value = searchInputIngredient.value



//         const ingredientsList = itemsIngredients.filter(item => item[0].ingredient);
//         console.log(ingredientsList)


//         const ustensilsList = itemsRecipes.filter(items => items.ustensils.map(ustensil => ustensil.toLowerCase().includes(value.toLowerCase())))
//         console.log(ustensilsList)
//     })

// }


async function displayRecipes(recipes){
    const recipeTag = document.getElementById('bloc-recipe')
        recipes.forEach((recipe) => {
         const recipesModel = recipesFactory(recipe)
         const recipesDOM = recipesModel.showRecipes(recipe)
         recipeTag.innerHTML += recipesDOM
     });

};


async function init (){
    const recipes = await dataRecipe()
    displayRecipes(recipes)
    // displaySearchRecipes(recipes)
    searchRecipe(recipes)
    // searchRecipeAdvanced(recipes)
}
init();
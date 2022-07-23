async function getRecipes(){
    try {
        const response = await fetch("./data/recipes.json");
        const recipes = await response.json();
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

function deleteTags(){
    let buttonTag = document.querySelectorAll('.tag-item');

    let deleteTag = document.querySelectorAll('.delete-tag'); 

    for (closeItem of deleteTag){
        closeItem.onclick = function (e){
            e.target.style.display = none
        }
    }
}
deleteTags()

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
           
            for (tag of tags){
                displayRecipeByTags(tag)
                isSearching = true
            }

            if (items == ingredientsList) {
                e.target.style.display = 'none'
                tagList.innerHTML += `<button class="tag-item btn btn-primary m-3">${item}
                                        <span class="delete-tag">
                                            <img src="./public/assets/icons/close-icon.png" alt="icon-close">
                                        </span>
                                      </button>`

            } else if (items == applianceList) {
                e.target.style.display = 'none'
                tagList.innerHTML += `<button class="tag-item btn btn-success m-3">${item}
                                        <span class="delete-tag">
                                            <img src="./public/assets/icons/close-icon.png" alt="icon-close">
                                        </span>
                                      </button>`
            } else if (items == ustensilsList) {
                e.target.style.display = 'none'
                tagList.innerHTML += `<button class="tag-item btn btn-danger m-3">${item}
                                        <span class="delete-tag">
                                        <img src="./public/assets/icons/close-icon.png" alt="icon-close">
                                        </span>
                                      </button`
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
            for (ingredient of recipes.ingredients){
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
    let result = []
    //recherche des recettes par barre input principale 
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

            for (ingredient of recipes.ingredients){
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
    
    //recherche des recettes par input dropdown
    for (dropdownInput of dropdownToggle){

        dropdownInput.onkeyup = function (e){
            let newApplianceList = []
            let newIngredientList = [];
            let newUstensilList = [];
            const searchValue = e.target.value;

            for(items of data ){
                newApplianceList.push(items.appliance.toLowerCase());

                for(ingredient of items.ingredients){
                    newIngredientList.push(ingredient.ingredient.toLowerCase())
                }

                for(ustensil of items.ustensils){
                    newUstensilList.push(ustensil.toLowerCase())
                } 
                    
            }

            const foundIngredients = Array.from(new Set (newIngredientList));
            const foundAppliances = Array.from(new Set (newApplianceList));
            const foundUstensils = Array.from(new Set (newUstensilList));

            let resultUstensil = [];
            let resultIngredient = [];
            let resultAppliance = []; 
            

            if (searchValue.length >= 2) {

                for(item of foundIngredients){
                    let filter = item.includes(searchValue.toLowerCase())
                    if (filter){
                        resultIngredient.push(item)
                    }         
                }

                if( e.target.classList.contains('btn-primary')){
                    ingredientsList.innerHTML = ""
                    for (items of resultIngredient){
                    ingredientsList.innerHTML += `<li class="col-4 bg-primary"><a class="dropdown-item" href="#">${items}</a></li> `
                    }                      
                }


                for (item of foundUstensils){
                    let filter = item.includes(searchValue.toLowerCase())
                    if (filter){
                        resultUstensil.push(item)
                    } 
                }

                if(e.target.classList.contains('btn-danger')){
                    ustensilsList.innerHTML = ""               
                    for (items of resultUstensil){
                    ustensilsList.innerHTML += `<li class="col-4 bg-danger"><a class="dropdown-item" href="#">${items}</a></li> ` 
                    }
                }
                
                for (item of foundAppliances){
                    let filter = item.includes(searchValue.toLowerCase())
                    if (filter){
                        resultAppliance.push(item)
                    } 
                }

                if(e.target.classList.contains('btn-success')){
                    applianceList.innerHTML = ""
                    for(items of resultAppliance){
                        applianceList.innerHTML += `<li class="col-4 bg-success"><a class="dropdown-item" href="#">${items}</a></li> `
                    }         
                }


            }

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


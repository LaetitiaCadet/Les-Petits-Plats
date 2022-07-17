async function getRecipes() {
    try {
        // const response = await fetch("../data/recipes.json");
        const response = await fetch ('data/recipes.json')
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

const dropdownToggle = document.querySelectorAll('.dropdown-toggle');
const searchInput = document.querySelector('.input-search');
const ingredientsList = document.querySelector('.ingredient-list');
const applianceList = document.querySelector('.appliance-list');
const ustensilsList = document.querySelector('.ustensil-list');
let recipesList = document.getElementById('bloc-recipe');
const tagList = document.getElementById("tags")

function displayIngredients(recipes) {

    let ingredients = [];

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            ingredients.push(ingredient.ingredient.toLowerCase());
        });
    })
    const filteredIngredients = Array.from(new Set(ingredients));
    const ingredientsList = document.querySelector('.ingredient-list');
    ingredientsList.innerHTML = ``;
    filteredIngredients.forEach(item => {
        ingredientsList.innerHTML += `<li class="col-4 bg-primary"><a class="dropdown-item" href="#">${item}</a></li> `
    })
}

function displayAppliances(recipes) {
    let searchbarTag = document.createElement('input');
    searchbarTag.setAttribute('type','text');
    searchbarTag.classList.add('show');
    let appliances = [];
    recipes.forEach(recipe => appliances.push(recipe.appliance.toLowerCase()));
    const filteredAppliance = Array.from(new Set(appliances));

    const applianceList = document.querySelector('.appliance-list');
    applianceList.innerHTML = ``;
    filteredAppliance.forEach(appliance => {
        applianceList.innerHTML += `<li class="bg-success"><a class="dropdown-item" href="#">${appliance}</a></li>`
    })
}

function displayUstensiles(recipes) {
    let ustensiles = [];
    recipes.forEach(recipe => recipe.ustensils.forEach(ustensile => ustensiles.push(ustensile.toLowerCase())));
    const filteredUstensiles = Array.from(new Set(ustensiles));

    const ustensilsList = document.querySelector('.ustensil-list');
    ustensilsList.innerHTML = ``;
    filteredUstensiles.forEach(ustensile => {
        ustensilsList.innerHTML += `<li class="bg-danger"><a class="dropdown-item" href="#">${ustensile}</a></li>`
    })
}

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
}
function deleteTag(){
    let btnTag = document.querySelectorAll('.tag-item');
    btnTag.forEach(btn => {
        btn.onclick = function (e){
            let item = e.target
            item.style.display = "none";
            tagList.removeChild(tagList.lastChild)
        }
    })
}
deleteTag()

function searchRecipe(data) {
    let itemsRecipes = [];
    let itemsIngredients = [];
    let itemsAppliance = [];
    let itemsUstensils = [];
    
    let isSearching = false; 
    let remainingRecipes = [];

    for (const items of data) {
        itemsRecipes.push(items);
        itemsIngredients.push(items.ingredients)
        itemsAppliance.push(items.appliance)
        itemsUstensils.push(items.ustensils)
    }

    displayIngredients(data);
    displayAppliances(data);
    displayUstensiles(data);

    let tags = []
    let tagItems = function(items) {

        items.onclick = function(e) {
            e.preventDefault()
            let item = e.target.textContent
            tags.push(item);
            console.log(tags)

            e.target.style.display='none'

            tags.forEach((tag) => {
                console.log(tag)
                displayRecipeByTags(tag)
                isSearching = true
            })

            if (items == ingredientsList && item) {
                tagList.innerHTML += `<button class="tag-item btn btn-primary m-3" onclick='deleteTag()'>${item}
                                        <span class="delete-tag">
                                            <img src="./public/assets/icons/close-icon.png" class="delete-tag-icon" alt="icon-close">
                                        </span>
                                      </button>`

            } else if (items == applianceList) {
                tagList.innerHTML += `<button class="tag-item btn btn-success m-3" onclick='deleteTag()'>${item}
                                        <span class="delete-tag">
                                            <img src="./public/assets/icons/close-icon.png" class="delete-tag-icon" alt="icon-close">
                                        </span>
                                      </button>`
                e.target.style.display = 'none'
            } else if (items == ustensilsList) {
                tagList.innerHTML += `<button class="tag-item btn btn-danger m-3" onclick='deleteTag()'>${item}
                                        <span class="delete-tag">
                                        <img src="./public/assets/icons/close-icon.png" class="delete-tag-icon" alt="icon-close">
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

        if(isSearching) {
            recipes = remainingRecipes;
        } else {
            recipes = itemsRecipes;
        }
        console.log(itemsRecipes)

        const foundRecipes = recipes.filter(item => item.name.toLowerCase().includes(tag.toLowerCase()));
        const foundIngredients = recipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(tag.toLowerCase())));
        const foundDescription = recipes.filter(item => item.description.toLowerCase().includes(tag.toLowerCase()));
        const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]
        remainingRecipes = results;


        displayIngredients(results);
        displayAppliances(results);
        displayUstensiles(results);
        
        displayResult(results)
            
    }

    dropdownToggle.forEach(dropdown => {
        dropdown.onkeyup = function (e){
            let newIngredientList = [];
            let newApplianceList = [];
            let newUstensilList = [];  
            
            data.forEach(thisData => {
                thisData.ingredients.forEach(ingredient => {
                    newIngredientList.push(ingredient.ingredient.toLowerCase())
                })
                thisData.ustensils.forEach(ustensil => newUstensilList.push(ustensil.toLowerCase()))
                newApplianceList.push(thisData.appliance.toLowerCase())
               
            })

            const ingredientsListToFilter = Array.from(new Set (newIngredientList))
            console.log(ingredientsListToFilter)

            const applianceListToFilter = Array.from(new Set (newApplianceList))
            console.log(applianceListToFilter)

            const ustensilsListToFilter = Array.from(new Set (newApplianceList))
            console.log(applianceListToFilter)


            const searchValue = e.target.value

            const foundIngredientsList =  ingredientsListToFilter.filter(item => item.includes(searchValue.toLowerCase()))
            const foundApplianceList = applianceListToFilter.filter(item => item.includes(searchValue.toLowerCase()))
            const foundUstensilList = ustensilsListToFilter.filter(item => item.includes(searchValue.toLowerCase()))


            if (searchValue.length >= 2) {
                if(e.target.classList.contains('btn-primary')){
                    ingredientsList.innerHTML = ""
                    foundIngredientsList.forEach(item => {
                        ingredientsList.innerHTML += `<li class="col-4 bg-primary"><a class="dropdown-item" href="#">${item}</a></li> `
                    })
                    
                }
                
                if(e.target.classList.contains('btn-success')){
                   applianceList.innerHTML = ""
                    foundApplianceList.forEach(item => {
                       applianceList.innerHTML += `<li class="col-4 bg-success"><a class="dropdown-item" href="#">${item}</a></li> `
                    })
                    
                }

                if(e.target.classList.contains('btn-danger')){
                    ustensilsList.innerHTML = ""
                     foundUstensilList.forEach(item => {
                        ustensilsList.innerHTML += `<li class="col-4 bg-danger"><a class="dropdown-item" href="#">${item}</a></li> `
                     })
                     
                 }
            } 
        }
    })

    // recherche des recettes par nom, ingrédients et description avec la barre principale de la page.
    searchInput.onkeyup = function() {
        const searchInputValue = searchInput.value;

        if (searchInputValue.length < 2) {
            return
        }
        const foundRecipes = data.filter(item => item.name.toLowerCase().includes(searchInputValue.toLowerCase()));
        const foundIngredients = data.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(searchInputValue.toLowerCase())));
        const foundDescription = data.filter(item => item.description.toLowerCase().includes(searchInputValue.toLowerCase()));
        const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]

        if (searchInputValue.length >= 2) {
            recipesList.innerHTML = "";

            displayResult(results)
            displayIngredients(results);
            displayAppliances(results);
            displayUstensiles(results);
        }
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
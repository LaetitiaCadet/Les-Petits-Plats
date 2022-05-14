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

function displaySearchBarTag(){
    let optionBtn = document.querySelectorAll(".dropdown-toggle")
    let searchbarTag = document.createElement('input');
    searchbarTag.setAttribute('type','text');
    searchbarTag.classList.add('searchbarTag', 'btn', 'btn-primary', 'dropdown-toggle');

    searchbarTag.onkeyup = function () {
        let searchbarTagValue = searchbarTag.value ; 
        console.log(value)

        


    }
    optionBtn.forEach(btn => {
        if(btn.style.display = "block"){
            searchbarTag.style.display = "none"
        }      
        btn.onclick = function (e) {
            console.log(e.currentTarget)
            e.target.parentElement.appendChild(searchbarTag)
            if (searchbarTag.style.display = "none") {
                searchbarTag.style.display = "block"
                searchbarTag.focus()
                btn.style.display = "none"       
            }
        }
    })
}
displaySearchBarTag()

function displayIngredients(recipes) {

    let ingredients = [];

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            ingredients.push(ingredient.ingredient);
        });
    })
    const filteredIngredients = Array.from(new Set(ingredients));
    const ingredientsList = document.querySelector('.ingredient-list');
    ingredientsList.innerHTML = ``;
    filteredIngredients.forEach(item => {
        ingredientsList.innerHTML += `<li class="bg-primary"><a class="dropdown-item" href="#">${item}</a></li> `
    })
}

function displayAppliances(recipes) {
    let searchbarTag = document.createElement('input');
    searchbarTag.setAttribute('type','text');
    searchbarTag.classList.add('show');
    let appliances = [];
    recipes.forEach(recipe => appliances.push(recipe.appliance));
    const filteredAppliance = Array.from(new Set(appliances));
    console.log(filteredAppliance);

    const applianceList = document.querySelector('.appliance-list');
    applianceList.innerHTML = ``;
    filteredAppliance.forEach(appliance => {
        applianceList.innerHTML += `<li class="bg-success"><a class="dropdown-item" href="#">${appliance}</a></li>`
    })
}

function displayUstensiles(recipes) {
    let ustensiles = [];
    recipes.forEach(recipe => recipe.ustensils.forEach(ustensile => ustensiles.push(ustensile)));
    const filteredUstensiles = Array.from(new Set(ustensiles));
    console.log(filteredUstensiles);

    const ustensilsList = document.querySelector('.ustensil-list');
    ustensilsList.innerHTML = ``;
    filteredUstensiles.forEach(ustensile => {
        ustensilsList.innerHTML += `<li class="bg-danger"><a class="dropdown-item" href="#">${ustensile}</a></li>`
    })
}

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

    const searchInput = document.querySelector('.input-search');
    const ingredientsList = document.querySelector('.ingredient-list');
    const applianceList = document.querySelector('.appliance-list');
    const ustensilsList = document.querySelector('.ustensil-list');
    let recipesList = document.getElementById('bloc-recipe');

    // j'affiche les resultat des filtre dans le dropdown des ingredients

    displayIngredients(data);
    displayAppliances(data);
    displayUstensiles(data);

    let tags = []

    let tagItem = function(items) {
        const tagList = document.getElementById("tags");

        items.onclick = function(e) {
            e.preventDefault()
            let item = e.target.textContent
            tags.push(item);
            tags.forEach((tag) => {
                displayRecipeByTags(tag)
                isSearching = true
            })
            if (items == ingredientsList && item) {
                tagList.innerHTML += `<p class="tag-item btn btn-primary m-3">${item}</p>`
                displayRecipeByTags(item)
                displaySearchBarTag()
                e.target.style.display = "none"
            } else if (items == applianceList) {
                tagList.innerHTML += `<p class="tag-item btn btn-success m-3">${item}</p>`
                displayRecipeByTags(item)
                displaySearchBarTag()
                e.target.style.display = "none"
            } else if (items == ustensilsList) {
                tagList.innerHTML += `<p class="tag-item btn btn-danger m-3">${item}</p>`
                displayRecipeByTags(item)
                displaySearchBarTag()
                e.target.style.display = "none"
            }

        }
        
    }

    tagItem(ingredientsList)
    tagItem(applianceList)
    tagItem(ustensilsList)

    function displayRecipeByTags(tag){
        let recipes = [];

        if(isSearching) {
            recipes = remainingRecipes;
        } else {
            recipes = itemsRecipes;
        }

        const foundRecipes = recipes.filter(item => item.name.toLowerCase().includes(tag.toLowerCase()));
        const foundIngredients = recipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(tag.toLowerCase())));
        const foundDescription = recipes.filter(item => item.description.toLowerCase().includes(tag.toLowerCase()));
        const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]
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
            displayUstensiles(results);
        }

        displayResult(results)
    }

    // recherche des recettes par nom, ingrédients et description avec la barre principale de la page.
    searchInput.onkeyup = function() {
        const searchInputValue = searchInput.value;

        if (searchInputValue.length < 2) {
            return
        }
        const foundRecipes = itemsRecipes.filter(item => item.name.toLowerCase().includes(searchInputValue.toLowerCase()));
        const foundIngredients = itemsRecipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(searchInputValue.toLowerCase())));
        const foundDescription = itemsRecipes.filter(item => item.description.toLowerCase().includes(searchInputValue.toLowerCase()));
        const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]

        if (searchInputValue.length >= 2) {
            recipesList.innerHTML = "";

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
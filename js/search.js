//fetch data

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
const arrowExpand = document.querySelectorAll('.expand');
const searchInput = document.querySelector('.input-search');
const ingredientsList = document.querySelector('.ingredient-list');
const applianceList = document.querySelector('.appliance-list');
const ustensilsList = document.querySelector('.ustensil-list');
let recipesList = document.getElementById('bloc-recipe');
const tagList = document.getElementById("tags");
let btnTag = document.querySelectorAll('.tag-item');
let tagSelected = [];


dropdownToggle.forEach(drop => {
    drop.addEventListener("click", function(e){
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.toggle('rotate')

    })
    drop.addEventListener("blur", function(e){
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.remove('rotate')

    })
})

//Affichage de la liste des option d'ingredients
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
//Affichage de la liste des option des appareils

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

//Affichage de la liste des option des ustensils
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

//componnent d'affichage des resultats des recette 
function displayResult(cardRecipes) {
    recipesList.innerHTML = "";
    cardRecipes.forEach(item => {
        const recipesModel = recipesFactory(item)
        const recipesDOM = recipesModel.showRecipes(item)
        recipesList.innerHTML += recipesDOM              
    })
    if (cardRecipes.innerHTML == "") {
        recipesList.innerHTML = `<p class="no-found">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »</p>`
    }
}

// Recherche de recette par search bar principal par tag et par searchbarTag 
function searchRecipe(data) {
    let itemsRecipes = [];
    let itemsIngredients = [];
    let itemsAppliance = [];
    let itemsUstensils = [];
    
    let isSearching = false; 
    let remainingRecipes = [];
    let newArrayRecipes = [];
    let lastRecipes ;


    for (const items of data) {
        itemsRecipes.push(items);
        itemsIngredients.push(items.ingredients)
        itemsAppliance.push(items.appliance)
        itemsUstensils.push(items.ustensils)
    }

    displayIngredients(data);
    displayAppliances(data);
    displayUstensiles(data);

     function reloadRecipesListByTag(value){
        // newArrayRecipes = []
        recipesList.innerHTML = ""
        itemsRecipes = data
        displayResult(value);
        displayIngredients(value);
        displayAppliances(value);
        displayUstensiles(value);

    }

    function displayRecipeByTags(tag){
        let recipes = [];

        if(isSearching) {
            recipes = remainingRecipes;
            newArrayRecipes.push(...recipes);
        } else {
            recipes = itemsRecipes;
        }

        console.log(recipes)
        console.log(newArrayRecipes)
   

        const foundRecipes = recipes.filter(item => item.name.toLowerCase().includes(tag.toLowerCase()));
        const foundIngredients = recipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(tag.toLowerCase())));
        const foundDescription = recipes.filter(item => item.description.toLowerCase().includes(tag.toLowerCase()));
        const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]
        remainingRecipes = results;


        displayIngredients(results);
        displayAppliances(results);
        displayUstensiles(results);
        
        displayResult(results)

        if (tagSelected.length  === 0) {
            reloadRecipesListByTag(data)
            isSearching = false
            console.log(isSearching)
        }
    }

    // function displayRecipeByTags(tag){ 
    //     reci
    //     console.log(itemsRecipes)
    //     newArrayRecipes = itemsRecipes
    //     if(isSearching) {
    //         itemsRecipes = remainingRecipes;
    //         console.log(remainingRecipes)
            
    //     } else if (tagSelected.length  === 0) {
    //             reloadRecipesListByTag(data)
    //             remainingRecipes = []
    //     }
    //     newArrayRecipes = itemsRecipes

    //     const foundRecipes = itemsRecipes.filter(item => item.name.toLowerCase().includes(tag.toLowerCase()));

    //     const foundIngredients = itemsRecipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(tag.toLowerCase())));
    //     const foundDescription = itemsRecipes.filter(item => item.description.toLowerCase().includes(tag.toLowerCase()));
    //     const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]
    //     remainingRecipes = results;          

    //     // console.log(remainingRecipes)

    //     displayIngredients(remainingRecipes);
    //     displayAppliances(remainingRecipes);
    //     displayUstensiles(remainingRecipes);
    //     displayResult(remainingRecipes)
    // }

    function tagItems (items) {

        items.addEventListener('click', function(e) {
            
            e.preventDefault()
            let item = e.target.textContent
            // tags.push(item);
            tagSelected.push(item)

            displayRecipeByTags(item)
            isSearching = true
            
                if (items == ingredientsList) {
                    displayTag(item)
                    tagList.lastChild.classList.add('btn-primary')
                } else if (items == applianceList) {
                    displayTag(item)
                    tagList.lastChild.classList.add('btn-success')
                } else if (items == ustensilsList) {
                    displayTag(item)
                    tagList.lastChild.classList.add('btn-danger')
                }

        })


    }

    tagItems(ingredientsList)
    tagItems(applianceList)
    tagItems(ustensilsList)

    function displayTag(value){
        let buttonTag = document.createElement('button');
        let spanIcon = document.createElement('span');
        let img = document.createElement('img');
        buttonTag.classList.add('tag-item','btn','m-3');
        spanIcon.classList.add('delete-tag');
        img.classList.add('delete-tag-icon');
        img.setAttribute('src', './public/assets/icons/close-icon.png')
    
        tagList.appendChild(buttonTag);
        buttonTag.textContent = value;
        buttonTag.appendChild(spanIcon);
        spanIcon.appendChild(img);

        buttonTag.addEventListener('click', function(e) {
            e.target.remove()
            tagSelected = tagSelected.filter(thistag =>  thistag != e.target.textContent)
            let arrayData = data; 
            let tagValue

            tagSelected.forEach(tag => tagValue = tag) 
            console.log(tagValue)
            UpdateRecipesByTags(tagValue, arrayData)

            if (tagValue == "" ){
                reloadRecipesListByTag(data)
            } 

        })
    }

    function UpdateRecipesByTags(value, recipes){  
        const newRecipes = [...new Set (newArrayRecipes)] 
        console.log(newRecipes)
        recipes = newRecipes;
        console.log(recipes)
        if (value){
            const foundRecipes = recipes.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
            const foundIngredients = recipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(value.toLowerCase())));
            const foundDescription = recipes.filter(item => item.description.toLowerCase().includes(value.toLowerCase()));
    
            const results = [...new Set([ ...foundIngredients, ...foundDescription, ...foundRecipes])]
    
            displayResult(results)
        }else{
            reloadRecipesListByTag(data)
        }


    }
    

    dropdownToggle.forEach(dropdown => {
        dropdown.addEventListener('keyup', function (e){
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

            const applianceListToFilter = Array.from(new Set (newApplianceList))

            const ustensilsListToFilter = Array.from(new Set (newApplianceList))

            const searchValue = e.target.value

            const foundIngredientsList = ingredientsListToFilter.filter(item => item.includes(searchValue.toLowerCase()))
            const foundApplianceList = applianceListToFilter.filter(item => item.includes(searchValue.toLowerCase()))
            const foundUstensilList = ustensilsListToFilter.filter(item => item.includes(searchValue.toLowerCase()))

            if (searchValue == "") {
                displayIngredients(data);
                displayAppliances(data);
                displayUstensiles(data);
            }

            if (searchValue.length > 2) {
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
        
        })
    })

    // recherche des recettes par nom, ingrédients et description avec la barre principale de la page.
    searchInput.addEventListener("keyup", function() {
        const searchInputValue = searchInput.value;

        if (searchInputValue.length < 2) {
            recipesList.innerHTML = "";
            displayRecipes(data)
        }
        const foundRecipes = data.filter(item => item.name.toLowerCase().includes(searchInputValue.toLowerCase()));
        const foundIngredients = data.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(searchInputValue.toLowerCase())));
        const foundDescription = data.filter(item => item.description.toLowerCase().includes(searchInputValue.toLowerCase()));
        const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]

        if (searchInputValue.length > 2) {
            recipesList.innerHTML = "";

            displayResult(results)
            displayIngredients(results);
            displayAppliances(results);
            displayUstensiles(results);
        }
    })
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
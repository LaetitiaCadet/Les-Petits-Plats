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
let tags = [];
let tagSelected = [];
let thisTag = [];

dropdownToggle.forEach(drop => {
    drop.addEventListener("click", function(e){
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.toggle('rotate')

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
    if (recipesList.innerHTML == "") {
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
    let remainingRecipesByTags = [];

    for (const items of data) {
        itemsRecipes.push(items);
        itemsIngredients.push(items.ingredients)
        itemsAppliance.push(items.appliance)
        itemsUstensils.push(items.ustensils)
    }

    displayIngredients(data);
    displayAppliances(data);
    displayUstensiles(data);

     function tagItems (items) {

        items.addEventListener('click',function(e) {
            
            e.preventDefault()
            let item = e.target.textContent
            tags.push(item);
            tagSelected.push(item)
            e.target.remove()
            e.target.style.display='none'

            tags.forEach((tag) => {
                displayRecipeByTags(tag)
                isSearching = true
            })

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
        buttonTag.textContent = value
        buttonTag.appendChild(spanIcon);
        spanIcon.appendChild(img);


        let thisVal = []
        thisVal.push(value)
    
        buttonTag.addEventListener('click', function(e) {
            console.log(tagSelected)
            console.log(tags)
            // console.log(thisVal);
            console.log(e.target.textContent)
            e.target.remove()
            // const filteredTags = tagSelected.filter(thistag =>  thistag != e.target.textContent)

            if (tagSelected.indexOf(e.target.textContent) > -1){
                tagSelected.pop(e.target.textContent)
                console.log(tagSelected)
                tagSelected.forEach(tag =>{
                    console.log(tag)
                    isSearching = true
                    displayRecipeByTags(tag)     
                })
            }
            console.log(tagSelected)


       
            if (tagSelected.length == 0 ){
                recipesList.innerHTML = "";
                tags = [];
                tagSelected = [];
                isSearching = false
                displayRecipes(data)
                displayIngredients(data);
                displayAppliances(data);
                displayUstensiles(data); 
            }

        })
    }

  


    function displayRecipeByTags(tag){
        let recipes = [];
        recipes = remainingRecipes;
        if(isSearching) {
            recipes = remainingRecipes;
        } else {
            recipes = itemsRecipes;
        }

        console.log(recipes)

        const foundRecipes = recipes.filter(item => item.name.toLowerCase().includes(tag.toLowerCase()));
        const foundIngredients = recipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(tag.toLowerCase())));
        const foundDescription = recipes.filter(item => item.description.toLowerCase().includes(tag.toLowerCase()));
        const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]
        remainingRecipes = results;

        console.log(remainingRecipes.length)
        console.log(results)


        displayIngredients(remainingRecipes);
        displayAppliances(remainingRecipes);
        displayUstensiles(remainingRecipes);
        
        displayResult(remainingRecipes)
            
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

            if (searchValue.length < 2) {
                displayIngredients(data);
                displayAppliances(data);
                displayUstensiles(data);
            }
        
        })
    })

    // recherche des recettes par nom, ingrédients et description avec la barre principale de la page.
    searchInput.addEventListener("keyup", function() {
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
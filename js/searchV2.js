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
const arrowExpand = document.querySelectorAll('.expand');
const searchInput = document.querySelector('.input-search');
const ingredientsList = document.querySelector('.ingredient-list');
const applianceList = document.querySelector('.appliance-list');
const ustensilsList = document.querySelector('.ustensil-list');
let recipesList = document.getElementById('bloc-recipe');
const tagList = document.getElementById("tags")
let isSearching = false; 
let remainingRecipes = [];
let tags = [];
let tagSelected = [];
let thisTag = [];

dropdownToggle.forEach(drop => {
    drop.addEventListener("click", function(e){
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.toggle('rotate')
    })

    drop.addEventListener('blur', function(e){
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.remove('rotate')
    })

})


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
    ustensilsList.innerHTML = ``;

    for(item of filteredUstensils){
        ustensilsList.innerHTML += `<li class="col-4 bg-danger"><a class="dropdown-item" href="#">${item}</a></li> `
    }
}

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

function searchRecipe(data){
    let itemsRecipes = [];
     // j'affiche les resultat des filtre dans le dropdown des ingredients
    displayIngredients(data);
    displayAppliances(data);
    displayUstensils(data);
    for (const items of data){
        itemsRecipes.push(items)
    }


     function tagItems (items) {

        items.addEventListener('click', function(e) {
            e.preventDefault()

            let item = e.target.textContent
            tags.push(item);
            console.log(tags)
            tagSelected.push(item);
           
            for (tag of tags){
                displayRecipeByTags(tag)
                isSearching = true
                console.log(tag)

            }

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
    
        buttonTag.addEventListener('click' , function(e){
            console.log(e.target.textContent);
            e.target.remove()
            tagSelected = tagSelected.filter(item => item != e.target.textContent);
            console.log(tagSelected)

            for( let item of tagSelected){
                console.log(item)
                isSearching = true
                displayRecipeByTags(item)
            }

            if (tagSelected.length == 0){
                recipesList.innerHTML = "";
                tags = [];
                tagSelected = [];
                isSearching = false
                displayRecipes(data)
                displayIngredients(data);
                displayAppliances(data);
                displayUstensils(data); 
            }

        })
    }

    function displayRecipeByTags(tag){
        let recipes = [];

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

        displayIngredients(remainingRecipes);
        displayAppliances(remainingRecipes);
        displayUstensils(remainingRecipes);
        
        displayResult(remainingRecipes)
    }


    let result = []
    //recherche des recettes par barre input principale 
    searchInput.onkeyup = function () {
         const searchInputValue = searchInput.value;
         
         if (searchInputValue.length < 3) {
             recipesList.innerHTML = "";
             displayRecipes(data) 
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


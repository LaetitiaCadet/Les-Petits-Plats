const getRecipes = async () => {
    try {
        const response = await fetch("./data/recipes.json");
        const recipes = await response.json();
        return recipes

    } catch (err) {
        console.log(err)
    }
}

const dataRecipe = async () => {
    const data = await getRecipes();
    const recipesData = data.recipes
    return recipesData
}

//Constante DOM
const dropdownToggle = document.querySelectorAll('.dropdown-toggle');
const arrowExpand = document.querySelectorAll('.expand');
const dropdownMenu = document.querySelectorAll('.dropdown-menu');
const searchInput = document.querySelector('.input-search');
const ingredientsList = document.querySelector('.ingredient-list');
const applianceList = document.querySelector('.appliance-list');
const ustensilsList = document.querySelector('.ustensil-list');
let recipesList = document.getElementById('bloc-recipe');
const tagList = document.getElementById("tags")

//Variables
let itemsRecipes = []
let remainingRecipes = [];
let tagSelected = [];

//Initialisation des données dans les variables de travail
const setDataSearch = (data) => {
    for (const items of data){
        itemsRecipes.push(items)
    }
    reloadRemainingRecipes()
}

//Affichage de la liste des options par ingredients, appareils et ustensils.
const displayOption = (recipes, optionCategorie) => {
     let ingredients = []
     let appliances = []
     let ustensils = []

     for (recipe of recipes){
        for ( ingredient of recipe.ingredients){
            ingredients.push(ingredient.ingredient.toLowerCase())
        }
        for ( ustensil of recipe.ustensils){
            ustensils.push(ustensil.toLowerCase())
        }
        appliances.push(recipe.appliance.toLowerCase())
     }

     const filteredIngredients = Array.from(new Set(ingredients));
     const filteredAppliance = Array.from(new Set(appliances));
     const filteredUstensils = Array.from(new Set(ustensils));

     switch (optionCategorie) {
        case "ingredient":
            ingredientsList.innerHTML = ``;
            for(item of filteredIngredients){
                ingredientsList.innerHTML += `<li class="col-4 bg-primary"><a class="dropdown-item ingredient-item" href="#">${item}</a></li> `
            }
        break;
        case "appliance":
            applianceList.innerHTML = ``;
            for(item of filteredAppliance){
                applianceList.innerHTML += `<li class="col-4 bg-success"><a class="dropdown-item appliance-item" href="#">${item}</a></li> `
            }
        break;
        case "ustensils":
            ustensilsList.innerHTML = ``;
            for(item of filteredUstensils){
                ustensilsList.innerHTML += `<li class="col-4 bg-danger"><a class="dropdown-item ustensils-item" href="#">${item}</a></li> `
            }
        break;
     }
}

//Componnent d'affichage des resultats des recettes.
const displayRecipes = (cardRecipes) => {
    recipesList.innerHTML = "";
    for ( item of cardRecipes){
        const recipesModel = recipesFactory(item)
        const recipesDOM = recipesModel.showRecipes(item)
        recipesList.innerHTML += recipesDOM
    }

    displayOption(cardRecipes, 'ingredient')
    displayOption(cardRecipes, 'appliance')
    displayOption(cardRecipes, 'ustensils')

    if (recipesList.innerHTML == "") {
        recipesList.innerHTML = `<p class="no-found">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »</p>`
    }
}

//Mise à jour de la liste des recettes si il n'y a plus de valeur disponible.
const reloadRecipesList = () => {  
    if(tagList.children.length == 0 && searchInput.value == ""){
        console.log("reload")
        recipesList.innerHTML = ""
        reloadRemainingRecipes()
    }
    displayRecipes(remainingRecipes);
}

// Au clic sur une valeur d'une option , lance la function de création d'un tag et lance la function d'affichage de celle ci 
for ( items of dropdownMenu){
    items.addEventListener('click', (e) => {
        e.preventDefault()

        let item = e.target.textContent
        tagSelected.push(item);

        createTag(item) 

        if (e.target.classList.contains('ingredient-item')) {
            tagList.lastChild.classList.add('btn-primary')

        } else if (e.target.classList.contains('appliance-item')) {
            tagList.lastChild.classList.add('btn-success')

        } else if (e.target.classList.contains('ustensils-item')) {
            tagList.lastChild.classList.add('btn-danger')
        }

        displayRecipeByTags(item)
    })
}

//Création d'un tag après avoir cliquer sur un item de la liste des options.
const createTag = (value) => {
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
    
    deleteTag()

}

//Fonction de suppression d'un tag au clic.
const deleteTag = () => {
    let buttonTag = document.querySelectorAll('.tag-item')
    let button ; 
    for ( let item of buttonTag){
        button = item
    }
    button.addEventListener('click', (e) =>{
        e.target.remove()
        reloadRemainingRecipes()
        tagSelected = tagSelected.filter(item => item != e.target.textContent);

        for( let tag of tagSelected){
            updateRecipes(tag)
        }
        updateRecipes(searchInput.value)
        reloadRecipesList()          
    })


}

//mise à jour de la liste des recettes après avoir supprimer un tag ou une valeur de la barre principale de la page. 
const updateRecipes = (value) => {
    value = value.toLowerCase()
    let result = []

    for (recipes of remainingRecipes){
        const foundRecipes = recipes.name.toLowerCase().includes(value);
        if (foundRecipes) {
            result.push(recipes)
        }
        const foundDescription = recipes.description.toLowerCase().includes(value);
        if (foundDescription) {
            result.push(recipes)
        }

        const foundAppliance = recipes.appliance.toLowerCase().includes(value);
        if (foundAppliance) {
            result.push(recipes)
        }

        for (ustensil of recipes.ustensils){
            const foundUstensils = ustensil.toLowerCase().includes(value)
            if (foundUstensils){
                result.push(recipes)
            }
        }

        for (ingredient of recipes.ingredients){
            const foundIngredients = ingredient.ingredient.toLowerCase().includes(value);

          if (foundIngredients){
              result.push(recipes)
          }

        }
    }

    remainingRecipes = Array.from(new Set(result));
    
}

// filtrage des recettes par ingrédients , appareils et ustensil au click sur une valeur des filtres d'option.
const displayRecipeByTags = (tag) => {
    let value = tag.toLowerCase()
    let result = []

    for (recipes of remainingRecipes){
        const foundAppliance = recipes.appliance.toLowerCase().includes(value);
        if (foundAppliance) {
            result.push(recipes)
        }

        for (ustensil of recipes.ustensils){
            const foundUstensils = ustensil.toLowerCase().includes(value)
            if (foundUstensils){
                result.push(recipes)
            }
        }

        for (ingredient of recipes.ingredients){
            const foundIngredients = ingredient.ingredient.toLowerCase().includes(value);

          if (foundIngredients){
              result.push(recipes)
          }

        }
    }

    remainingRecipes = Array.from(new Set(result));
    
    displayRecipes(remainingRecipes)
}

// filtrage des recettes par nom, ingrédients et description avec la barre principale de la page.
searchInput.addEventListener("keyup", (e) => {
     const value = e.target.value.toLowerCase();
     
     result = []

     for(recipes of remainingRecipes){
        const foundRecipes = recipes.name.toLowerCase().includes(value);
        if (foundRecipes) {
            result.push(recipes)
        }
        const foundDescription = recipes.description.toLowerCase().includes(value);
        if(foundDescription){
            result.push(recipes)
        }

        for (ingredient of recipes.ingredients){
            const foundIngredients = ingredient.ingredient.toLowerCase().includes(value);

          if (foundIngredients){
              result.push(recipes)
          }

        }

    }

    remainingRecipes = Array.from(new Set(result))

     if (value.length >= 3) {
        displayRecipes(remainingRecipes)

    } else {
        reloadRemainingRecipes()
        for( let tag of tagSelected){
            updateRecipes(tag)
        }
    }

    reloadRecipesList()

})

//recherche des ingredients, appareils et ustensils avec la barre de recherche des filtre d'option.
for (dropdownInput of dropdownToggle){

    dropdownInput.addEventListener("click", (e) =>{
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.toggle('rotate')
    })

    dropdownInput.addEventListener('blur', (e) => {
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.remove('rotate')
    })

    dropdownInput.addEventListener("keyup",(e) => {
        let newApplianceList = []
        let newIngredientList = [];
        let newUstensilList = [];
        const value = e.target.value;

        for(items of remainingRecipes ){
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

        if (value == "") {
            displayOption(remainingRecipes, "ingredient");
            displayOption(remainingRecipes, "appliance");
            displayOption(remainingRecipes, "ustensils");
        }
        

        if (value.length > 2) {

            for(item of foundIngredients){
                let filter = item.includes(value.toLowerCase()) 
                if (filter){
                    resultIngredient.push(item)
                }         
            }

            if( e.target.classList.contains('btn-primary')){
                ingredientsList.innerHTML = ""
                for (items of resultIngredient){
                ingredientsList.innerHTML += `<li class="col-4 bg-primary"><a class="dropdown-item ingredient-item" href="#">${items}</a></li> `
                }                      
            }


            for (item of foundUstensils){
                let filter = item.includes(value.toLowerCase())
                if (filter){
                    resultUstensil.push(item)
                } 
            }


            if(e.target.classList.contains('btn-danger')){
                ustensilsList.innerHTML = ""               
                for (items of resultUstensil){
                    console.log(items)
                ustensilsList.innerHTML += `<li class="col-4 bg-danger"><a class="dropdown-item appliance-item" href="#">${items}</a></li> ` 
                }
            }
            
            for (item of foundAppliances){
                let filter = item.includes(value.toLowerCase())
                if (filter){
                    resultAppliance.push(item)
                } 
            }

            if(e.target.classList.contains('btn-success')){
                applianceList.innerHTML = ""
                for(items of resultAppliance){
                    applianceList.innerHTML += `<li class="col-4 bg-success"><a class="dropdown-item ustensils-item" href="#">${items}</a></li> `
                }         
            }


        }

    })
}

//remise à jour de
const reloadRemainingRecipes = () => {
    remainingRecipes = itemsRecipes
}


const init = async () => {
    const recipes = await dataRecipe()
    displayRecipes(recipes)
    setDataSearch(recipes)
}
init();



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
    console.log(data) 
    const recipesData = data.recipes
    return recipesData
}

function searchRecipe (data){
    let itemsName = []; 
    let itemsIngredients;
    let itemsDescription;

    for(const items of data){
        itemsName.push(items.name)
        itemsIngredients = items.ingredients
        itemsDescription = items.description
        console.log(itemsName)
    }

    const searchInput = document.querySelector('.input-search');
    let recipesList = document.getElementById('bloc-recipe');

    searchInput.onkeyup = function () {
        const searchInputValue = searchInput.value;
        
        const searchByTitle = itemsName.filter(item => item.toLowerCase().includes(searchInputValue.toLowerCase()));
        console.log(searchByTitle)
        const searchByIngredients = itemsIngredients.filter(item => item.toLowerCase().includes(searchInputValue.toLowerCase())); 
        const searchByDescription = itemsDescription.filter(item => item.toLowerCase().includes(searchInputValue.toLowerCase())); 
        let suggestions = ''; 

        if(searchInputValue != ""){
            searchByTitle.forEach(nameItem => {
                recipesList.innerHTML = `
                <div class="card mb-5" aria-hidden="true">
                    <img src="../../public/assets/image-recette.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title placeholder-glow d-flex justify-content-between">
                            <span class="col-10">${nameItem}</span>
                            <span class="d-flex align-items-center"><i class="card-icon-time mx-2"></i>${time}</span>
                        </h5>
                        <div class="d-flex justify-content-between">
                            <ul class="ingredients-list" id="ingredients-list">
                            ${ingredientTag}
                            </ul>
                            <span class="col-6 card-description">${description}</span>
                        </div>
                    </div>
                </div>
                ` 
            })
        }
        
        document.getElementById('search-suggestion').innerHTML = `${suggestions}` 

    }


}



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
    searchRecipe(recipes)
}
init();

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
    // console.log(data) 
    const recipesData = data.recipes
    return recipesData
}

function searchRecipe (data){
    let itemsRecipes = [];

    for(const items of data){
        itemsRecipes.push(items);
    }

    const searchInput = document.querySelector('.input-search');
    let recipesList = document.getElementById('bloc-recipe');

    searchInput.onkeyup = function () {
        const searchInputValue = searchInput.value;

        if (searchInputValue.length < 2) {
            return
        }

        const foundRecipes = itemsRecipes.filter(item => item.name.toLowerCase().includes(searchInputValue.toLowerCase()));
        // console.log(foundRecipes)
        // const searchByIngredients = itemsRecipes.filter(item => item.ingredients[0].toLowerCase().includes(searchInputValue.toLowerCase()));
        const searchByIngredients = itemsRecipes.filter(item => item.ingredients.toString().toLowerCase().includes(searchInputValue.toLowerCase()));
        console.log(searchByIngredients)

        const descriptionList = itemsRecipes.filter(item => item.description.toLowerCase().includes(searchInputValue.toLowerCase()));
        // console.log(descriptionList)
        let suggestions = ''; 

        if(searchInputValue != ""){
            recipesList.innerHTML = ""
            foundRecipes.forEach(item => {
                const recipesModel = recipesFactory(item)
                const recipesDOM = recipesModel.showRecipes(item)
                recipesList.innerHTML += recipesDOM
            })
            // descriptionList.forEach(item => {
            //     const recipesModel = recipesFactory(item)
            //     const recipesDOM = recipesModel.showRecipes(item)
            //     recipesList.innerHTML += recipesDOM
            // })
        }
        
        document.getElementById('search-suggestion').innerHTML = `${suggestions}` 

    }


}

// async function displaySearchRecipes(recipes){
//     const recipeTag = document.getElementById('bloc-recipe')
//         recipes.forEach((recipe) => {
//          const recipesModel = recipesFactory(recipe)
//          const recipesDOM = recipesModel.search(recipe)
//          recipeTag.innerHTML += recipesDOM
//      });

// };

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
}
init();

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
}
init();
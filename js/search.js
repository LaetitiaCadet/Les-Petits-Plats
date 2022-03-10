
async function getRecipes() {
    try { 
        const response = await fetch("../data/recipes.json");
        console.log(response)
        const recipes = await response.json();
        
        console.log(recipes)
        return recipes;
    } catch(err) {
        console.log(err)
    }
}

async function dataRecipe () {
    const data = await getRecipes(); 
    const recipesData = data.recipes
    console.log(recipesData)
    return recipesData
}

async function dataIngredients (){
    const data = await dataRecipe();
    const ingredientsList = document.querySelectorAll('.ingredients-list')
    let ingredients = [];
    let itemsIngredients = []
    
    for(items in data){
        console.log(data[items].ingredients)
        ingredients.push(data[items].ingredients)
    }

    for(items in ingredients){
        ingredients[items].ingredient
        console.log(ingredients[items])
        itemsIngredients.push(ingredients[items])
    }


    console.log(ingredients)
    
    ingredientsList.innerHTML = `
        <li>${itemsIngredients[ingredient]}</li>
        <li>${itemsIngredients}</li>
        <li>${itemsIngredients}</li>
    `
    console.log(ingredientsList)
    return ingredientsList

    

}
dataIngredients()

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
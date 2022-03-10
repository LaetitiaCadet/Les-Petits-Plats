function recipesFactory (data) {
    const { id, name, servings, ingredients, ingredient, time, description, appliance, ustensils } = data

    function showRecipes(recipe) {
        const recipesFactory = CardsFactory.render(recipe)
        return recipesFactory
    }

    return {
        id, name, servings, ingredients, ingredient, time, description, appliance, ustensils,
        showRecipes
    }
}

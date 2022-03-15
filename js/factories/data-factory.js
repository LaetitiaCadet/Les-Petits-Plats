// class Data {
//     constructor(id, name, servings, ingredients, ingredient, time, description, appliance, ustensils){
//         this.id = id;
//         this.name = name; 
//         this.servings = servings;
//           this.time = time;
//         this.description = description;
//         this.appliance = appliance;
//         this.ustensils = ustensils;
//     }

//     showRecipes() {
//        return `
//         <div class="card mb-5" aria-hidden="true">
//             <img src="../../public/assets/image-recette.jpg" class="card-img-top" alt="...">
//             <div class="card-body">
//                 <h5 class="card-title placeholder-glow d-flex justify-content-between">
//                     <span class="col-10">${this.name}</span>
//                     <span class="d-flex align-items-center"><i class="card-icon-time mx-2"></i>${this.time}</span>   
//                 </h5>
//                 <p class="card-text placeholder-glow d-flex">
//                     <span class="col-6">
//                     <ul class="ingredients-list">y
//                     <li>${this.ingredient}</li>
//                     </ul>
//                     </span>
//                     <span class="col-6 card-description">${this.description}</span>
//                 </p>
//             </div>
//         </div> 
//         `
//     }
// }      this.ingredients = ingredients;
//         this.ingredient = ingredient;


function recipesFactory (data) {
    const { id, name, servings, ingredients, time, description, appliance, ustensils } = data

    function showRecipes() {
        console.log(ingredients)
        let ingredientItem
        let quantityItem
        let unitItem
        let ingredientString = [];

        for(const items in ingredients){
            console.log(ingredients[items])
            ingredientItem = ingredients[items]
            quantityItem = ingredients[items].quantity
            unitItem = ingredients[items].unit
            
            for ( const ingredient in ingredientItem ){
                console.log(ingredient)
                ingredientString.push(ingredient)
            }
        }

        return `
        <div class="card mb-5" aria-hidden="true">
            <img src="../../public/assets/image-recette.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title placeholder-glow d-flex justify-content-between">
                    <span class="col-10">${name}</span>
                    <span class="d-flex align-items-center"><i class="card-icon-time mx-2"></i>${time}</span>   
                </h5>
                <p class="card-text placeholder-glow d-flex">
                    <span class="col-6">
                        <ul class="ingredients-list">
                            <li>Ingredients: ${ingredientString.map(ing => ing.ingredient)}</li>
                            <li>${quantityItem}`+` ${unitItem}</li>
                        </ul>
                    </span>
                    <span class="col-6 card-description">${description}</span>
                </p>
            </div>
        </div> 
        `                
    }

    return {
        id, name, servings, ingredients, time, description, appliance, ustensils,
        showRecipes
    }
}

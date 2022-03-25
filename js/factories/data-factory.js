
function recipesFactory (data) {
    const { id, name, servings, ingredients, time, description, appliance, ustensils } = data

    function showRecipes() {
        let ingredientItem
        let quantityItem
        let unitItem
        let ingredientTag = ``
        for (const item of ingredients ){
            ingredientItem = item
            quantityItem = item.quantity
            unitItem = item.unit
            ingredientTag += `<li><strong>${item.ingredient ?? ''}:</strong> ${item.quantity ?? ''} ${item.unit ?? ''}</li>`
        }
        return `
        <div class="card mb-5" id="card-recipe-${id}" aria-hidden="true">
            <img src="../../public/assets/image-recette.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title placeholder-glow d-flex justify-content-between">
                    <span class="col-10">${name}</span>
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
    }

    // function search () {
    //     let recipes = [];
    //     const searchInput = document.querySelector('.input-search');
    //     let recipesList = document.getElementById('bloc-recipe');

    //     recipes.push(data)
    //     console.log(recipes)

    //     let itemsName = []; 
    //     let itemsIngredients;
    //     let itemsDescription;
    //     let itemsRecipes = [];
    
    //     for(const items of recipes){
    //         itemsRecipes.push(items);
    //         console.log(items)
    //         itemsName.push(items.name)
    //         itemsIngredients = items.ingredients
    //         itemsDescription = items.description
    
    //     }
    
    //     searchInput.onkeyup = function () {
    //         const searchInputValue = searchInput.value;
    //         const search = itemsRecipes.filter(item => {
    //             item.toString().toLowerCase().includes(searchInputValue.toString().toLowerCase())
    //         });
    
    //         const searchByTitle = itemsName.filter(item => item.toString().toLowerCase().includes(searchInputValue.toString().toLowerCase()));
    //         console.log(searchByTitle)
    //         // const searchByIngredients = itemsIngredients.filter(item => item.toLowerCase().includes(searchInputValue.toLowerCase())); 
    //         // const searchByDescription = itemsDescription.filter(item => item.toLowerCase().includes(searchInputValue.toLowerCase())); 
    //         let suggestions = ''; 
    
    //         if(searchInputValue != ""){
    //             search.forEach(item => {
    //                 recipesList.innerHTML = `
    //                 <div class="card mb-5" aria-hidden="true">
    //                     <img src="../../public/assets/image-recette.jpg" class="card-img-top" alt="...">
    //                     <div class="card-body">
    //                         <h5 class="card-title placeholder-glow d-flex justify-content-between">
    //                             <span class="col-10">${item.name}</span>
    //                             <span class="d-flex align-items-center"><i class="card-icon-time mx-2"></i>${item.time}</span>
    //                         </h5>
    //                         <div class="d-flex justify-content-between">
    //                             <ul class="ingredients-list" id="ingredients-list">
    //                             ${item.ingredients}
    //                             </ul>
    //                             <span class="col-6 card-description">${item.description}</span>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 ` 
    //             })
    //         }
            
    //         document.getElementById('search-suggestion').innerHTML = `${suggestions}` 
    
    //     }
    // }

    // function search (){
    //     let itemsName = [];
    //     let itemsId =[];
    //     let itemsIngredients;
    //     let itemsDescription;
    //     let itemsRecipes = [];
    
    //     for(const items of ){
    //         itemsRecipes.push(items);
    //         console.log(items.id)
    //         itemsId.push(items.id)
    //         itemsName.push(items.name)
    //         itemsIngredients = items.ingredients
    //         itemsDescription = items.description
    
    //     }
    
    //     const searchInput = document.querySelector('.input-search');
    //     let recipesList = document.getElementById('bloc-recipe');
    
    //     searchInput.onkeyup = function () {
    //         const searchInputValue = searchInput.value;
    //         // const search = itemsRecipes.filter(item => {
    //         //     item.toString().toLowerCase().includes(searchInputValue.toString().toLowerCase())
    //         //     item.name.toString().toLowerCase().includes(searchInputValue.toString().toLowerCase())
    //         // });
    //         const searchByTitle = name.filter(item => item.toString().toLowerCase().includes(searchInputValue.toString().toLowerCase()));
    //         console.log(searchByTitle)
    //         // const searchByIngredients = itemsIngredients.filter(item => item.toLowerCase().includes(searchInputValue.toLowerCase())); 
    //         // const searchByDescription = itemsDescription.filter(item => item.toLowerCase().includes(searchInputValue.toLowerCase())); 
    //         let suggestions = ''; 
    
    //         if(searchInputValue != ""){
    //             searchByTitle.forEach(item => 
    //                 recipesList.innerHTML = `
    //                 <div class="card mb-5" aria-hidden="true">
    //                     <img src="../../public/assets/image-recette.jpg" class="card-img-top" alt="...">
    //                     <div class="card-body">
    //                         <h5 class="card-title placeholder-glow d-flex justify-content-between">
    //                             <span class="col-10">${item.name}</span>
    //                             <span class="d-flex align-items-center"><i class="card-icon-time mx-2"></i>${item.time}</span>
    //                         </h5>
    //                         <div class="d-flex justify-content-between">
    //                             <ul class="ingredients-list" id="ingredients-list">
    //                             ${item.ingredients}
    //                             </ul>
    //                             <span class="col-6 card-description">${item.description}</span>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 ` 
    //                 )
    //         }
            
    //         document.getElementById('search-suggestion').innerHTML = `${suggestions}` 
    
    //     }
    
    
    // }

    return {
        id, name, servings, ingredients, time, description, appliance, ustensils,
        showRecipes,
    }
}

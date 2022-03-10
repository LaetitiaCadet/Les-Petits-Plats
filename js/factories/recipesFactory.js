class CardsFactory {
    static render (recipes,){
        return `
        <div class="card mb-5" aria-hidden="true">
        <img src="../../public/assets/image-recette.jpg" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title placeholder-glow d-flex justify-content-between">
                <span class="col-10">${recipes.name}</span>
                <span class="d-flex align-items-center"><i class="card-icon-time mx-2"></i>${recipes.time}</span>   
            </h5>
            <p class="card-text placeholder-glow d-flex">
                <span class="col-6">
                    <ul class="ingredients-list">
                    </ul>
                </span>
                <span class="col-6 card-description">${recipes.description}</span>
            </p>
        </div>
    </div> 
        `
    }
}

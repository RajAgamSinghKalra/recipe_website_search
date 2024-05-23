document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('open-modal');
    const modal = document.getElementById('recipe-modal');
    const closeModalBtn = modal.querySelector('.close');
    const saveRecipeBtn = document.getElementById('save-recipe');
    const recipeTitleInput = document.getElementById('recipe-title');
    const recipeDetailsInput = document.getElementById('recipe-details');
    const recipeImageInput = document.getElementById('recipe-image');
    const ingredientsList = document.getElementById('ingredients-list');
    const newIngredientInput = document.getElementById('new-ingredient');
    const addIngredientBtn = document.getElementById('add-ingredient');
    const recipeList = document.getElementById('recipe-list');
    const noRecipesMessage = document.getElementById('no-recipes-message');
    const searchBar = document.getElementById('search-bar');

    const detailsModal = document.getElementById('recipe-details-modal');
    const detailsCloseBtn = detailsModal.querySelector('.close');
    const detailsTitle = document.getElementById('recipe-details-title');
    const detailsImage = document.getElementById('recipe-details-image');
    const detailsDescription = document.getElementById('recipe-details-description');
    const detailsIngredients = document.getElementById('recipe-details-ingredients');
    const deleteRecipeBtn = document.getElementById('delete-recipe');

    let recipes = [];
    let currentRecipeIndex = null;

    const saveRecipes = () => {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    };

    const loadRecipes = () => {
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
            recipes = JSON.parse(storedRecipes);
        }
    };

    const renderRecipes = (filter = '') => {
        recipeList.innerHTML = '';
        const filteredRecipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(filter.toLowerCase()));
        if (filteredRecipes.length === 0) {
            noRecipesMessage.style.display = 'block';
        } else {
            noRecipesMessage.style.display = 'none';
            filteredRecipes.forEach((recipe, index) => {
                const recipeItem = document.createElement('div');
                recipeItem.classList.add('recipe-item');
                recipeItem.addEventListener('click', () => {
                    currentRecipeIndex = index;
                    detailsTitle.textContent = recipe.title;
                    detailsDescription.textContent = recipe.details;
                    if (recipe.image) {
                        detailsImage.src = recipe.image;
                        detailsImage.style.display = 'block';
                    } else {
                        detailsImage.style.display = 'none';
                    }
                    detailsIngredients.innerHTML = '';
                    recipe.ingredients.forEach(ingredient => {
                        const li = document.createElement('li');
                        li.textContent = ingredient;
                        detailsIngredients.appendChild(li);
                    });
                    detailsModal.style.display = 'flex';
                });
                
                if (recipe.image) {
                    const img = document.createElement('img');
                    img.src = recipe.image;
                    recipeItem.appendChild(img);
                }

                const title = document.createElement('p');
                title.textContent = recipe.title;
                recipeItem.appendChild(title);
                
                recipeList.appendChild(recipeItem);
            });
        }
    };

    const addIngredient = () => {
        const ingredient = newIngredientInput.value.trim();
        if (ingredient) {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
            newIngredientInput.value = '';
        }
    };

    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    detailsCloseBtn.addEventListener('click', () => {
        detailsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === detailsModal) {
            detailsModal.style.display = 'none';
        }
    });

    addIngredientBtn.addEventListener('click', addIngredient);

    saveRecipeBtn.addEventListener('click', () => {
        const title = recipeTitleInput.value.trim();
        const details = recipeDetailsInput.value.trim();
        const image = recipeImageInput.files[0] ? URL.createObjectURL(recipeImageInput.files[0]) : '';
        const ingredients = Array.from(ingredientsList.children).map(li => li.textContent);
        if (title && details) {
            recipes.push({ title, details, image, ingredients });
            saveRecipes();
            renderRecipes();
            modal.style.display = 'none';
            recipeTitleInput.value = '';
            recipeDetailsInput.value = '';
            recipeImageInput.value = '';
            ingredientsList.innerHTML = '';
        } else {
            alert('Please fill out all fields');
        }
    });

    searchBar.addEventListener('input', (event) => {
        renderRecipes(event.target.value);
    });

    deleteRecipeBtn.addEventListener('click', () => {
        if (currentRecipeIndex !== null) {
            recipes.splice(currentRecipeIndex, 1);
            saveRecipes();
            renderRecipes();
            detailsModal.style.display = 'none';
        }
    });

    loadRecipes();
    renderRecipes();
});

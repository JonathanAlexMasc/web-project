// Define initial component options
const componentOptions = ['empty', 'pole', 'house'];
let currentIndex = 0;

// Function to change the component on click
document.getElementById('change-component').addEventListener('click', function () {
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        component.className = `component ${componentOptions[currentIndex]}`;
    });
    currentIndex = (currentIndex + 1) % componentOptions.length;
});

// Function to add a new row of components
document.getElementById('add-row').addEventListener('click', function () {
    const newRow = document.createElement('div');
    newRow.classList.add('row');
    for (let i = 0; i < 3; i++) {
        const newComponent = document.createElement('div');
        newComponent.classList.add('component', 'empty');
        newRow.appendChild(newComponent);
    }
    document.getElementById('main-content').appendChild(newRow);
});

// Function to reset the main content to its initial state
document.getElementById('reset').addEventListener('click', function () {
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        component.className = 'component empty';
    });

    // Remove additional rows except for the initial row
    const rows = document.querySelectorAll('.row');
    for (let i = 1; i < rows.length; i++) {
        rows[i].remove();
    }
});
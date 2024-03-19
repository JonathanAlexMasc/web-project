// Define initial component options
const componentOptions = ['Empty', 'Pole', 'House'];
let currentIndex = 0;
let selectedComponent = null;

// add listeners by default
addListeners();

// Function to change the component on click
document.getElementById('change-component').addEventListener('click', function () {
    if (selectedComponent) {
        currentIndex = (currentIndex + 1) % componentOptions.length;
        selectedComponent.textContent = componentOptions[currentIndex];
        selectedComponent.className = `component ${componentOptions[currentIndex].toLowerCase()}`;
    }
});

function addListeners() {
    // Add event listeners to components for selection
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        component.addEventListener('click', function () {
            // Remove 'selected' class from all components
            components.forEach(comp => comp.classList.remove('selected'));
            // Add 'selected' class to clicked component
            component.classList.add('selected');
            // Set the selected component
            selectedComponent = component;
            // Update currentIndex to the clicked component's index
            currentIndex = componentOptions.indexOf(component.textContent);
        });
    });
}


// Function to add a new row with three empty components
function addRow() {
    const mainContent = document.getElementById('main-content');
    const newRow = document.createElement('div');
    newRow.classList.add('row');

    // Create and append three empty components to the new row
    for (let i = 0; i < 3; i++) {
        const emptyComponent = document.createElement('div');
        emptyComponent.classList.add('component', 'empty');
        emptyComponent.textContent = 'Empty';
        newRow.appendChild(emptyComponent);
    }

    mainContent.appendChild(newRow);


    addListeners();
}

// Event listener for the "Add Row" button
document.getElementById('add-row').addEventListener('click', addRow);


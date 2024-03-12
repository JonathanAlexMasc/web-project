// Define initial component options
const componentOptions = ['Empty', 'Pole', 'House'];
let currentIndex = 0;
let selectedComponent = null;

// Function to change the component on click
document.getElementById('change-component').addEventListener('click', function () {
    if (selectedComponent) {
        currentIndex = (currentIndex + 1) % componentOptions.length;
        selectedComponent.textContent = componentOptions[currentIndex];
        selectedComponent.className = `component ${componentOptions[currentIndex].toLowerCase()}`;
    }
});

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

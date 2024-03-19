/*
 * Variables
 */
const histories = {};

function addListeners() {
    // Add event listeners to components for selection
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        component.addEventListener('click', function () {
            // Remove 'selected' class from all components
            components.forEach(comp => comp.classList.remove('selected'));
            // Add 'selected' class to clicked component
            component.classList.add('selected');

            let currHist = histories[component.id]
            console.log("curr history", currHist)
            document.getElementById("undo").onclick = currHist.undoCmd;
            document.getElementById("redo").onclick = currHist.redoCmd;
        });
    });
}

// make a history class for each DIV
window.onload = function() {
    addListeners();
    console.log('here')
    document.querySelectorAll('.component').forEach(component => {
        const hist = new History()

        // Assign click event listener to each component
        component.addEventListener('click', function () {
            EventRouter(hist);
        });

        updateUI(hist);

        histories[component.id] = hist
    })
    console.log('histories', histories)
    addListeners();
}
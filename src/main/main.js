/*
 * INITIAL VARIABLES
 */
var histories = {};
var compID = 1;
const addRowButton = document.getElementById('add-row');
const resetButton = document.getElementById('reset');
const allPolesButton = document.getElementById('all-poles');


// JavaScript Document
// Helper class to handle the current location in the undo/redo list
class History {
    constructor() {
        this.UndoRedos = [];
        this.index = 0;
    }

    // New UndoRedo, remove everything after the current UndoRedo index
    // and append the new function
    executeAction(cmd) {
        this.UndoRedos.length = this.index; // Trims length from 0 to index
        this.UndoRedos.push(cmd);
        this.index = this.UndoRedos.length;

        // Run the UndoRedo and update
        cmd.exec();
        updateUI();
    }

    // Undo called. Call the undo function on the current UndoRedo and move back one
    undoCmd() {
        if (this.index > 0) {
            var cmd = this.UndoRedos[this.index - 1];
            cmd.undo();
            this.index = this.index - 1;
            updateUI();
        }
    }

    // Redo called. Call the execution function on the current UndoRedo and move forward one
    redoCmd() {
        if (this.index < this.UndoRedos.length) {
            var cmd = this.UndoRedos[this.index];
            cmd.exec();
            this.index = this.index + 1;
            updateUI();
        }
    }

    // Is undo available
    canUndo() {
        return this.index != 0;
    }

    // Is redo available
    canRedo() {
        return this.index < this.UndoRedos.length;
    }
}

// Concrete UndoRedo class. Since we have undo and redo, we must have
// an "action" (exec) function and an undo
// Ideally, this should forward these calls onto the class that does the task
class UndoRedo {
    constructor(oldContent, newContent, componentClass) {
        this.oldContent = oldContent;
        this.newContent = newContent;
        this.componentClass = componentClass;
    }

    // Changes the content of the component with the new content
    exec() {
        var components = document.getElementsByClassName(this.componentClass);
        for (let component of components) {
            component.innerHTML = this.newContent;
        }
    }

    // Reverts the content of the component to the old content
    undo() {
        var components = document.getElementsByClassName(this.componentClass);
        for (let component of components) {
            component.innerHTML = this.oldContent;
        }
    }
}

// Map UndoRedos onto buttons
function changeComponent(event) {
    var componentClass = 'selected';
    var oldContent = document.querySelector('.' + componentClass).innerHTML;
    var currentContent = oldContent.trim(); // Trim whitespace
    var newContent = '';

    // Cycle between House, Pole, and Empty
    if (currentContent === 'House') {
        newContent = 'Pole';
    } else if (currentContent === 'Pole') {
        newContent = 'Empty';
    } else { // Assume currentContent is Empty or any other value
        newContent = 'House';
    }

    var cmd = new UndoRedo(oldContent, newContent, componentClass);
    var selectedID = getSelectedComponentID();
    var selectedHist = histories[selectedID];
    selectedHist.executeAction(cmd);
}

// Toy version of the observer pattern
function updateUI() {
    var selectedID = getSelectedComponentID();
    var selectedHist = histories[selectedID];
    document.getElementById("undo").disabled = !selectedHist.canUndo();
    document.getElementById("redo").disabled = !selectedHist.canRedo();
}

function undo() {
    var selectedID = getSelectedComponentID();
    var selectedHist = histories[selectedID];
    selectedHist.undoCmd();
}

function redo() {
    var selectedID = getSelectedComponentID();
    var selectedHist = histories[selectedID];
    selectedHist.redoCmd();
}

function getSelectedComponentID() {
    var selectedComponent = document.querySelector('.selected');
    if (selectedComponent) {
        return selectedComponent.id;
    }
    return null; // Return null if no element with class "selected" is found
}

// CONTROLLERS
function addListeners() {
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        component.addEventListener('click', function () {
            components.forEach(comp => {
                if (comp !== component) {
                    comp.classList.remove('selected');
                }
            });
            component.classList.add('selected');
            updateUI();
        });
    });
}

function initializeRows() {
    // Create a new row div
    const newRow = document.createElement('div');
    newRow.classList.add('row');

    // Create three component divs and append them to the new row
    for (let i = 0; i < 3; i++) {
        const newComponent = document.createElement('div');
        newComponent.classList.add('component');
        newComponent.textContent = 'Empty';

        // assign ID
        newComponent.id = compID.toString();

        // create a new history for it and add to histories map
        histories[compID] = new History();

        // increment id
        compID = compID + 1

        // add this new comp to row
        newRow.appendChild(newComponent);
    }

    // Set the first component in the first row to be selected
    newRow.firstElementChild.classList.add('selected');

    // Append the new row to the main content section
    const mainContent = document.getElementById('main-content');
    mainContent.appendChild(newRow);

    // add listeners for each component
    addListeners();

    // update UI
    updateUI();
}


/*
 * ADD ROWS LISTENER
 */

// Add an event listener to the add-row button
addRowButton.addEventListener('click', function() {
    // Create a new row div
    const newRow = document.createElement('div');
    newRow.classList.add('row');

    // Create three component divs and append them to the new row
    for (let i = 0; i < 3; i++) {
        const newComponent = document.createElement('div');
        newComponent.classList.add('component');
        newComponent.textContent = 'Empty';

        // assign ID
        newComponent.id = compID.toString();

        // create a new history for it and add to histories map
        histories[compID] = new History();

        // increment ID
        compID = compID + 1

        // add this new comp to row
        newRow.appendChild(newComponent);
    }

    // Append the new row to the main content section
    const mainContent = document.getElementById('main-content');
    mainContent.appendChild(newRow);

    // add listeners for each component
    addListeners();

    // update UI
    updateUI();
});

/*
 * RESET LISTENER
 */
resetButton.addEventListener('click', function() {
    // Get a reference to the main content
    const mainContent = document.getElementById('main-content');

    // Clear existing content
    mainContent.innerHTML = '';

    // reset ID
    compID = 1;

    // reset histories
    histories = {}

    // Set up initial content with one row of all empty components
    const newRow = document.createElement('div');
    newRow.classList.add('row');

    for (let j = 1; j <= 3; j++) {
        const newComponent = document.createElement('div');
        newComponent.classList.add('component');
        newComponent.textContent = 'Empty';

        // assign id
        newComponent.id = compID.toString();

        // add a history
        histories[compID] = new History();

        // update ID
        compID += 1;

        newRow.appendChild(newComponent);
    }

    // Set the first component in the first row to be selected
    newRow.firstElementChild.classList.add('selected');

    // Append the new row to the main content
    mainContent.appendChild(newRow);

    addListeners();
    updateUI();
});

/*
 * ALL POLES
 */
allPolesButton.addEventListener('click', function () {
    // Get a reference to the main content
    const mainContent = document.getElementById('main-content');

    // Clear existing content
    mainContent.innerHTML = '';

    // reset ID
    compID = 1;

    // reset histories
    histories = {}

    // Create two rows with all poles
    for (let i = 0; i < 2; i++) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');

        for (let j = 1; j <= 3; j++) {
            const newComponent = document.createElement('div');
            newComponent.classList.add('component');
            newComponent.textContent = 'Pole';

            // assign id
            newComponent.id = compID.toString();

            // add a history
            histories[compID] = new History();

            // update ID
            compID += 1;

            // add this component to the row
            newRow.appendChild(newComponent);
        }

        // Set the first component in the first row to be selected
        if (i === 0) {
            newRow.firstElementChild.classList.add('selected');
        }

        mainContent.appendChild(newRow);
    }

    addListeners();
    updateUI();
});


/*
 * ENTRY POINT FOR THIS FILE
 */

window.onload = function () {
    // Button click
    document.getElementById("change-component").onclick = changeComponent;
    document.getElementById("undo").onclick = undo;
    document.getElementById("redo").onclick = redo;

    initializeRows();
}

/*
 * INITIAL VARIABLES
 */

var data = [];
var histories = {};
var compID = 1;
var rowSize = 3;
const addRowButton = document.getElementById('add-row');
const resetButton = document.getElementById('reset');
const allPolesButton = document.getElementById('all-poles');
const mixedButton = document.getElementById('mixed');
const deleteRow = document.getElementById('delete-row');

// JavaScript Document
// Helper class to handle the current location in the undo/redo list

// GRADING: MANAGE
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

// GRADING: COMMAND
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
function changeComponent() {
    var componentClass = 'selected';
    var oldContent = document.querySelector('.' + componentClass).innerHTML;
    var currentContent = oldContent.trim(); // Trim whitespace
    var newContent;

    // Cycle between House, Pole, and Empty
    // Cycle between House, Pole, Tree, and Empty
    if (currentContent === 'House') {
        newContent = 'Pole';
    } else if (currentContent === 'Pole') {
        newContent = 'Tree';
    } else if (currentContent === 'Tree') {
        newContent = 'Empty';
    } else { // Assume currentContent is Empty or any other value
        newContent = 'House';
    }


    var cmd = new UndoRedo(oldContent, newContent, componentClass);
    var selectedID = getSelectedComponentID();

    // update the data array using selectedID - 1 as index
    data[selectedID - 1] = newContent;

    var selectedHist = histories[selectedID];

    // GRADING: ACTION
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
    // Get a reference to the main content
    const mainContent = document.getElementById('main-content');

    // Clear existing content
    mainContent.innerHTML = '';

    // reset ID
    compID = 1;

    // reset histories
    histories = {}

    if (data.length == 0) {
        data = ['Empty', 'Empty', 'Empty']
    }

    for (let i = 0; i < data.length; i += rowSize) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');

        // Iterate over elements in the current row
        for (let j = i; j < i + rowSize && j < data.length; j++) {
            const text = data[j];
            const newComponent = document.createElement('div');
            newComponent.classList.add('component');
            newComponent.textContent = text;

            // Assign ID
            newComponent.id = compID.toString();

            // Add a history
            histories[compID] = new History();

            // Update ID
            compID += 1;

            // Add this component to the row
            newRow.appendChild(newComponent);

            // Set the first component in the first row to be selected
            if (i === 0 && j === 0) {
                newComponent.classList.add('selected');
            }
        }

        // Append the new row to the main content
        mainContent.appendChild(newRow);
    }

    addListeners();
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

        // add it to data also
        data.push('Empty')
    }

    // Append the new row to the main content section
    const mainContent = document.getElementById('main-content');
    mainContent.appendChild(newRow);

    // add listeners for each component
    addListeners();

    // update UI
    updateUI();
});

deleteRow.addEventListener('click', () => {
    // Get a reference to the main content
    const mainContent = document.getElementById('main-content');

    // Get all rows
    const rows = mainContent.querySelectorAll('.row');

    // Check if there are rows to delete
    if (rows.length > 1) {
        // Get the last row
        const lastRow = rows[rows.length - 1];

        // Remove the last row from the DOM
        mainContent.removeChild(lastRow);

        var newID = compID - 3;

        while (compID >= newID) {
            compID = compID - 1;
            histories[compID] = null;
        }

        data.splice(-3);

    } else {
        console.log("No rows to delete.");
    }

    addListeners();
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

    data = ['Empty', 'Empty', 'Empty']

    for (let i = 0; i < data.length; i += rowSize) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');

        // Iterate over elements in the current row
        for (let j = i; j < i + rowSize && j < data.length; j++) {
            const text = data[j];
            const newComponent = document.createElement('div');
            newComponent.classList.add('component');
            newComponent.textContent = text;

            // Assign ID
            newComponent.id = compID.toString();

            // Add a history
            histories[compID] = new History();

            // Update ID
            compID += 1;

            // Add this component to the row
            newRow.appendChild(newComponent);

            // Set the first component in the first row to be selected
            if (i === 0 && j === 0) {
                newComponent.classList.add('selected');
            }
        }

        // Append the new row to the main content
        mainContent.appendChild(newRow);
    }

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

    data = ['Pole', 'Pole', 'Pole', 'Pole', 'Pole', 'Pole']

    for (let i = 0; i < data.length; i += rowSize) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');

        // Iterate over elements in the current row
        for (let j = i; j < i + rowSize && j < data.length; j++) {
            const text = data[j];
            const newComponent = document.createElement('div');
            newComponent.classList.add('component');
            newComponent.textContent = text;

            // Assign ID
            newComponent.id = compID.toString();

            // Add a history
            histories[compID] = new History();

            // Update ID
            compID += 1;

            // Add this component to the row
            newRow.appendChild(newComponent);

            // Set the first component in the first row to be selected
            if (i === 0 && j === 0) {
                newComponent.classList.add('selected');
            }
        }

        // Append the new row to the main content
        mainContent.appendChild(newRow);
    }

    addListeners();
    updateUI();
});

/*
 * MIXED Button
 */
mixedButton.addEventListener('click', function () {
    // Get a reference to the main content
    const mainContent = document.getElementById('main-content');

    // Clear existing content
    mainContent.innerHTML = '';

    // reset ID
    compID = 1;

    // reset histories
    histories = {}

    // mixed arr
    data = ['Empty', 'Empty', 'Pole',
        'House', 'Empty', 'House',
        'Pole', 'House', 'Pole',
    ];

    for (let i = 0; i < data.length; i += rowSize) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');

        // Iterate over elements in the current row
        for (let j = i; j < i + rowSize && j < data.length; j++) {
            const text = data[j];
            const newComponent = document.createElement('div');
            newComponent.classList.add('component');
            newComponent.textContent = text;

            // Assign ID
            newComponent.id = compID.toString();

            // Add a history
            histories[compID] = new History();

            // Update ID
            compID += 1;

            // Add this component to the row
            newRow.appendChild(newComponent);

            // Set the first component in the first row to be selected
            if (i === 0 && j === 0) {
                newComponent.classList.add('selected');
            }
        }

        // Append the new row to the main content
        mainContent.appendChild(newRow);
    }

    addListeners();
    updateUI();
});

function saveCurrentState() {
    const jsonObject = {};

    data.forEach((string, index) => {
        jsonObject[`string${index + 1}`] = string;
    })

    // Make a POST request to your server endpoint
    fetch('/saveDataEndpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonObject),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Handle success response from server
            console.log('Data saved successfully');
        })
        .catch(error => {
            // Handle error
            console.error('There was a problem saving the data:', error);
        });
}

/*
 * ENTRY POINT FOR THIS FILE
 */

window.onload = function () {
    // Button click
    document.getElementById("change-component").onclick = changeComponent;
    document.getElementById("undo").onclick = undo;
    document.getElementById("redo").onclick = redo;

    // fetch the data from the data.json file
    fetch('../mgmt/uploads/data.json').then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        else {
            return response.json();
        }
    }).then(jsonData => {
        if (jsonData) {
            // Assign the result to the data variable
            data = Object.values(jsonData);
            initializeRows(); // Call initializeRows after data is fetched
        }
        else {
            console.error('No data fetched');
            return null;
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
        return null;
    });
}

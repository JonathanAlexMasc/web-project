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
// Attach all functions to HTML elements
window.onload = function () {
    // Button click
    document.getElementById("change-component").onclick = changeComponent;
    document.getElementById("undo").onclick = undo;
    document.getElementById("redo").onclick = redo;

    initializeHistories();
    updateUI();
    addListeners();
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

var histories = {};

function initializeHistories() {
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        const componentId = component.id;
        histories[componentId] = new History();
    });
}
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
    constructor(oldContent, newContent, componentId) {
        this.oldContent = oldContent;
        this.newContent = newContent;
        this.componentId = componentId;
    }

    // Changes the content of the component with the new content
    exec() {
        var component = document.getElementById(this.componentId);
        component.innerHTML = this.newContent;
    }

    // Reverts the content of the component to the old content
    undo() {
        var component = document.getElementById(this.componentId);
        component.innerHTML = this.oldContent;
    }
}

// Map UndoRedos onto buttons
function changeComponent(event) {
    var componentID = 'selected'
    var oldContent = document.getElementById(componentID).innerHTML;
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

    var cmd = new UndoRedo(oldContent, newContent, componentID);
    hist.executeAction(cmd);
}

// Toy version of the observer pattern
function updateUI() {
    document.getElementById("undo").disabled = !hist.canUndo();
    document.getElementById("redo").disabled = !hist.canRedo();
}

// Our undo/redo helper class
var hist = new History();

function undo() {
    hist.undoCmd();
}

function redo() {
    hist.redoCmd();
}

// Attach all functions to HTML elements
window.onload = function () {
    // Button click
    document.getElementById("change-component").onclick = changeComponent;
    document.getElementById("undo").onclick = undo;
    document.getElementById("redo").onclick = redo;

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
                    comp.removeAttribute('id');
                }
            });
            component.id = 'selected';
        });
    });
}


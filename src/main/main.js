let optionIndex = 0;

//helper class to handle the current location in the undo/redo list
function History() {
    var UndoRedos =[];
    var index = 0


    //new UndoRedo, remove everything after the current UndoRedo index
    //and append the new function
    this.executeAction = function(cmd){
        UndoRedos.length = index; //trims length from 0 to index
        UndoRedos.push(cmd);
        index = UndoRedos.length

        //run the UndoRedo and update
        optionIndex = (optionIndex + 1) % 3;
        cmd.exec(optionIndex);
        updateUI();
    }


    //undo called. Call the undo function on the current UndoRedo and move back one
    this.undoCmd = function(){
        if(index > 0)
        {
            var cmd = UndoRedos[index-1];
            optionIndex = optionIndex > 0 ? optionIndex - 1 : 2;
            cmd.undo(optionIndex);
            index= index - 1;
            updateUI();
        }
    }

    //redo called. Call the execution function on the current UndoRedo and move forward one
    this.redoCmd = function(){
        if(index < UndoRedos.length)
        {
            var cmd = UndoRedos[index];
            optionIndex = (optionIndex + 1) % 3;
            cmd.exec(optionIndex);
            index = index + 1;
            updateUI();
        }
    }


    //is undo available
    this.canUndo = function(){
        return index > 0;
    }

    //is redo available
    this.canRedo = function(){
        return index < UndoRedos.length;
    }
}


//concrete UndoRedo class. Since we have undo and redo, we much have
//a "action" (exec) function and an undo
//ideally, this should forward these calls onto the class that does the task
function UndoRedo(optIndex){
    const options = ["Empty", "House", "Pole"];

    //appends the given letter to our result
    this.exec = function(){
        var out = document.getElementById("selected")
        out.innerHTML = options[optIndex]
    }

    //removes a letter
    this.undo = function(){
        var out = document.getElementById("selected")
        out.innerHTML = options[optIndex]
    }
}


//map UndoRedos onto buttons
function EventRouter(event) {
    if( event.target.id == "change-component" )
        hist.executeAction(new UndoRedo(optionIndex))
    else if( event.target.id == "buttonB" )
        hist.executeAction(new UndoRedo("B"))
    else if( event.target.id == "buttonC" )
        hist.executeAction(new UndoRedo("C"))
    else if( event.target.id == "buttonD" )
        hist.executeAction(new UndoRedo("D"))

    updateUI();

}

//toy version of the observer pattern
function updateUI()
{
    document.getElementById("undo").disabled = !hist.canUndo();
    document.getElementById("redo").disabled = !hist.canRedo();
}

/*
 * VARIABLES
 */

//our undo/redo helper class
var hist = new History();

function addListeners() {
    // Add event listeners to components for selection
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        component.addEventListener('click', function () {
            // Remove 'selected' id from all components
            components.forEach(comp => comp.removeAttribute('id'));
            // Add 'selected' id to clicked component
            component.setAttribute('id', 'selected');
        });
    });
}

//attach all functions to html elements
window.onload = function() {
    addListeners();

    //button click handlers
    document.getElementById("change-component").onclick = EventRouter;
    document.getElementById("undo").onclick = hist.undoCmd;
    document.getElementById("redo").onclick = hist.redoCmd;

    updateUI();
}
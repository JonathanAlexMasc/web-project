function History() {
    var UndoRedos = [];
    var index = 0;
    var optionIndex = 0;

    this.executeAction = function(cmd){
        UndoRedos.length = index;
        UndoRedos.push(cmd);
        index = UndoRedos.length;
        optionIndex = (optionIndex + 1) % 3;
        cmd.exec(optionIndex);
        updateUI(this);
    };

    this.undoCmd = function(){
        console.log(index)
        if(index > 0) {
            var cmd = UndoRedos[index - 1];
            optionIndex = optionIndex > 0 ? optionIndex - 1 : 2;
            cmd.undo(optionIndex);
            index = index - 1;
            updateUI(this);
        }
    };

    this.redoCmd = function(){
        if(index < UndoRedos.length) {
            var cmd = UndoRedos[index];
            optionIndex = (optionIndex + 1) % 3;
            cmd.exec(optionIndex);
            index = index + 1;
            updateUI(this);
        }
    };

    this.canUndo = function(){
        return index > 0;
    };

    this.canRedo = function(){
        return index < UndoRedos.length;
    };

    this.getOptionIndex = () => {
        return optionIndex;
    }
}


//concrete UndoRedo class. Since we have undo and redo, we much have
//a "action" (exec) function and an undo
//ideally, this should forward these calls onto the class that does the task
function UndoRedo(optIndex){
    const options = ["Empty", "House", "Pole"];

    //appends the given letter to our result
    this.exec = function(){
        var out = document.querySelector('.selected')
        out.innerHTML = options[optIndex]
    }

    //removes a letter
    this.undo = function(){
        var out = document.querySelector('.selected')
        out.innerHTML = options[optIndex]
    }
}


//map UndoRedos onto buttons
function EventRouter(hist) {
    if (hist) {
        console.log(hist.getOptionIndex())
        hist.executeAction(new UndoRedo(hist.getOptionIndex())); // Execute action with the provided history
        updateUI(hist); // Update the UI after executing the action
    } else {
        console.error("History instance is not defined.");
    }
}

//toy version of the observer pattern
function updateUI(hist)
{
    document.getElementById("undo").disabled = !hist.canUndo();
    document.getElementById("redo").disabled = !hist.canRedo();
}
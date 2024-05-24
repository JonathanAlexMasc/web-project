/*
 * INITIAL VARIABLES
 */
var data = [];
var rowSize = 3;

// JavaScript Document//helper class to handle the current location in the undo/redo list
class History {
    constructor(){
        this.UndoRedos =[];
        this.index = 0;
    }


    //new UndoRedo, remove everything after the current UndoRedo index
    //and append the new function
    executeAction(cmd){
        this.UndoRedos.length = this.index; //trims length from 0 to index
        this.UndoRedos.push(cmd);
        this.index = this.UndoRedos.length

        //run the UndoRedo and update
        cmd.exec();
        updateUI();
    }


    //undo called. Call the undo functin on the current UndoRedo and move back one
    undoCmd(){
        if(this.index > 0)
        {
            var cmd = this.UndoRedos[this.index-1];
            cmd.undo();
            this.index= this.index - 1;
            updateUI();
        }
    }

    //redo called. Call the execution function on the current UndoRedo and move forward one
    redoCmd(){
        if(this.index < this.UndoRedos.length)
        {
            var cmd = this.UndoRedos[this.index];
            cmd.exec();
            this.index = this.index + 1;
            updateUI();
        }
    }


    //is undo available
    canUndo(){
        return this.index != 0;
    }

    //is redo available
    canRedo(){
        return this.index < this.UndoRedos.length;
    }
}


//concrete UndoRedo class. Since we have undo and redo, we much have
//a "action" (exec) function and an undo
//ideally, this should forward these calls onto the class that does the task
class UndoRedo{
    constructor(oldData, newData){
        this.oldDataArray = oldData;
        this.newDataArray = newData;
    }

    //appends the given letter to our result
    exec(){
        data = this.newDataArray;
        console.log('New Data?: ', data);
        updateMainContent();
    }

    //removes a letter
    undo(){
        data = this.oldDataArray;
        console.log('Old Data?: ', data);
        updateMainContent();
    }
}

//our undo/redo helper class
var hist = new History();

function undo()
{
    hist.undoCmd()
}
function redo()
{
    hist.redoCmd()
}

function updateUI()
{
    document.getElementById("undo").disabled = !hist.canUndo();
    document.getElementById("redo").disabled = !hist.canRedo();
}

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

function getNewContent(oldContent) {
    if (oldContent === 'House') {
        return 'Pole';
    } else if (oldContent === 'Pole') {
        return  'Bush';
    } else if (oldContent === 'Bush') {
        return  'Thorn';
    } else if (oldContent === 'Thorn') {
        return  'Empty';
    } else {
        return  'House';
    }
}

function getSelectedComponentID() {
    var selectedComponent = document.querySelector('.selected');
    if (selectedComponent) {
        return selectedComponent.id;
    }
    return null; // Return null if no element with class "selected" is found
}

function changeComponent() {
    var oldContent = document.querySelector('.' + 'selected').innerHTML.trim();
    var newContent = getNewContent(oldContent);

    // update data
    var oldData = [...data];
    var selectedComponentID = getSelectedComponentID();
    console.log('Selected component ID: ', selectedComponentID);
    data[selectedComponentID - 1] = newContent; // update data
    var newData = [...data];

    console.log('Old Data in changeComponent: ', oldData);
    console.log('New Data in changeComponent: ', newData);

    var cmd = new UndoRedo(oldData, newData);
    hist.executeAction(cmd);
}


function updateMainContent() {
    // Get a reference to the main content
    const mainContent = document.getElementById('main-content');

    // Clear existing content
    mainContent.innerHTML = '';

    // Use the global `data` variable
    if (data.length === 0) {
        console.warn("No data available to display.");
        return; // Exit if `data` is empty
    }

    // console.log("Data Now: ", data);

    // Iterate through the `data` array to create rows and components
    for (let i = 0; i < data.length; i += rowSize) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');

        // Create components for the current row
        for (let j = i; j < i + rowSize && j < data.length; j++) {
            const newComponent = document.createElement('div');
            newComponent.classList.add('component');
            newComponent.textContent = data[j]; // Use global `data`
            newComponent.id = (j + 1).toString();
            newRow.appendChild(newComponent); // Add the component to the row
        }

        // Append the new row to the main content
        mainContent.appendChild(newRow);
    }

    addListeners();
    updateUI();
}

function addRow() {
    var oldData = [...data];
    for (let i = 0; i < rowSize; i++) {
        data.push('Empty');
    }
    var newData = [...data];
    var cmd = new UndoRedo(oldData, newData);
    hist.executeAction(cmd);
    updateMainContent();
}

function deleteRow() {
    if (data.length === 0) {
        return;
    }
    var oldData = [...data]; // Backup the current data
    data.splice(-rowSize, rowSize);
    var newData = [...data]; // Create a new copy of `data`
    var cmd = new UndoRedo(oldData, newData);
    hist.executeAction(cmd);
    updateMainContent(); // Update the main content after modifying the `data` array
}

function reset() {
    var oldData = [...data]; // Backup the current data
    data = ['Empty', 'Empty', 'Empty']; // Reset data to its initial state
    var newData = [...data]; // Create a new copy of `data`
    var cmd = new UndoRedo(oldData, newData); // Create an UndoRedo command with the old and new data
    hist.executeAction(cmd); // Execute the command
    updateMainContent(); // Update the main content to reflect the reset
}

function allPoles() {
    var oldData = [...data]; // Backup the current data

    // Create two rows of poles
    const newPoles = Array(rowSize * 2).fill('Pole'); // Creates an array of 'Pole' elements

    data = newPoles; // Set data to two rows of poles
    var newData = [...data]; // Create a new copy of `data`

    var cmd = new UndoRedo(oldData, newData); // Create an UndoRedo command with the old and new data
    hist.executeAction(cmd); // Execute the command
    updateMainContent(); // Update the main content to reflect the new data
}

function mixed() {
    var oldData = [...data]; // Backup the current state of `data`

    // New arrangement as specified
    const mixedData = [
        'Empty', 'Empty', 'Pole',
        'House', 'Empty', 'House',
        'Pole', 'House', 'Pole',
    ];

    data = mixedData; // Set `data` to the mixed configuration
    var newData = [...data]; // Create a new copy of the updated `data`

    var cmd = new UndoRedo(oldData, newData); // Create a new UndoRedo command with old and new data
    hist.executeAction(cmd); // Execute the UndoRedo command
    updateMainContent(); // Update the main content to reflect the new configuration
}


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



window.onload = function () {
    // Button click
    document.getElementById("change-component").onclick = changeComponent;
    document.getElementById("undo").onclick = undo;
    document.getElementById("redo").onclick = redo;
    document.getElementById("add-row").onclick = addRow;
    document.getElementById("delete-row").onclick = deleteRow;
    document.getElementById("reset").onclick = reset;
    document.getElementById("all-poles").onclick = allPoles;
    document.getElementById("mixed").onclick = mixed;


    // fetch the data from the data.json file
    fetch('../mgmt/uploads/data.json').then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        else {
            return response.json();
        }
    }).then(jsonData => {
        if (jsonData && Object.keys(jsonData).length > 0) {
            // If valid data is fetched, use it to populate `data`
            data = Object.values(jsonData);
        } else {
            // If fetched data is empty or null, initialize with default data
            data = ['Empty', 'Empty', 'Empty'];
        }

        updateMainContent();

    }).catch(error => {
        console.error('Error fetching data:', error);
        return null;
    });
}

// File: scripts.js

// Function to initiate file download
function download() {
    window.location.href = "download";
}

// Function to initiate selected file download
function selectedDownload() {
    window.location.href = "uploads/hidden.txt";
}

// Function to trigger writing stuff to the file
function writeFile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // No response to care about
        }
    };
    xhttp.open("GET", "write?write=1&stuff=1,2,3,4,5&more=stuff", true);
    xhttp.send();
}

// Function to trigger reading a file and output to the page
function readFile() {
    window.location.href = "read";
}



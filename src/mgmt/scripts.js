// File: scripts.js

// Function to initiate file download
function download() {
    window.location.href = "download";
}

function selectedDownload() {
    window.location.href = "uploads/random.txt"
}

// Function to trigger reading a file and output to the page
function readFile() {
    window.location.href = "read";
}

function deleteFile() {
    // Get the filename from the user (for demonstration purposes)
    const filename = 'temp.txt'

    // Send a DELETE request to the server
    fetch('/mgmt/delete/' + filename, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting file');
            }
            return response.text();
        })
        .then(data => {
            alert(data); // Display success message
            window.location.href = '/mgmt/mgmt.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting file');
        });
}

function writeFile() {
    var xhttp = new XMLHttpRequest(); //say we want a new http connection

    //wait for a good connection
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {

        }
    };

    //open connection with GET protocal
    xhttp.open(  "GET", "write?write=1&stuff=Hello World&more=Have a wonderful day!", true);

    //commit request
    xhttp.send();

}

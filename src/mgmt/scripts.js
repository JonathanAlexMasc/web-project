// File: scripts.js

// Function to initiate file download
function download(filename) {
    window.location.href = '/mgmt/download/' + filename;
}

// Function to trigger reading a file and output to the page
function readFile(filename) {
    console.log('read file name', filename)
    window.location.href = '/mgmt/read/' + filename;
}

function deleteFile(filename) {
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
            window.location.href = '/mgmt/mgmt.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting file');
        });
}


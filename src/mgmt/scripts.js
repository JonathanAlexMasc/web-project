// File: scripts.js

// Function to initiate file download
function download() {
    window.location.href = "download";
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

// Function to handle file selection
function handleFileSelect(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    // Trigger file upload
    uploadFiles(files);
}

// Function to upload files
function uploadFiles(files) {
    const fileInput = document.getElementById('fileInput');
    fileInput.files = files;

    // Trigger the form submission
    document.querySelector('form').submit();

    // After the form submission, make an AJAX request to /mgmt/upload endpoint
    window.location.href = "/mgmt/upload";
}

// Add event listeners for drag and drop
const dragDropArea = document.getElementById('dragDropArea');
dragDropArea.addEventListener('dragover', function(event) {
    event.preventDefault();
    dragDropArea.classList.add('drag-over');
});
dragDropArea.addEventListener('dragleave', function(event) {
    event.preventDefault();
    dragDropArea.classList.remove('drag-over');
});

dragDropArea.addEventListener('drop', handleFileSelect);

// Alternatively, clicking on the drag and drop area should trigger file selection
dragDropArea.addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

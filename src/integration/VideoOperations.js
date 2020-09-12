function addVideo(course, file, videoName) {
    return fetch('https://turtletech.ddns.me:100/upload/fileUpload/' + course + "/" + videoName, {
        method: 'POST',
        accept: "multipart/form-data",
        body: file
    })
        .then(checkStatus)
        .then(response => response.json())
}

function addPdf(course, file, pdfName) {
    return fetch('https://turtletech.ddns.me:100/upload/fileUpload/' + course + "/" + pdfName, {
        method: 'POST',
        accept: "multipart/form-data",
        body: file
    })
        .then(checkStatus)
        .then(response => response.json())
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
}

const VideoOperations = {addVideo, addPdf}
export default VideoOperations
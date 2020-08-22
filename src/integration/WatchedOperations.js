function removeWatched(videoName, cellNumber) {
    return fetch('watched/removeWatched/' + cellNumber + '/' + videoName, {
        method: 'POST',
        accept: "application/json"
    })
        .then(checkStatus)
        .then(response => response.json())
}

function getWatchedReport(companyName, cb) {
    return fetch('admin/pdfReport/' + companyName, {
        accept: "application/json"
    })
        .then(checkStatus)
        .then(response => response.json())
        .then(cb);
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

const WatchedOperations = {removeWatched, getWatchedReport}
export default WatchedOperations
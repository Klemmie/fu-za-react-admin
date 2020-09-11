function addUser(companyName, cellNumber, registeredCourses) {
    return fetch('https://turtletech.ddns.me:100/user/newUser/' + companyName + '/' + cellNumber + '/' + registeredCourses, {
        method: 'POST',
        accept: "application/json"
    })
        .then(checkStatus)
        .then(response => response.json())
}

function updateUser(companyName, cellNumber, registeredCourses) {
    return fetch('https://turtletech.ddns.me:100/user/updatedUser/' + companyName + "/" + cellNumber + "/" + registeredCourses, {
        method: 'PUT',
        accept: "application/json"
    })
        .then(checkStatus)
        .then(response => response.json())
}

function removeUser(cellNumber) {
    return fetch('https://turtletech.ddns.me:100/user/removeUser/' + cellNumber, {
        method: 'PUT',
        accept: "application/json"
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

const UserOperations = {addUser, updateUser, removeUser}
export default UserOperations
function allCompanies(cb) {
    return fetch('https://turtletech.ddns.me:100/admin/companyNames', {
        accept: "application/json"
    })
        .then(checkStatus)
        .then(response => response.json())
        .then(cb);
}

function learnersByCompanyName(companyName, cb) {
    return fetch('https://turtletech.ddns.me:100/admin/adminScreenView/' + companyName, {
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

const CompanyOperations = {allCompanies, learnersByCompanyName};
export default CompanyOperations;
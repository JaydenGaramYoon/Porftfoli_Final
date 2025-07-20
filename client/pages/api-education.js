const list = async (signal) => {
    try {
        let response = await fetch('/api/education', {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch (err) {
        if (err.name === 'AbortError') {
            return [];
        }
        console.log(err);
        throw err;
    }
};

const read = async (params, signal) => {
    try {
        let response = await fetch('/api/education/' + params.educationId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (err) {
        if (err.name === 'AbortError') {
            return null;
        }
        console.log(err);
        throw err;
    }
};

const create = async (credentials, education) => {
    try {
        let response = await fetch('/api/education/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(education)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const update = async (params, credentials, education) => {
    try {
        let response = await fetch('/api/education/' + params.educationId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(education)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/education/' + params.educationId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const removeAll = async (credentials) => {
    try {
        let response = await fetch('/api/education/', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

export { list, read, create, update, remove, removeAll };

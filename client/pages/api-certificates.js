const list = async (signal) => {
    try {
        let response = await fetch('/api/certificates', {
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
        let response = await fetch('/api/certificates/' + params.certificateId, {
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

const create = async (credentials, certificate) => {
    try {
        let response = await fetch('/api/certificates/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(certificate)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const update = async (params, credentials, certificate) => {
    try {
        let response = await fetch('/api/certificates/' + params.certificateId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(certificate)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/certificates/' + params.certificateId, {
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
        let response = await fetch('/api/certificates/', {
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

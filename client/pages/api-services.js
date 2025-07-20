const create = async (service) => {
    try {
        let response = await fetch('/api/services', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt')).token
            },
            body: JSON.stringify(service)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const list = async (signal) => {
    try {
        let response = await fetch('/api/services', {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch (err) {
        if (err.name === 'AbortError') {
            // 요청이 중단된 경우 조용히 처리
            return [];
        }
        console.log(err);
        throw err; // 다른 에러는 상위로 전달
    }
};

const read = async (params, signal) => {
    try {
        let response = await fetch('/api/services/' + params.serviceId, {
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
            // 요청이 중단된 경우 조용히 처리
            return null;
        }
        console.log(err);
        throw err;
    }
};

const update = async (params, service) => {
    try {
        let response = await fetch('/api/services/' + params.serviceId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt')).token
            },
            body: JSON.stringify(service)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const remove = async (params) => {
    try {
        let response = await fetch('/api/services/' + params.serviceId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt')).token
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const removeAll = async () => {
    try {
        let response = await fetch('/api/services', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt')).token
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

export { create, list, read, update, remove, removeAll };

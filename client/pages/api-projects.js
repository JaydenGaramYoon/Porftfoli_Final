const list = async (signal) => {
  try {
    let response = await fetch('/api/projects', {
      method: 'GET',
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.log(err);
    }
  }
};

const read = async (params, signal) => {
  try {
    let response = await fetch('/api/projects/' + params.projectId, {
      method: 'GET',
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.log(err);
    }
  }
};

const create = async (credentials, project) => {
  try {
    let response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(project)
    });
    return await response.json();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.log(err);
    }
  }
};

const update = async (params, credentials, project) => {
  try {
    let response = await fetch('/api/projects/' + params.projectId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(project)
    });
    return await response.json();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.log(err);
    }
  }
};

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/projects/' + params.projectId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });
    return await response.json();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.log(err);
    }
  }
};

export { list, read, create, update, remove };

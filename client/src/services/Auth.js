class AuthService {
    authenticate(data) {
        return new Promise((res, rej) => {
            fetch('/login', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((response) => {
                    if (response.ok) return res(response.json());
                    return response.statusText;
                })
                .then((error) => { return rej(error) })
        })
    }

    get(id) {
        return new Promise((res, rej) => {
            fetch(`/api/v1/admins/${id}`, {
                method: 'GET',
                credentials: "same-origin",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.ok) return res(response.json());
                    return response.json();
                })
                .then((error) => { return rej(error) })
        })
    }

    getUserPhoto(id, image_name) {
        return new Promise((res, rej) => {
            fetch(`/api/v1/admins/${id}/${image_name}`, {
                method: 'GET',
                credentials: 'same-origin'
            })
                .then((response) => {
                    if (response.ok) return res (response.blob());
                    return response.json();
                })
                .then((error) => { return rej(error) })
        })
    }

    updateAdmin(id, rev, data) {
        return new Promise((res, rej) => {
            fetch(`/api/v1/admins/${id}/${rev}`, {
                method: 'PUT',
                credentials: 'same-origin',
                body: data
            })
                .then((response) => {
                    if (response.ok) return res(response.json());
                    return response.json();
                })
                .then((error) => { return rej(error) })
        })
    }

    requestAcess(data) {
        return new Promise((res, rej) => {
            fetch('/api/v1/admins/', {
                method: 'POST',
                body: data
            })
                .then((response) => {
                    if (response.ok) return res(response.json());
                    return response.json();
                })
                .then((error) => { return rej(error) })
        })
    }

    resetPassword(data) {
        return new Promise((res, rej) => {
            fetch('/api/v1/admins/reset', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((response) => {
                    if (response.ok) return res (response.json());
                    return response.json();
                })
                .then((error) => { return rej(error) })
        })
    }

    logOut() {
        return new Promise((res, rej) => {
            fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin'
            })
                .then((response) => {
                    if (response.ok) return res(response.json());
                    return response.json();
                })
                .then((error) => { return rej(error) })
        })
    }

}

export default new AuthService();

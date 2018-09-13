class FeedbackService {
    get(id) {
        return new Promise((res, rej) => {
            fetch(`/api/v1/feedback/${id}`, {
                method: 'GET',
                credentials: "same-origin",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 401) return rej('Unauthorized');
                    if (response.ok) return res(response.json());
                    return response.json();
                })
                .then((error) => { return rej(error) })
        })
    }

    getAll() {
        return new Promise((res, rej) => {
            fetch('/api/v1/feedback', {
                method: 'GET',
                credentials: "same-origin",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 401) return rej('Unauthorized');
                    if (response.ok) return res(response.json());
                    return response.json();
                })
                .then((error) => { return rej(error) })
        })
    }

}

export default new FeedbackService();

class AnswersService {
    get(id) {
        return new Promise((res, rej) => {
            fetch(`/api/v1/answers/${id}`, {
                method: 'GET',
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

    getEmbed(id) {
        return new Promise((res, rej) => {
            fetch(`/api/v1/answers/file/${id}`, {
                method: 'GET',
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

    getAll() {
        return new Promise((res, rej) => {
            fetch('/api/v1/answers', {
                method: 'GET',
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
    
}

export default new AnswersService();

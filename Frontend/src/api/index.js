const API_URL = "http://localhost:8000/api";
const paths = {
    login: "user/login",
    register: "user/register",
    update: "user/update",
    delete: "user/delete",
    getUser: "user/get"
}
let functions = {}

functions.httpGet = async (url) => {
    const response = await fetch(`${API_URL}/${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};

functions.httpPost = async (url, data) => {
    const response = await fetch(`${API_URL}/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
};

export default {
    API_URL,
    paths,
    ...functions,
};
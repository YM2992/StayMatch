const API_URL = "http://localhost:8000/api";
const paths = {
    // User
    login: "user/login",
    register: "user/register",
    forgotPassword: "user/forgot-password",
    update: "user/update",
    delete: "user/delete",
    getUser: "user/get",

    // Hotels
    getHotels: "hotels",
    getFilters: "hotels/getFilters",
}
let functions = {}

functions.makeQueryString = (params) => {
    const queryString = params ? new URLSearchParams(params).toString() : "";
    return queryString ? `?${queryString}` : "";
}

functions.getParamsFromURL = () => {
    const url = window.location.href;
    const params = new URL(url).searchParams;
    const paramsObj = {};
    for (const [key, value] of params.entries()) {
        paramsObj[key] = value;
    }
    return paramsObj;
}

functions.httpGet = async (url, params) => {
    const queryString = functions.makeQueryString(params);
    const response = await fetch(`${API_URL}/${url}${queryString ? queryString : ""}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return { status: response.status, data };
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
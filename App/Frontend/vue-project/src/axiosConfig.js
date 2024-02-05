import axios from "axios";

export function axiosConfig(authToken, role) {
    const config = axios.create({
        headers: {
            'authorization': authToken,
            'role': role
        },
        withCredentials: true
    })
    return config
}



import { Values } from "./index";

export interface LoginResult {
    success: boolean;
    token?: string;
    message?: string;
}

export async function login(body: Values): Promise<LoginResult> {
    const result: LoginResult = {
        success: false
    };
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const responseJson = await response.json();
    if (response.status === 201) {
        result.success = true;
        result.token = responseJson?.token;
    } else if (response.status === 404) {
        result.success = false;
        result.message = "Usuário ou senha inválidos.";
    } else if (response.status === 400) {
        result.success = false;
        result.message = "Usuário ou senha inválidos.";
        console.log(
            "Bad request user login (validation): ",
            responseJson?.message
        );
    } else {
        result.success = false;
        result.message = "Erro inesperado ao efetuar login.";
        console.log(
            "Bad request user register (unknown): ",
            responseJson?.message
        );
    }
    return Promise.resolve(result);
}

export interface RegisterResult {
    success: boolean;
    message?: string;
}

export async function register(body: Values): Promise<RegisterResult> {
    const result: RegisterResult = {
        success: false
    };
    const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (response.status === 201) {
        result.success = true;
    } else if (response.status === 409) {
        result.success = false;
        result.message = "Usuário já cadastrado.";
    } else if (response.status === 400) {
        const responseJson = await response.json();
        result.success = false;
        result.message = "Usuário ou senha inválidos.";
        console.log(
            "Bad request user register (validation): ",
            responseJson?.message
        );
    } else {
        const responseJson = await response.json();
        result.success = false;
        result.message = "Erro inesperado ao tentar registrar usuário.";
        console.log(
            "Bad request user register (unknown): ",
            responseJson?.message
        );
    }
    return Promise.resolve(result);
}

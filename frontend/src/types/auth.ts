export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginFormErrors {
    email?: string;
    password?: string;
    general?: string;
}

export interface RegisterFormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormErrors {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

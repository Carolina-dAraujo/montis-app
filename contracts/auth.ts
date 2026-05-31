export interface AuthUser {
	uid: string;
	email: string;
	displayName?: string;
}

export interface AuthResponse {
	token: string;
	user: AuthUser;
	message: string;
}

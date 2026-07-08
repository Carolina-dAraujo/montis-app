export interface AuthUser {
	uid: string;
	email: string;
	displayName?: string;
}

export interface AuthResponse {
	token: string;
	refreshToken: string;
	user: AuthUser;
	message: string;
}

export interface RefreshAuthResponse {
	token: string;
	refreshToken: string;
}

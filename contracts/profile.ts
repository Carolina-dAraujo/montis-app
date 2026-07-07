export interface UserProfile {
	uid: string;
	email: string;
	displayName?: string;
	phoneNumber?: string;
	profileImage?: string;
}

export interface UpdateProfileResponse extends UserProfile {
	message?: string;
}

export interface MessageResponse {
	message: string;
}

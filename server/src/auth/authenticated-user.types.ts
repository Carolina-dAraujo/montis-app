import * as firebaseAdmin from 'firebase-admin';

export type AuthenticatedUser = Pick<
	firebaseAdmin.auth.DecodedIdToken,
	'uid' | 'email' | 'name'
>;

import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { FirebaseService } from "../firebase/firebase.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly firebaseService: FirebaseService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedException("No token provided");
		}

		const token = authHeader.substring(7); // Remove "Bearer " prefix

		try {
			// Try to verify as an ID token first (for web clients)
			try {
				const decodedToken = await this.firebaseService.verifyIdToken(token);
				request.user = decodedToken;
				return true;
			} catch (idTokenError) {
				// If ID token verification fails, try as a custom token (for mobile clients)
				try {
					const idToken = await this.firebaseService.exchangeCustomTokenForIdToken(token);
					const decodedToken = await this.firebaseService.verifyIdToken(idToken);
					request.user = decodedToken;
					return true;
				} catch (customTokenError) {
					throw new UnauthorizedException("Invalid token");
				}
			}
		} catch (error) {
			throw new UnauthorizedException("Invalid token");
		}
	}
}

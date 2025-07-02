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
			try {
				const decodedToken = await this.firebaseService.verifyIdToken(token);
				request.user = decodedToken;
				return true;
			} catch (idTokenError) {
				const idToken = await this.firebaseService.exchangeCustomTokenForIdToken(token);
				const decodedToken = await this.firebaseService.verifyIdToken(idToken);
				request.user = decodedToken;
				return true;
			}
		} catch (error) {
			throw new UnauthorizedException("Invalid token");
		}
	}
}

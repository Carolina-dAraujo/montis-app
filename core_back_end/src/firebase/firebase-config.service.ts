export class FirebaseConfigService {
  constructor(public readonly apiKey: string) {
    if (!apiKey) {
      throw new Error('Firebase API key is not set');
    }
  }
}

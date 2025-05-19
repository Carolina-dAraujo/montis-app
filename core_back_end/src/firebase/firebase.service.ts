import * as firebaseAdmin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class FirebaseService {
  async createUser(props: CreateRequest): Promise<UserRecord> {
    return await firebaseAdmin.auth().createUser(props);
  }
}

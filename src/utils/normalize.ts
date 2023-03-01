import { UserDocument } from '@models';

/**
 * User without sensitive fields.
 * This is useful when returning data to client.
 */
export type NormalizedUserDocument = Pick<UserDocument, '_id' | 'name' | 'email' | 'role'>;
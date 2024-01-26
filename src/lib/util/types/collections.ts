import { collection } from 'firebase/firestore';
import { type ExistingEntry } from '../../EntryCreator/types/entryTypes';
import { type ExistingForm } from '../../FormCreator/types/formTypes';
import { type Org } from '../../OrgCreator/types/orgType';
import { firestore } from '../../firebase';
import { type User } from '../user/types/user';
import { parseExistingEntry } from './collectionConverters/entry';
import { parseExistingForm } from './collectionConverters/form';
import { parseOrg } from './collectionConverters/org';
import { parseUser } from './collectionConverters/user';

export const USER_COLLECTION = collection(firestore, 'users').withConverter<User>({
	fromFirestore: (snapshot, options) => parseUser(snapshot.data(options)),
	toFirestore: (data) => data
});

export const FORM_COLLECTION = collection(firestore, 'forms').withConverter<ExistingForm>({
	fromFirestore: (snapshot, options) => parseExistingForm(snapshot.data(options)),
	toFirestore: (data) => data
});

export const ORG_COLLECTION = collection(firestore, 'orgs').withConverter<Org>({
	fromFirestore: (snapshot, options) => parseOrg(snapshot.data(options)),
	toFirestore: (data) => data
});

export const ENTRY_COLLECTION = (formId: string) =>
	collection(FORM_COLLECTION, formId, 'entries').withConverter<ExistingEntry>({
		fromFirestore: (snapshot, options) => parseExistingEntry(snapshot.data(options)),
		toFirestore: (data) => data
	});

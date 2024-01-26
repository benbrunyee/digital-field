import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { ExistingForm } from '../../FormCreator/types/formTypes';
import { createId } from '../../util/createId';
import { createEntryStoreStructure } from '../../util/entry/createEntry';
import { loadEntry } from '../../util/entry/loadEntry';
import type { EntryValueType, ExistingEntry, NewEntry } from '../types/entryTypes';

const DEFAULT_STORE_NAME = 'entryStore';

export const getEntryStore = (storeName?: string) => {
	return getContext<ReturnType<typeof entryStore>>(storeName ?? DEFAULT_STORE_NAME);
};

export const initializeEntryStore = (
	formId: string,
	initialValue?: {
		entry: ExistingEntry | NewEntry;
		form: ExistingForm;
	},
	storeName?: string
) => {
	const store = entryStore(formId, initialValue);
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

const entryStore = (
	formId: string,
	initialValue?: {
		entry: ExistingEntry | NewEntry;
		form: ExistingForm;
	}
) => {
	const store = writable<
		| {
				entry: ExistingEntry | NewEntry | undefined;
				form: ExistingForm | undefined;
		  }
		| undefined
	>(initialValue);

	if (!initialValue) {
		createEntryStoreStructure(formId).then(({ entry, form }) => {
			if (!entry) {
				return;
			}

			store.set({
				entry,
				form
			});
		});
	}

	const setEntryId = async (id: string) => {
		const entry = await loadEntry(formId, id);

		if (!entry) {
			return;
		}

		store.update((current) => ({
			form: current?.form,
			entry
		}));
		return entry;
	};

	const setFieldValue = (fieldId: string, value: EntryValueType | EntryValueType[]) => {
		// TODO: Make this more efficient by using a map then convert it into an array
		store.update((current) => {
			if (!current?.entry) {
				return current;
			}

			if (fieldId in current.entry.fields) {
				current.entry.fields[fieldId].value = value;
			} else {
				current.entry.fields[fieldId] = {
					clientId: createId('entry'),
					value,
					fieldId
				};
			}

			return current;
		});
	};

	return {
		...store,
		setEntryId,
		setFieldValue
	};
};

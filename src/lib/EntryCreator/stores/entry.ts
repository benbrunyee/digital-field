import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { ExistingForm } from '../../FormCreator/types/formTypes';
import { isExistingDisplayField, isExistingInputField } from '../../FormCreator/util/isFieldType';
import { createId } from '../../util/createId';
import { loadEntry } from '../../util/entry/loadEntry';
import { loadForm } from '../../util/form/loadForms';
import type {
	AddressValueSchema,
	EntryValueType,
	ExistingEntry,
	NewEntry,
	NewEntryField
} from '../types/entryTypes';

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

export const createEntryStoreStructure = async (
	formId: string
): Promise<{
	entry: ExistingEntry | NewEntry;
	form: ExistingForm;
}> => {
	const form = await loadForm(formId);

	const fields = form.fields.reduce<Record<string, NewEntryField>>((r, field) => {
		if (!(isExistingInputField(field) || isExistingDisplayField(field))) {
			return r;
		}

		const entryField: NewEntryField = {
			clientId: createId('entry'),
			fieldId: field.id,
			value: ''
		};

		if (field.type === 'address') {
			entryField.value = createAddressValue();
		} else if (field.type === 'checkbox') {
			entryField.value = false;
		} else if (field.type === 'multi-entry') {
			entryField.value = [];
		}

		r[field.id] = entryField;
		return r;
	}, {});

	return {
		entry: {
			clientId: createId('entry'),
			fields,
			formId: form.id,
			ownerId: '',
			status: ''
		},
		form
	};
};

const createAddressValue = (): AddressValueSchema => ({
	street1: '',
	street2: '',
	city: '',
	state: '',
	postalCode: '',
	country: ''
});

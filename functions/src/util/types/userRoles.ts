export const userRoles = {
	owner: [
		'viewOrg',
		'viewOutputEntity',
		'viewEntry',
		'viewForm',

		'createForm',
		'createOutputEntity',
		'createEntry',

		'updateOrg',
		'updateForm',
		'updateOutputEntity',
		'updateEntry',

		'deleteOrg',
		'deleteForm',
		'deleteOutputEntity',
		'deleteEntry'
	],
	manager: [
		'viewOrg',
		'viewForm',
		'viewOutputEntity',
		'viewEntry',

		'createForm',
		'createOutputEntity',
		'createEntry',

		'updateOrg',
		'updateForm',
		'updateOutputEntity',
		'updateEntry',

		'deleteForm',
		'deleteOutputEntity',
		'deleteEntry'
	],
	form_manager: [
		'viewOrg',
		'viewForm',
		'viewOutputEntity',
		'viewEntry',

		'createForm',
		'createOutputEntity',
		'createEntry',

		'updateForm',
		'updateOutputEntity',
		'updateEntry',

		'deleteForm',
		'deleteOutputEntity',
		'deleteEntry'
	],
	entry_creator: [
		'viewOrg',
		'viewOutputEntity',
		'viewEntry',
		'viewForm',

		'createEntry',

		'updateOwnEntry',

		'deleteOwnEntry'
	],
	viewer: ['viewOrg', 'viewOutputEntity', 'viewEntry', 'viewForm']
} as const;

export const userRoleToName: { [k in keyof typeof userRoles]: string } = {
	owner: 'Owner',
	manager: 'Manager',
	form_manager: 'Form Manager',
	entry_creator: 'Entry Creator',
	viewer: 'Viewer'
} as const;

import { writable } from 'svelte/store';

const animatedItemsStore = <
	T extends object & {
		id: string;
	}
>() => {
	const store = writable<{
		new: {
			position: {
				x: number;
				y: number;
			};
			data: T;
		}[];
		old: {
			position: {
				x: number;
				y: number;
			};
			data: T;
		}[];
	}>({
		new: [],
		old: []
	});

	const addItem = (newVal: T, afterIndex?: number) => {
		store.update((val) => {
			const index = afterIndex ?? val.new.length;

			return {
				...val,
				new: [
					...val.new.slice(0, index),
					{
						position: {
							x: 0,
							y: 0
						},
						data: newVal
					},
					...val.new.slice(index)
				]
			};
		});
	};

	const removeItem = (id: string) => {
		store.update((val) => {
			if (val.new.length === 0 || val.new.findIndex((item) => item.data.id === id) === -1) {
				console.warn(`Could not find item with id ${id}`);
				return val;
			}

			return {
				...val,
				new: val.new.filter((item) => item.data.id !== id)
			};
		});
	};

	const moveItem = (id: string, newIndex: number) => {
		store.update((val) => {
			const oldIndex = val.new.findIndex((item) => item.data.id === id);

			if (val.new.length === 0 || oldIndex === -1) {
				console.warn(`Could not find item with id ${id}`);
				return val;
			}

			const item = val.new[oldIndex];

			return {
				...val,
				new: [
					...val.new.slice(0, oldIndex),
					...val.new.slice(oldIndex + 1, newIndex),
					item,
					...val.new.slice(newIndex)
				]
			};
		});

		const commit = () => {
			store.update((val) => {
				return {
					new: val.new,
					old: val.new
				};
			});
		};

		const getAnimateValues = () => {
			/** Find the differences between the old and new values
			 * - An item was added
			 *  - All elements after the insert index should be moved
			 * - An item was removed
			 *  - All elements after the remove index should be moved
			 * - An item was moved
			 *  - All elements between the old and new index should be moved
			 */
		};

		return {
			subscribe: store.subscribe,
			addItem,
			removeItem,
			moveItem,
			commit
		};
	};
};

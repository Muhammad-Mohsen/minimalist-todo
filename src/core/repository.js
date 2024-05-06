import { FluentDB } from "./fluent-db/fluent-db.js";

export const Repository = await (async () => {

	const db = await FluentDB('todoDB', 1)
		.objectStore('labels', { keyPath: 'id' })
		.objectStore('todos', { keyPath: 'id' })
		.open();

	function Store(name, key) {
		const k = key || 'id';

		const get = async (id) => await db.select(name, id);
		const getAll = async () => await db.selectAll(name);
		const set = async (item) => await db.upsert(name, item);

		return {
			get,
			getAll,
			set
		}
	}

	const TDs = Store('todos');
	const Labels = Store('labels');

	return {
		TDs,
		Labels
	}

})();

import { FluentDB } from "./fluent-db/fluent-db.js";

// object structure
// Todo: { id: number, text: string, isDone: bool, labels: number[] }
// Label: { id: number, text: string, color: string }

export const Repository = await (async () => {

	const db = await FluentDB('todoDB', 1)
		.objectStore('labels', { keyPath: 'id' })
		.objectStore('todos', { keyPath: 'id' })
		.open();

	function Store(name, key) {
		const k = key || 'id';

		const select = (id) => db.select(name, id);
		const selectAll = () => db.selectAll(name);
		const upsert = (items) => db.upsert(name, items);
		const del = (ids) => db.delete(name, ids);

		return {
			select,
			selectAll,
			upsert,
			delete: del
		}
	}

	const Todos = Store('todos');
	const Labels = (() => {
		const key = 'labels';

		function upsert(labels) {
			localStorage.setItem(key, JSON.stringify(labels));
		}
		function selectAll() {
			return JSON.tryParse(localStorage.getItem(key)) || [];
		}

		return {
			upsert,
			selectAll
		}

	})();

	return {
		Todos,
		Labels
	}

})();

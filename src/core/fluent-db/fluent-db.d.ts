interface FluentDB {
	objectStore(name: string, options?: IDBObjectStoreParameters): this;
	withIndex(indexName: string, propName: string, options?: IDBIndexParameters): this;
	open(): Promise<IDBDatabase>;
}

interface IDBDatabase {
	/**
	 * Retrieves a single object from the specified store based on its key.
	 */
	select(store: string, key: any): Promise<any>;
	/**
	 * Retrieves all objects from the specified store.
	 */
	selectAll(store: string): Promise<any[]>;
	/**
	 * Inserts/Updates an object in the specified store.
	 */
	upsert(store: string, objects: any | any[]): Promise<void>;
	/**
	 * Deletes an object(s) from the specified store.
	 */
	delete(store: string, keys: any | any[]): Promise<void>;
}
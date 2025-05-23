import { openDB } from "idb";

const DB_NAME = 'signsafe-db';
const STORE_NAME = 'keys';

export async function getDB() {
    return await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        }
    });
}

export async function savePrivateKey(username: string, key: JsonWebKey, id: string) {
    const db = await getDB()
    await db.put(STORE_NAME, key, `private`)
    await db.put(STORE_NAME, id, 'userID')
    await db.put(STORE_NAME, username, 'username')
}

export async function clearAuthData() {
    const db = await getDB();
    await db.clear(STORE_NAME);

}

export async function loadPrivateKey(username: string): Promise<JsonWebKey | null> {
    const db = await getDB();
    return db.get(STORE_NAME, `private`)
}

export async function loadUserID(): Promise<string | null> {
    const db = await getDB()
    return db.get(STORE_NAME, 'userID')
}

export async function loadUsername(): Promise<string | null> {
    const db = await getDB()
    return db.get(STORE_NAME, 'username')
}

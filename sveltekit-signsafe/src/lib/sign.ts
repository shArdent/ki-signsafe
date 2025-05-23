import { canonicalJsonStringify } from "$lib";
import api from "./api";
import { loadPrivateKey, loadUserID, loadUsername } from "./keyStore";
import type { HttpMethod } from "./types";

export async function signMessage(privateKey: CryptoKey, message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const signature = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        privateKey,
        data
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export async function sendSignedRequest(method: HttpMethod, url: string, body?: object) {
    const nonce = crypto.randomUUID();
    const timestamp = new Date().toISOString(); // atau pakai Unix timestamp jika middleware butuh itu
    const bodyStr = body ? canonicalJsonStringify(body) : "";
    const username = await loadUsername()
    const privateKeyJWK = await loadPrivateKey(username as string)
    const userID = await loadUserID()


    const privateKeyCryptoKey: CryptoKey = await crypto.subtle.importKey(
        // @ts-ignore    
        'jwk',
        privateKeyJWK,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
        } as RsaHashedImportParams,
        false,
        ['sign']
    );


    const message = `${userID}|${timestamp}|${nonce}|${bodyStr}`;
    const signature = await signMessage(privateKeyCryptoKey, message);
    console.log(message)

    const headers = {
        'X-UserID': userID,
        'X-Nonce': nonce,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json' // Default Content-Type untuk body JSON
    };

    const config: any = {
        headers: headers
    };

    console.log(config)

    let res: any;

    switch (method.toUpperCase()) {
        case 'GET':
            res = await api.get(url, config);
            break;
        case 'POST':
            res = await api.post(url, body, config);
            break;
        case 'PUT':
            res = await api.put(url, body, config);
            break;
        case 'DELETE':
            res = await api.delete(url, { ...config, data: body });
            break;
        case 'PATCH':
            res = await api.patch(url, body, config);
            break;
        default:
            throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return res.data;

}

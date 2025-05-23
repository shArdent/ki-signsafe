import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { loadUserID } from '$lib/keyStore';

export const load: PageLoad = async () => {
    if (!browser) return;

    const cred = await loadUserID();

    console.log(cred)

    if (!cred) {
        throw redirect(302, '/auth');
    }
};

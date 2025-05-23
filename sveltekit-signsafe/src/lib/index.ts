// place files you want to import through the `$lib` alias in this folder.
export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(Math.abs(amount));
}

export function canonicalJsonStringify(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
        return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
        return '[' + obj.map(canonicalJsonStringify).join(',') + ']';
    }

    const sortedKeys = Object.keys(obj).sort();
    const parts: string[] = [];
    for (const key of sortedKeys) {
        parts.push(JSON.stringify(key) + ':' + canonicalJsonStringify(obj[key]));
    }
    return '{' + parts.join(',') + '}';
}

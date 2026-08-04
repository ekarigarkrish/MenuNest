export const storage = {
    localStorage: {
        set: (key: string, value: any) => {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: (key: string) => {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        },
        remove: (key: string) => {
            localStorage.removeItem(key);
        }
    },

    sessionStorage: {
        set: (key: string, value: any) => {
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        get: (key: string) => {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        },
        remove: (key: string) => {
            sessionStorage.removeItem(key);
        }
    },

    clearAll: (type: 'localstorage' | 'sessionstorage') => {
        if (type === 'localstorage') localStorage.clear();
        else sessionStorage.clear();
    }
}
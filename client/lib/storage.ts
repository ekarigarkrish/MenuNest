export const storage = {
    localStorage: {
        set: (key: string, value: any) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value));
            }
        },
        get: (key: string) => {
            if (typeof window !== 'undefined') {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            }
            return null;
        },
        remove: (key: string) => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        }
    },

    sessionStorage: {
        set: (key: string, value: any) => {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem(key, JSON.stringify(value));
            }
        },
        get: (key: string) => {
            if (typeof window !== 'undefined') {
                const value = sessionStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            }
            return null;
        },
        remove: (key: string) => {
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem(key);
            }
        }
    },

    clearAll: (type: 'localstorage' | 'sessionstorage') => {
        if (typeof window !== 'undefined') {
            if (type === 'localstorage') localStorage.clear();
            else sessionStorage.clear();
        }
    }
}

export default storage
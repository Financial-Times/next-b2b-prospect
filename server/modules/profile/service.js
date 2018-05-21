export default {
    save: async (session=false, {firstName, lastName, phoneNumber}={}) => {
        const host = process.env.NODE_ENV === 'production' ? 'https://www.ft.com' : 'https://local.ft.com:5050';

        // If they don't have a session bail early
        if (!session) return Promise.reject();
    
        try {
            const result = await fetch(`${host}/profile/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ft-session-s-token': session,
                    'ft-flags': 'nextProfilePage:on', // @TODO Remove once profile page goes live
                    'User-Agent': 'next-b2b-prospect'
                },
                body: JSON.stringify({firstName, lastName, phoneNumber})
            });
            return Promise.resolve(result);
        } catch (e) {
            return Promise.reject();
        }
    }
}

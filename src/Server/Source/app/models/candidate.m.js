
const db = require('../../config/db/index'); // getDatabase


module.exports = {

    getAllCandidate: async () => {
        const rs = await db.get('candidates');
        return rs;
    },
    addACandidate: async (user) => {
        const rs = await db.add(user);
    },

}
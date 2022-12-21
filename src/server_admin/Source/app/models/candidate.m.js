
const db = require('../../config/db/index'); // getDatabase


module.exports = {

    getAllCandidate: async () => {
        const rs = await db.collection('candidates');
        return rs;
    },
    addACandidate: async (user) => {
        const candidatesCollection =  db.collection('candidates');
        const checkuser = await candidatesCollection.where('email', '==', user.email).get();
        if(checkuser.empty){
            const rs = candidatesCollection.add(user);
            return rs;
        } else {
            return null;
        }
    },

}
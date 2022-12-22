
const db = require('../../config/db/index'); // getDatabase


module.exports = {
    getAllEmployer: async () => {
        const rs = await db.collection('employers');
        return rs;
    },
    addEmployer: async (user) => {
        const employerCollection= db.collection('employers');
        const checkuser = await employerCollection.where('email', '==', user.email).get();
        if (checkuser.empty) {
            const rs = employerCollection.add(user);
            return rs;
        } else {
            return null;
        }
    }


}

const db = require('../../config/db/index'); // getDatabase
const storage = require('../../config/db/storage'); // getStorage

module.exports = {

    getAmdinbyUsername: async (email) => {
        const adminCollection = db.collection('admins');
        const snapshot = await adminCollection.where('email', '==', email).get();

        var user = null;
        snapshot.forEach(doc => {
            user = doc.data();
        });

        return user;
    },

}
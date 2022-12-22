
const db = require('../../config/db/index'); // getDatabase
const storage = require('../../config/db/storage'); // getStorage

module.exports = {
    getAllEmployer: async () => {
        const rs = await db.collection('employers');
        return rs;
    },
    addEmployer: async (user) => {
        const employerCollection = db.collection('employers');
        const checkuser = await employerCollection.where('email', '==', user.email).get();
        if (checkuser.empty) {
            const rs = employerCollection.add(user);
            return rs;
        } else {
            return null;
        }
    },
    getEmployerByEmail: async (email) => {
        const employerCollection = db.collection('employers');
        const snapshot = await employerCollection.where('email', '==', email).get();

        var user = null;
        snapshot.forEach(doc => {
            user = doc.data();
        });

        return user;
    },
    getAvatarFromStorage: async (nameImage) => {
        const file = storage.bucket().file(`avatars/${nameImage}`);
        const signedURLconfig = { action: 'read', expires: '01-01-2030'  };

        const signedURLArray = await file.getSignedUrl(signedURLconfig);
        return signedURLArray[0];
    }


}
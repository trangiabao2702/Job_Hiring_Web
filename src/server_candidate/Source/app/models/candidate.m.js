
const db = require('../../config/db/index'); // getDatabase
const storage = require('../../config/db/storage'); // getStorage


module.exports = {

    getAllCandidate: async () => {
        const rs = await db.collection('candidates');
        return rs;
    },
    addACandidate: async (user) => {
        const candidatesCollection = db.collection('candidates');
        const checkuser = await candidatesCollection.where('email', '==', user.email).get();
        if (checkuser.empty) {
            const rs = candidatesCollection.add(user);
            return rs;
        } else {
            return null;
        }
    },
    addACandidateFacebook: async (user) => {
        const candidatesCollection = db.collection('candidates');
        const checkuser = await candidatesCollection.where('idFacebook', '==', user.idFacebook).get();
        if (checkuser.empty) {
            const rs = candidatesCollection.add(user);
            return rs;
        } else {
            return null;
        }
    },
    getByEmail: async (email) => {
        const candidatesCollection = db.collection('candidates');
        const snapshot = await candidatesCollection.where('email', '==', email).get();

        var user = null;
        snapshot.forEach(doc => {
            user = doc.data();
        });

        return user;
    },
    getUserByEmailLogin: async (email) => {
        const candidatesCollection = db.collection('candidates');
        const snapshot = await candidatesCollection.where('email', '==', email).where('state', '==', 'login').get();

        var user = null;
        snapshot.forEach(doc => {
            user = doc.data();
        });

        return user;
    },
    getUserByIDFacebook: async (idFacebook) => {
        const candidatesCollection = db.collection('candidates');
        const snapshot = await candidatesCollection.where('idFacebook', '==', idFacebook).where('state', '==', 'facebook').get();

        var user = null;
        snapshot.forEach(doc => {
            user = doc.data();
        });

        return user;
    },
    getAvatarFromStorage: async (nameImage) => {
        const file = storage.bucket().file(`avatars/${nameImage}`);
        const signedURLconfig = { action: 'read', expires: '01-01-2030' };

        const signedURLArray = await file.getSignedUrl(signedURLconfig);
        return signedURLArray[0];
    },
    getRecruitment: async (idDocRecruitment) => {
        const candidatesCollection = db.collection('recruitments');
        const docSnap = await candidatesCollection.doc(idDocRecruitment).get();
        return docSnap.data();
    },
    getEmployer: async (idEmployer) => {
        const employers_collection = db.collection("employers");
        const docSnap = await employers_collection.doc(idEmployer).get();

        return docSnap.data();
    }

}
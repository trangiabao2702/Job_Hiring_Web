
const db = require('../../config/db/index'); // getDatabase
const storage = require('../../config/db/storage'); // getStorage
const path = require('path');

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
        var recruitment = docSnap.data();
        recruitment.due_date = new Date(recruitment.due_date.toDate().toDateString()).toLocaleString('VN');
        return recruitment;
    },
    getEmployer: async (idEmployer) => {
        const employers_collection = db.collection("employers");
        const docSnap = await employers_collection.doc(idEmployer).get();
        const employer = { idEmployer, ...docSnap.data() }
        return employer;
    },
    getIDDocumentCandidates: async (email) => {
        const candidatesCollection = db.collection('candidates');
        const snapshot = await candidatesCollection.where('email', '==', email).get();
        var docId = null;
        snapshot.forEach(doc => {
            docId = doc.id;
        });

        return docId;
    },
    topJob: async number => {
        // const employer = await db.collection('employers');
        const recruitment = await db.collection('recruitments');
        const list = await recruitment.get();
        var listJob = [];
        var user = null;
        list.forEach(doc => {
            user = doc.data();
            user.doc = doc.id;
            listJob.push(user);
        });
        for (let i = 0; i < listJob.length - 1; i++) {
            for (let j = i + 1; j < listJob.length; j++) {
                if (listJob[i].views < listJob[j].views) {
                    let temp = listJob[i];
                    listJob[i] = listJob[j];
                    listJob[j] = temp;
                }
            }
        }

        listJob.slice(0, number);
        for (let j = 0; j < listJob.length; j++) {
            var rs = await db.collection('employers').doc(listJob[j].belong_employer).get();
            listJob[j].nameEmployer = rs.data().name;
            listJob[j].avatarEmployer = rs.data().avatar;
        }

        return listJob;
    },
    uploadCurriculumVitae: async (curriculumVitae, fileCV) => {
        const fileName = curriculumVitae.id_recruitment + "--" + curriculumVitae.email + path.extname(fileCV.originalname)
        await storage.bucket().file(`cvs_candidates/${fileName}`).createWriteStream().end(fileCV.buffer);

        const file = storage.bucket().file(`cvs_candidates/${fileName}`);
        const signedURLconfig = { action: 'read', expires: '01-01-2030' };
        const signedURLArray = await file.getSignedUrl(signedURLconfig);

        // them link file cv
        curriculumVitae.file_cv = signedURLArray[0];

        const curriculumVitaeCollection = db.collection('curriculum_vitaes');
        const rs = curriculumVitaeCollection.add(curriculumVitae);

        return rs;
    },
    checkApplied: async (id_recruitment, id_candidate) => {

        console.log(id_recruitment, id_candidate);

        const curriculumVitaeCollection = db.collection('curriculum_vitaes');
        const checkApplied = await curriculumVitaeCollection.where('id_recruitment','==', id_recruitment).where('id_candidate','==', id_candidate).get();

        

        if(checkApplied.empty){
            return false;
        }
        return true;
    }



}
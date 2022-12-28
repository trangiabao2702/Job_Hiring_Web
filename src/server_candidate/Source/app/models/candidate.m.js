const db = require("../../config/db/index"); // getDatabase
const storage = require("../../config/db/storage"); // getStorage
const path = require("path");

module.exports = {
  getAllCandidate: async () => {
    const rs = await db.collection("candidates");
    return rs;
  },
  addACandidate: async (user) => {
    const candidatesCollection = db.collection("candidates");
    const checkuser = await candidatesCollection.where("email", "==", user.email).get();
    if (checkuser.empty) {
      const rs = candidatesCollection.add(user);
      return rs;
    } else {
      return null;
    }
  },
  addACandidateFacebook: async (user) => {
    const candidatesCollection = db.collection("candidates");
    const checkuser = await candidatesCollection.where("idFacebook", "==", user.idFacebook).get();
    if (checkuser.empty) {
      const rs = candidatesCollection.add(user);
      return rs;
    } else {
      return null;
    }
  },
  getByEmail: async (email) => {
    const candidatesCollection = db.collection("candidates");
    const snapshot = await candidatesCollection.where("email", "==", email).get();

    var user = null;
    snapshot.forEach((doc) => {
      user = doc.data();
    });

    return user;
  },
  getUserByEmailLogin: async (email) => {
    const candidatesCollection = db.collection("candidates");
    const snapshot = await candidatesCollection.where("email", "==", email).where("state", "==", "login").get();

    var user = null;
    snapshot.forEach((doc) => {
      user = doc.data();
      user.id = doc.id;
    });

    return user;
  },
  getUserByIDFacebook: async (idFacebook) => {
    const candidatesCollection = db.collection("candidates");
    const snapshot = await candidatesCollection.where("idFacebook", "==", idFacebook).where("state", "==", "facebook").get();

    var user = null;
    snapshot.forEach((doc) => {
      user = doc.data();
    });

    return user;
  },
  getAvatarFromStorage: async (nameImage) => {
    const file = storage.bucket().file(`avatars/${nameImage}`);
    const signedURLconfig = { action: "read", expires: "01-01-2030" };

    const signedURLArray = await file.getSignedUrl(signedURLconfig);
    return signedURLArray[0];
  },
  getRecruitment: async (idDocRecruitment) => {
    const candidatesCollection = db.collection("recruitments");
    const docSnap = await candidatesCollection.doc(idDocRecruitment).get();
    var recruitment = docSnap.data();
    recruitment.due_date = new Date(recruitment.due_date.toDate().toDateString()).toLocaleString("VN");
    return recruitment;
  },
  getEmployer: async (idEmployer) => {
    const employers_collection = db.collection("employers");
    const docSnap = await employers_collection.doc(idEmployer).get();
    const employer = { idEmployer, ...docSnap.data() };
    return employer;
  },
  getIDDocumentCandidates: async (email) => {
    const candidatesCollection = db.collection("candidates");
    const snapshot = await candidatesCollection.where("email", "==", email).get();
    var docId = null;
    snapshot.forEach((doc) => {
      docId = doc.id;
    });

    return docId;
  },
  topJob: async (number) => {
    // const employer = await db.collection('employers');
    const recruitment = await db.collection("recruitments");
    const list = await recruitment.get();
    var listJob = [];
    var user = null;
    list.forEach((doc) => {
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

    listJob = listJob.slice(0, number);
    for (let j = 0; j < listJob.length; j++) {
      var rs = await db.collection("employers").doc(listJob[j].belong_employer).get();
      listJob[j].nameEmployer = rs.data().name;
      listJob[j].creation_date = new Date(listJob[j].creation_date.toDate().toDateString()).toLocaleString("VN");
      listJob[j].avatarEmployer = rs.data().avatar;
    }

    return listJob;
  },
  uploadCurriculumVitae: async (curriculumVitae, fileCV) => {
    const fileName = curriculumVitae.id_recruitment + "--" + curriculumVitae.email + path.extname(fileCV.originalname);
    await storage.bucket().file(`cvs_candidates/${fileName}`).createWriteStream().end(fileCV.buffer);

    const file = storage.bucket().file(`cvs_candidates/${fileName}`);
    const signedURLconfig = { action: "read", expires: "01-01-2030" };
    const signedURLArray = await file.getSignedUrl(signedURLconfig);

    // them link file cv
    curriculumVitae.file_cv = signedURLArray[0];

    const curriculumVitaeCollection = db.collection("curriculum_vitaes");
    const rs = curriculumVitaeCollection.add(curriculumVitae);

    return rs;
  },
  checkApplied: async (id_recruitment, id_candidate) => {
    console.log(id_recruitment, id_candidate);

    const curriculumVitaeCollection = db.collection("curriculum_vitaes");
    const checkApplied = await curriculumVitaeCollection.where("id_recruitment", "==", id_recruitment).where("id_candidate", "==", id_candidate).get();

    if (checkApplied.empty) {
      return false;
    }
    return true;
  },
  verify: async (email, result) => {
    const candidatesCollection = db.collection("candidates");
    const snapshot = await candidatesCollection.where("email", "==", email).get();
    var docId = null;
    snapshot.forEach((doc) => {
      docId = doc.id;
    });

    var userUpdate = db.collection("candidates").doc(docId);
    var updateData = userUpdate.update({ status: "approved", verified_date: new Date() });
    result(null, { email: email });
  },
  resetPassword: async (email, password, result) => {
    const candidatesCollection = db.collection("candidates");
    const snapshot = await candidatesCollection.where("email", "==", email).get();
    var docId = null;
    snapshot.forEach((doc) => {
      docId = doc.id;
    });

    var userUpdate = db.collection("candidates").doc(docId);
    var updateData = userUpdate.update({ password: password });
    result(null, { email: email });
  },
  getAllCV: async (id_candidate) => {
    const curriculum_vitaes_collection = db.collection("curriculum_vitaes");
    const curriculum_vitaes = await curriculum_vitaes_collection.where("id_candidate", "==", id_candidate).get();

    return curriculum_vitaes;
  },
  getDetailRecruitment: async (id_recruitment) => {
    const recruitments_collection = db.collection("recruitments");
    const recruitment = await recruitments_collection.doc(id_recruitment).get();

    return recruitment.data();
  },
  getCVByID: async (id) => {
    const curriculum_vitaes_collection = db.collection("curriculum_vitaes");
    const curriculum_vitae = await curriculum_vitaes_collection.doc(id).get();

    return curriculum_vitae.data();
  },
  getReviewByID: async (id) => {
    const reviews_collection = db.collection("reviews");
    const review = await reviews_collection.doc(id).get();

    return review.data();
  },
  //moi
  getAllRecruitment: async (data) => {
    // const employer = await db.collection('employers');
    const recruitment = await db.collection("recruitments");
    var list = await recruitment.get();
    var listJob = [];
    var job = null;
    list.forEach((doc) => {
      job = doc.data();
      job.doc = doc.id;

      var arr = job.experience.split(" ");
      job.experience = arr[0].toString();

      listJob.push(job);
    });

    for (let j = 0; j < listJob.length; j++) {
      var rs = await db.collection("employers").doc(listJob[j].belong_employer).get();
      listJob[j].nameEmployer = rs.data().name;
      listJob[j].avatarEmployer = rs.data().avatar;
      listJob[j].creation_date = new Date(listJob[j].creation_date.toDate().toDateString()).toLocaleString("VN");
      listJob[j].province = rs.data().province;
    }
    for (let i = 0; i < listJob.length; i++) {
      if (!listJob[i].title.includes(data.search)) {
        const removed = listJob.splice(i, 1);
        continue;
      }
      if (!listJob[i].province.includes(data.select_province)) {
        const removed = listJob.splice(i, 1);
        continue;
      }
      if (!listJob[i].working_form.includes(data.select_method_work)) {
        const removed = listJob.splice(i, 1);
        continue;
      }
      if (data.select_experience < listJob[i].experience) {
        const removed = listJob.splice(i, 1);
        continue;
      }
      if (data.select_salary > listJob[i].max_salary) {
        const removed = listJob.splice(i, 1);
        continue;
      }
    }

    return listJob;
  },
};

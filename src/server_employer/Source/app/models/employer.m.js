const db = require("../../config/db/index"); // getDatabase
const storage = require("../../config/db/storage"); // getStorage

module.exports = {
  getAllEmployer: async () => {
    const rs = await db.collection("employers");
    return rs;
  },
  addEmployer: async (user) => {
    const employerCollection = db.collection("employers");
    const checkuser = await employerCollection.where("email", "==", user.email).get();
    if (checkuser.empty) {
      const rs = employerCollection.add(user);
      return rs;
    } else {
      return null;
    }
  },
  getAvatarFromStorage: async (nameImage) => {
    const file = storage.bucket().file(`avatars/${nameImage}`);
    const signedURLconfig = { action: "read", expires: "01-01-2030" };

    const signedURLArray = await file.getSignedUrl(signedURLconfig);
    return signedURLArray[0];
  },
  getEmployerByEmail: async (email) => {
    const employers_collection = db.collection("employers");
    const snapshot = await employers_collection.where("email", "==", email).get();

    let employer = null;
    snapshot.forEach((doc) => {
      employer = doc.data();
    });

    return employer;
  },
  getRecruitmentByID: async (id) => {
    const recruitments_collection = db.collection("recruitments");
    const recruitment = await recruitments_collection.doc(id).get();

    return recruitment.data();
  },
  getCVByID: async (id) => {
    const curriculum_vitaes_collection = db.collection("curriculum_vitaes");
    const curriculum_vitae = await curriculum_vitaes_collection.doc(id).get();

    return curriculum_vitae.data();
  },
};

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
      employer.id = doc.id;
    });

    return employer;
  },
  getIDEmployer: async (id) => {
    const recruitments_collection = db.collection("recruitments");
    const recruitment = await recruitments_collection.doc(id).get();

    return recruitment.data();
  },
  updateListRecruitment: async (id_employer, id_recruitment, type) => {
    const FieldValue = require("firebase-admin").firestore.FieldValue;
    const employers_collection = db.collection("employers").doc(id_employer);

    let rs = null;
    if (type == "add") {
      rs = await employers_collection.update({
        list_recruitments: FieldValue.arrayUnion(id_recruitment),
      });
    } else if (type == "remove") {
      rs = await employers_collection.update({
        list_recruitments: FieldValue.arrayRemove(id_recruitment),
      });
    }

    return rs;
  },
  addRecruitment: async (recruitment) => {
    const recruitmentCollection = db.collection("recruitments");
    const rs = recruitmentCollection.add(recruitment);
    return rs;
  },
  removeRecruitment: async (recruitment) => {
    const recruitmentDoc = db.collection("recruitments").doc(recruitment);
    const rs = recruitmentDoc.delete();
    return recruitmentDoc.id;
  },
  updateRecruitment: async (new_info) => {
    const recruitmentDoc = db.collection("recruitments").doc(new_info.id_recruitment);

    const _date_path = new_info.deadline_submit_record_recruitment.split("-");
    const _due_date = require("firebase-admin").firestore.Timestamp.fromDate(new Date(parseInt(_date_path[0]), parseInt(_date_path[1]) - 1, parseInt(_date_path[2])));

    const rs = await recruitmentDoc.update({
      title: new_info.title_recruitment,
      min_salary: parseInt(new_info.min_salary_recruitment),
      max_salary: parseInt(new_info.max_salary_recruitment),
      number_of_candidates: parseInt(new_info.quantity_recruitment),
      working_form: new_info.method_work_recruitment,
      gender: new_info.sex_recruitment,
      experience: new_info.experience_recruitment,
      due_date: _due_date,
      location: new_info.word_location_recruitment,
      description: new_info.job_describe_recruitment,
      requirements: new_info.require_candidate_recruitment,
      benefits: new_info.benefit_recruitment,
    });

    return recruitmentDoc.id;
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
  getReviewByID: async (id) => {
    const reviews_collection = db.collection("reviews");
    const review = await reviews_collection.doc(id).get();

    return review.data();
  },
  getCandidateByID: async (id) => {
    const candidates_collection = db.collection("candidates");
    const candidate = await candidates_collection.doc(id).get();

    return candidate.data();
  },
};

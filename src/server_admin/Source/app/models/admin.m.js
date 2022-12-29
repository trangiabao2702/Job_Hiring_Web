const e = require("express");
const db = require("../../config/db/index"); // getDatabase
const storage = require("../../config/db/storage"); // getStorage

module.exports = {
  getAmdinbyUsername: async (email) => {
    const adminCollection = db.collection("admins");
    const snapshot = await adminCollection.where("email", "==", email).get();

    var user = null;
    snapshot.forEach((doc) => {
      user = doc.data();
    });

    return user;
  },
  getNumberAccount: async () => {
    const candidateCollection = db.collection("candidates");
    const emplpyerCollection = db.collection("employers");

    const candidate = await candidateCollection.get();
    const employer = await emplpyerCollection.get();

    var numberApproved = 0;
    var numberPending = 0;
    var numberlocked = 0;

    candidate.forEach((doc) => {
      if (doc.data().status == "approved") {
        numberApproved += 1;
      } else if (doc.data().status == "locked") {
        numberlocked += 1;
      }
    });
    employer.forEach((doc) => {
      if (doc.data().status == "approved") {
        numberApproved += 1;
      } else if (doc.data().status == "pending") {
        numberPending += 1;
      } else {
        numberlocked += 1;
      }
    });
    var data = { numberApproved, numberPending, numberlocked };
    return data;
  },
  getNumberNews: async () => {
    const recruitmentsCollection = db.collection("recruitments");

    const recruitments = await recruitmentsCollection.get();

    var numberApproved = 0;
    var numberPending = 0;
    var numberLocked = 0;
    var numberRemove = 0;

    recruitments.forEach((doc) => {
      if (doc.data().status == "approved") {
        numberApproved += 1;
      } else if (doc.data().status == "pending") {
        numberPending += 1;
      } else if (doc.data().status == "locked") {
        numberLocked += 1;
      } else {
        numberRemove += 1;
      }
    });

    var data = { numberApproved, numberPending, numberLocked, numberRemove };
    return data;
  },
  getListAccount: async (status) => {
    const candidateCollection = db.collection("candidates");
    const employerCollection = db.collection("employers");

    const candidate = await candidateCollection.where("status", "==", status).get();
    const employer = await employerCollection.where("status", "==", status).get();

    var list = [];
    var user = null;
    var stt = 0;
    candidate.forEach((doc) => {
      user = doc.data();
      stt++;
      user.typeAccount = "Ứng viên tìm việc";
      user.type = "candidate";
      user.creation_date = new Date(user.creation_date.toDate().toDateString()).toLocaleString("VN");
      user.stt = stt;
      user.doc = doc.id;
      list.push(user);
    });
    employer.forEach((doc) => {
      user = doc.data();
      stt++;
      user.typeAccount = "Nhà tuyển dụng";
      user.type = "employer";
      user.stt = stt;
      user.doc = doc.id;
      list.push(user);
    });

    return list;
  },
  getListNew: async (status) => {
    const recruitmentCollection = db.collection("recruitments");
    const employerCollection = db.collection("employers");
    const cur_vit = db.collection("curriculum_vitaes");

    const recruitment = await recruitmentCollection.where("status", "==", status).get();

    var list = [];
    var recruit = null;
    var stt = 0;
    recruitment.forEach((doc) => {
      recruit = doc.data();
      stt++;
      recruit.creation_date = new Date(recruit.creation_date.toDate().toDateString()).toLocaleString("VN");
      recruit.stt = stt;
      recruit.doc = doc.id;
      list.push(recruit);
    });

    for (let i = 0; i < list.length; i++) {
      const employer = await employerCollection.doc(list[i].belong_employer).get();
      list[i].nameEmployer = employer.data().name;
      const numberCandidate = await cur_vit.where("id_recruitment", "==", list[i].doc);
      const snapshot = await numberCandidate.count().get();
      list[i].numberCV = snapshot.data().count;
    }

    return list;
  },
  getAccountByID: async (id, type) => {
    const accountCollection = db.collection(type + "s");
    const docSnap = await accountCollection.doc(id).get();
    var state = "";
    if (docSnap.data().status == "approved") {
      state = "Đã duyệt";
    } else if (docSnap.data().status == "pending") {
      state = "Chờ duyệt";
    } else {
      state = "Đã khóa";
    }
    var user = docSnap.data();
    user.creation_date = new Date(user.creation_date.toDate().toDateString()).toLocaleString("VN");
    var account = { id, type, state, ...user };
    return account;
  },
  detail_news: async (id) => {
    const recruitmentCollection = db.collection("recruitments");
    const employerCollection = db.collection("employers");

    const recruitment = await recruitmentCollection.doc(id).get();
    var rect = recruitment.data();
    var state = "";
    if (rect.status == "approved") {
      state = "Đã duyệt";
    } else if (rect.status == "pending") {
      state = "Chờ duyệt";
    } else if (rect.status == "locked") {
      state = "Đã khóa";
    } else {
      state = "Đã xóa";
    }
    const employer = await employerCollection.doc(rect.belong_employer).get();
    rect.nameEmployer = employer.data().name;
    rect.address = employer.data().district + "," + employer.data().province;
    rect.avatar = employer.data().avatar;
    rect.creation_date = new Date(rect.creation_date.toDate().toDateString()).toLocaleString("VN");
    rect.due_date = new Date(rect.due_date.toDate().toDateString()).toLocaleString("VN");
    var recruit = { id, state, ...rect };
    return recruit;
  },
  status_account: async (id, state, type) => {
    db.collection(type + "s")
      .doc(id)
      .update({ status: state });
  },
  delete_account: async (id, type) => {
    db.collection(type + "s")
      .doc(id)
      .delete();
  },
  status_recruitment: async (id, type) => {
    await db.collection("recruitments").doc(id).update({ status: type });
    const report_collection=db.collection("reports");
    const report=await report_collection.where("id_reported", "==", id).get();
    if(type=="deleted"||type=="locked")
    {
      report.forEach((doc) => {
        db.collection("reports").doc(doc.id).update({ status: "approved" });
      });
    }
   
  },

  getAllReports: async () => {
    const rs = await db.collection("reports").get();

    let _list_reports = [];
    rs.forEach((doc) => {
      _list_reports.push(doc.data());
      _list_reports[_list_reports.length - 1].id_report = doc.id;
    });

    return _list_reports;
  },
  status_report: async (id, type) => {
    db.collection("reports").doc(id).update({ status: type });
  },
  getReportsByStatus: async (status) => {
    const rs = await db.collection("reports").get();

    let _list_reports = [];
    rs.forEach((doc) => {
      if (doc.data().status == status) {
        _list_reports.push(doc.data());
        _list_reports[_list_reports.length - 1].id_report = doc.id;
      }
    });

    return _list_reports;
  },
};

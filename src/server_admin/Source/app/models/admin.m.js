
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
    getNumberAccount: async() =>{
        const candidateCollection = db.collection('candidates');
        const emplpyerCollection=db.collection('employers')

        const candidate = await candidateCollection.get();
        const employer = await emplpyerCollection.get();

        var numberApproved=0
        var numberPending=0;
        var numberlocked=0;

        candidate.forEach(doc => {
            if(doc.data().status=="approved"){
                numberApproved+=1;
            }
            else if(doc.data().status=="locked")
            {
                numberlocked+=1;
            }
        });
        employer.forEach(doc=>{
            if(doc.data().status=="approved"){
                numberApproved+=1;
            }
            else if(doc.data().status=="pending"){
                numberPending+=1;
            }else{
                numberlocked+=1;
            }
        })
        var data={numberApproved,numberPending,numberlocked};
        return data;
    },
    getListAccount: async status =>{
        
        const candidateCollection = db.collection('candidates');
        const employerCollection = db.collection('employers');

        const candidate = await candidateCollection.where('status', '==', status).get();
        const employer=await employerCollection.where('status', '==', status).get();

        var list=[];
        var user=null;
        var stt=0;
        candidate.forEach(doc => {
            user = doc.data();
            stt++;
            user.typeAccount="Ứng viên tìm việc";
            user.type="candidate";
            user.creation_date = new Date(user.creation_date.toDate().toDateString()).toLocaleString('VN');
            user.stt=stt;
            user.doc=doc.id;
            list.push(user);
        });
        employer.forEach(doc => {
            user = doc.data();
            stt++;
            user.typeAccount="Nhà tuyển dụng";
            user.type="employer";
            user.stt=stt;
            user.doc=doc.id;
            list.push(user);
        });

        return list;
    },
    getAccountByID: async (id,type) =>{
        const accountCollection = db.collection(type+"s");
        const docSnap = await accountCollection.doc(id).get();
        var state="";
        if(docSnap.data().status=="approved")
        {
            state="Đã duyệt";
        }
        else if(docSnap.data().status=="pending"){
            state="Chờ duyệt";

        }
        else{
            state="Đã khóa";

        }
        var user=docSnap.data();
        user.creation_date = new Date(user.creation_date.toDate().toDateString()).toLocaleString('VN');
        var account = { id,type,state, ...user};
        return account;
    },
    status_account: async (id,state,type) =>{
        db.collection( type+"s").doc(id).update({status: state});
    },
    delete_account: async (id,type) =>{
        db.collection( type+"s").doc(id).delete();
    }

}
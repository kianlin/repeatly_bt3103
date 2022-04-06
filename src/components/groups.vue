<template>
    <div id="title">
        <h1>Groups</h1>
        <button id="addGroup" type="button" v-on:click="routeToAddGroup()">
            Add Group
        </button>
        <br /><br />
    </div>
    <table id="groupList">
        <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Description</th>
            <th>Teacher Name</th>
            <th>Teacher Email</th>
            <th>Access</th>
        </tr>
    </table>
    <br /><br />
</template>

<script>
import firebaseApp from '@/firebaseDetails';
import { getAuth } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    getFirestore
} from 'firebase/firestore';
import router from '@/router';

const db = getFirestore(firebaseApp);

async function getUser(email) {
    try {
        const docRef = doc(db, 'users', email);
        const docVal = await getDoc(docRef);
        if (docVal.exists()) {
            console.log('User in database!');
            return docVal.data();
        } else {
            console.log('User not registered in database!');
        }
    } catch (error) {
        console.log('User Student not working');
        console.log(error);
    }
}

export default {
    name: 'groups',
    mounted() {
        const auth = getAuth();
        const user = auth.currentUser;
        const authEmail = user.email;
        console.log(authEmail);

        async function displayGroups() {
            const currUser = await getUser(authEmail);
            var q1 = query(collection(db, 'groups'));
            if (currUser.role == 'teacher') {
                console.log('Current User Role: ' + 'teacher');
                // Find all the groups this teacher is in
                q1 = query(
                    collection(db, 'groups'),
                    where('teacherEmail', '==', authEmail)
                );
            } else {
                console.log('Current User Role: ' + 'student');
            }

            const querySnapshot = await getDocs(q1);

            let ind = 1;
            for (const docu of querySnapshot.docs) {
                let group = docu.data();
                // console.log('DOC ID like that: ' + docu.id);
                if (currUser.role != 'teacher') {
                    let student = await getDoc(
                        doc(
                            db,
                            'groups',
                            String(group.groupID),
                            'students',
                            String(authEmail)
                        )
                    );

                    if (!student.exists()) {
                        continue;
                    }
                }

                let table = document.getElementById('groupList');
                let row = table.insertRow(ind);

                let name = group.groupID;
                let description = group.description;
                let teacherName = group.teacherName;
                let teacherEmail = group.teacherEmail;

                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);

                cell1.style.border = '1px solid #000';
                cell2.style.border = '1px solid #000';
                cell3.style.border = '1px solid #000';
                cell4.style.border = '1px solid #000';
                cell5.style.border = '1px solid #000';
                cell6.style.border = '1px solid #000';

                cell1.innerHTML = ind;
                cell2.innerHTML = name;
                cell3.innerHTML = description;
                cell4.innerHTML = teacherName;
                cell5.innerHTML = teacherEmail;

                const accessButt = document.createElement('button');
                accessButt.className = 'bwt';
                accessButt.id = String(ind);
                accessButt.innerHTML = 'Access';
                accessButt.onclick = async function () {
                    try {
                        sessionStorage.setItem('currGroup', name);
                        await router.push({ name: 'viewGroup' });
                    } catch (error) {
                        console.log('Access group button error');
                        console.log(error);
                    }
                };
                cell6.appendChild(accessButt);
                ind += 1;
            }
        }
        displayGroups();
    },
    methods: {
        async routeToAddGroup() {
            await this.$router.push({ name: 'addGroup' });
        }
    }
};
</script>

<style scoped>
table {
    font-family: 'Times New Roman';
    color: #222c4b;
    border-collapse: collapse;
    width: 100%;
    background-color: white;
    border: 1px solid black;
}

tr:nth-child(even) {
    background-color: white;
}

th,
td {
    border: 1px solid black;
    text-align: center;
    padding: 8px;
    background-color: white;
}

th {
    background-color: black;
    color: white;
}
</style>

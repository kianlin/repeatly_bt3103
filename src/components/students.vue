<template>
    <div id="title">
        <h1>Students</h1>
        <button id="addStudent" type="button" v-on:click="routeToAddStudent()">
            Add Student
        </button>
        <br /><br />
    </div>
    <table id="studentList">
        <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Groups</th>
        </tr>
    </table>
    <br /><br />
</template>

<script>
import firebaseApp from '@/firebaseDetails';
import { getAuth } from 'firebase/auth';
import {
    collection,
    getDocs,
    query,
    where,
    getFirestore
} from 'firebase/firestore';

const db = getFirestore(firebaseApp);

export default {
    name: 'students',

    mounted() {
        const auth = getAuth();
        const user = auth.currentUser;
        const authEmail = user.email;
        console.log(authEmail);

        async function displayStudents() {
            // Find all the groups this teacher is in
            const q1 = query(
                collection(db, 'groups'),
                where('teacherEmail', '==', authEmail)
            );
            const querySnapshot = await getDocs(q1);

            let ind = 1;
            var allGroups = [];
            querySnapshot.forEach((doc) => {
                let groupID = doc.data().groupID;
                allGroups.push(groupID);
            });

            for (const grpID of allGroups) {
                let allStudents = await getDocs(
                    collection(db, 'groups', grpID, 'students')
                );
                allStudents.forEach((doc) => {
                    let student = doc.data();
                    console.log('Students: ' + student);
                    var table = document.getElementById('studentList');
                    var row = table.insertRow(ind);

                    var role = student.role;

                    // If the user is a teacher, exclude from the output
                    if (role == 'teacher') {
                        return;
                    }

                    var name = student.username;
                    var email = student.email;
                    var groups = grpID;

                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);

                    cell1.style.border = '1px solid #000';
                    cell2.style.border = '1px solid #000';
                    cell3.style.border = '1px solid #000';
                    cell4.style.border = '1px solid #000';
                    cell5.style.border = '1px solid #000';

                    cell1.innerHTML = ind;
                    cell2.innerHTML = name;
                    cell3.innerHTML = email;
                    cell4.innerHTML = role;
                    cell5.innerHTML = groups;

                    ind += 1;
                });
            }
        }
        displayStudents();
    },
    methods: {
        async routeToAddStudent() {
            await this.$router.push({ name: 'addStudent' });
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

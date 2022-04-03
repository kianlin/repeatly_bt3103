<template>
    <div id="titleHead">
        <h1 id="groupTitle">This is my group title</h1>
        <div class="details">
            <h4 id="groupDescription">Group description: NIL</h4>
            <h4 id="teacherName">Teacher: NIL</h4>
            <h4 id="teacherEmail">Contact details: NIL</h4>
        </div>
        <div class="buttonSet1">
            <button id="deleteGroup" type="button" v-on:click="deleteGroup()">
                Delete Group
            </button>
            <button id="editGroup" type="button" v-on:click="edit()">
                Edit Group
            </button>
        </div>
    </div>
    <br /><br />
    <div id="deckBody">
        <h2 id="deckTitle">Decks</h2>
        <table id="allDecks">
            <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Total Cards</th>
                <th>Needs Recaping</th>
                <th>Uncertain Cards</th>
                <th>Estimated Time</th>
                <th>Tag</th>
                <th>Access</th>
            </tr>
        </table>
    </div>
    <br /><br />
    <div id="studentBody">
        <h2 id="studentTitle">Students</h2>
        <table id="allStudents">
            <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Groups</th>
            </tr>
        </table>
    </div>
    <br /><br />
    <div class="buttonSet2">
        <button id="back" type="button" v-on:click="back()">Back</button>
    </div>
</template>

<script>
import firebaseApp from '@/firebaseDetails';
import { getAuth } from 'firebase/auth';
import {
    collection,
    doc,
    deleteDoc,
    getDoc,
    getDocs,
    getFirestore
} from 'firebase/firestore';
import router from '@/router';

const auth = getAuth();
const db = getFirestore(firebaseApp);

export default {
    name: 'viewGroup',
    mounted() {
        const user = auth.currentUser;
        const authEmail = user.email;
        console.log(authEmail);

        async function displayDetails() {
            const grpID = sessionStorage.getItem('currGroup');
            console.log('DOC ID: ' + grpID);

            // Display Group Details
            const groupObj = await getDoc(doc(db, 'groups', String(grpID)));

            const groupDetails = groupObj.data();

            document.getElementById('groupTitle').innerHTML = String(
                groupDetails.groupID
            );
            document.getElementById('groupDescription').innerHTML =
                'Group description: ' + String(groupDetails.description);
            document.getElementById('teacherName').innerHTML =
                'Teacher: ' + String(groupDetails.teacherName);
            document.getElementById('teacherEmail').innerHTML =
                'Contact details: ' + String(groupDetails.teacherEmail);

            // List all Decks created for this Group
            let userDecks = await getDocs(
                collection(db, 'groups', String(grpID), 'decks')
            );

            console.log('test group student: ' + userDecks);

            if (!userDecks.empty) {
                var idList = [];
                let deckIndex = 1;
                userDecks.forEach((docs) => {
                    let deck = docs.data();
                    let deckId = docs.id;
                    idList.push(deckId);
                    const table = document.getElementById('allDecks');
                    const row = table.insertRow(deckIndex);

                    const title = deck.title;
                    const estimatedTime = deck.estimatedTime;
                    const needsRecapping = deck.needsRecapping;
                    const tag = deck.tag;
                    const totalCards = deck.totalCards;
                    const uncertainCards = deck.uncertainCards;

                    const cell1 = row.insertCell(0);
                    const cell2 = row.insertCell(1);
                    const cell3 = row.insertCell(2);
                    const cell4 = row.insertCell(3);
                    const cell5 = row.insertCell(4);
                    const cell6 = row.insertCell(5);
                    const cell7 = row.insertCell(6);
                    const cell8 = row.insertCell(7);

                    cell1.style.border = '1px solid #000';
                    cell2.style.border = '1px solid #000';
                    cell3.style.border = '1px solid #000';
                    cell4.style.border = '1px solid #000';
                    cell5.style.border = '1px solid #000';
                    cell6.style.border = '1px solid #000';
                    cell7.style.border = '1px solid #000';
                    cell8.style.border = '1px solid #000';

                    cell1.innerHTML = deckIndex;
                    cell2.innerHTML = title;
                    cell3.innerHTML = totalCards;
                    cell4.innerHTML = needsRecapping;
                    cell5.innerHTML = uncertainCards;
                    cell6.innerHTML = estimatedTime;
                    cell7.innerHTML = tag;

                    const accessButt = document.createElement('button');
                    accessButt.className = 'bwt';
                    accessButt.id = String(deckIndex);
                    accessButt.innerHTML = 'Access';
                    accessButt.onclick = async function () {
                        try {
                            sessionStorage.setItem(
                                'deckId',
                                String(idList[parseInt(accessButt.id) - 1])
                            );
                            await router.push({ name: 'viewDeck' });
                        } catch (error) {
                            console.log('Access deck button error');
                            console.log(error);
                        }
                    };
                    cell8.appendChild(accessButt);
                    deckIndex++;
                });
            }

            // List all the Students in this Group
            let groupStudents = await getDocs(
                collection(db, 'groups', String(grpID), 'students')
            );
            // console.log('test group student: ' + groupStudents);

            let studentIndex = 1;

            groupStudents.forEach((doc) => {
                let student = doc.data();
                // console.log('Students: ' + student);
                var table = document.getElementById('allStudents');
                var row = table.insertRow(studentIndex);

                var role = student.role;

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

                cell1.innerHTML = studentIndex;
                cell2.innerHTML = name;
                cell3.innerHTML = email;
                cell4.innerHTML = role;
                cell5.innerHTML = groups;

                studentIndex++;
            });
        }

        displayDetails();
    },
    methods: {
        async back() {
            await this.$router.push({ name: 'groupsPage' });
        },
        async deleteGroup() {
            try {
                const groupID = sessionStorage.getItem('currGroup');
                console.log('DOC ID: ' + groupID);
                await deleteDoc(doc(db, 'groups', String(groupID)));
                console.log('Group Deleted Successfully');
                await this.$router.push({ name: 'groupsPage' });
            } catch (error) {
                console.log('Group Deletion Error');
                console.log(error);
            }
        },
        async edit() {
            await this.$router.push({ name: 'editGroup' });
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

<template>
    <div id="titleHead">
        <h1 id="currGroupTitle">This is my group title</h1>
        <div class="details">
            <h4 id="currGroupDescription">Group description: NIL</h4>
            <h4 id="currTeacherName">Teacher: NIL</h4>
            <h4 id="currTeacherEmail">Contact details: NIL</h4>
        </div>
        <form id="groupForm">
            <h1 class="titleofDiv">Edit Details</h1>
            <div class="formli">
                <label for="groupDescription">Description: </label>
                <textarea
                    name="groupDescription"
                    id="groupDescription"
                    cols="40"
                    rows="5"
                ></textarea>
                <br /><br />
            </div>
            <div class="save">
                <button id="savebutton" type="button" v-on:click="save()">
                    Save</button
                ><br /><br />
            </div>
        </form>
    </div>
    <button id="backToHome" type="button" v-on:click="back()">Back</button>
</template>

<script>
import firebaseApp from '@/firebaseDetails';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore(firebaseApp);

export default {
    name: 'editGroup',
    mounted() {
        const user = auth.currentUser;
        const authEmail = user.email;
        console.log(authEmail);

        async function displayDetails() {
            const grpID = sessionStorage.getItem('currGroup');
            console.log('DOC ID: ' + grpID);

            // Display Current Group Details
            const groupObj = await getDoc(doc(db, 'groups', String(grpID)));

            const groupDetails = groupObj.data();

            document.getElementById('currGroupTitle').innerHTML = String(
                groupDetails.groupID
            );
            document.getElementById('currGroupDescription').innerHTML =
                'Group description: ' + String(groupDetails.description);
            document.getElementById('currTeacherName').innerHTML =
                'Teacher: ' + String(groupDetails.teacherName);
            document.getElementById('currTeacherEmail').innerHTML =
                'Contact details: ' + String(groupDetails.teacherEmail);
        }
        displayDetails();
    },
    methods: {
        async save() {
            try {
                const grpID = sessionStorage.getItem('currGroup');
                const groupDescription = document
                    .getElementById('groupDescription')
                    .value.toString();
                const updateRef = doc(db, 'groups', grpID);
                console.log(updateRef);
                await updateDoc(updateRef, {
                    description: groupDescription
                });
                document.getElementById('groupDescription').value = '';
                await this.$router.push({ name: 'groupsPage' });
            } catch (error) {
                console.log('Edit group failed');
                console.log(error);
            }
        },
        async back() {
            await this.$router.push({ name: 'viewGroup' });
        }
    }
};
</script>

<style></style>

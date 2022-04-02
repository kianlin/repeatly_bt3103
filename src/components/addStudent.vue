<template>
    <div id="firstContainer">
        <form id="studentGroupForm">
            <h1 class="titleofDiv">Add Student</h1>
            <div class="formli">
                <label for="studentEmail">Student Email:</label>
                <input
                    type="text"
                    id="studentEmail"
                    required=""
                    placeholder="Enter student email"
                />
                <!-- <div class="groupSelection"> -->
                <label for="groups">Groups:</label>
                <select id="assignedGroup" name="assignedGroup">
                    <option>BT3103</option>
                    <option>group2</option>
                </select>
                <br /><br />
                <!-- </div> -->
                <div class="save">
                    <button id="savebutton" type="button" v-on:click="save()">
                        Add Student</button
                    ><br /><br />
                </div>
            </div>
        </form>
    </div>
    <button id="backToHome" type="button" v-on:click="back()">Back</button>
</template>

<script>
import firebaseApp from '@/firebaseDetails';
// import { getAuth } from 'firebase/auth';
import {
    doc,
    collection,
    addDoc,
    getDoc,
    getFirestore
} from 'firebase/firestore';

// const auth = getAuth();
const db = getFirestore(firebaseApp);

async function getStudent(email) {
    try {
        const docRef = doc(db, 'users', email);
        const docVal = await getDoc(docRef);
        return docVal.data();
    } catch (error) {
        console.log('Display Student not working');
        console.log(error);
    }
}

export default {
    name: 'addStudent',
    methods: {
        async save() {
            try {
                // const email = document.getElementById('studentEmail').value;
                const email = document.getElementById('studentEmail').value;
                const student = await getStudent(email);
                console.log(student);
                const groupName = document
                    .getElementById('assignedGroup')
                    .value.toString();
                // const userEmail = auth.currentUser.email;
                await addDoc(
                    collection(db, 'groups', String(groupName), 'students'),
                    {
                        email: email,
                        username: student.username,
                        role: student.role
                    }
                );
                await this.$router.push({ name: 'Dashboard' });
            } catch (error) {
                console.log(error);
                console.log('Add Student failed');
            }
        },
        async back() {
            await this.$router.push({ name: 'Dashboard' });
        }
    }
};
</script>

<style></style>

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
                <div class="groupSelection">
                    <label for="groups">Groups:</label>
                    <input
                        type="text"
                        id="assignedGroup"
                        required=""
                        placeholder="Enter group name"
                    />
                    <!-- <select id="assignedGroup" name="assignedGroup">
                        <option :selected="true">Choose Group</option>
                        <option
                            v-for="group in groups"
                            :value="group"
                            v-bind:key="group"
                        >
                            {{ group }}
                        </option>
                    </select> -->
                    <br /><br />
                </div>
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
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

async function getUser(email) {
    try {
        const docRef = doc(db, 'users', email);
        const docVal = await getDoc(docRef);
        if (docVal.exists()) {
            console.log('Student in database!');
            return docVal.data();
        } else {
            console.log('Student not registered in database!');
        }
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
                const email = document.getElementById('studentEmail').value;
                const student = await getUser(email);
                console.log('Student found: ' + student);
                const groupName = document
                    .getElementById('assignedGroup')
                    .value.toString();

                // Check if student is already in the group. Else, add them in.
                try {
                    const groupRef = doc(db, 'groups', groupName);
                    const groupSnap = await getDoc(groupRef);
                    if (groupSnap.exists()) {
                        const studentRef = doc(
                            db,
                            'groups',
                            groupName,
                            'students',
                            email
                        );
                        const studentSnap = await getDoc(studentRef);
                        if (studentSnap.exists()) {
                            console.log(
                                'Student already enrolled in ' + groupName
                            );
                        } else {
                            const newStudent = await setDoc(
                                doc(db, 'groups', groupName, 'students', email),
                                {
                                    email: email,
                                    username: student.username,
                                    role: student.role
                                }
                            );
                            console.log(newStudent);
                            console.log(
                                'New student enrolled to Group: ' + groupName
                            );
                        }
                    } else {
                        console.log('Group (' + groupName + ') do not exists!');
                        await this.$router.push({ name: 'studentsPage' });
                    }
                } catch (error) {
                    console.log(
                        'Student failed to be enrolled to Group: ' + groupName
                    );
                    console.log(error);
                }
                await this.$router.push({ name: 'studentsPage' });
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

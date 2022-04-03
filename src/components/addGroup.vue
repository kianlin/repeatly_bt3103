<template>
    <div id="firstContainer">
        <form id="groupForm">
            <h1 class="titleofDiv">Add Group</h1>
            <div class="formli">
                <label for="teacherEmail">Teacher Email: </label>
                <input
                    type="text"
                    id="teacherEmail"
                    required=""
                    placeholder="Enter teacher email"
                />
                <br /><br />
                <div class="groupSelection">
                    <label for="newGroup">Group: </label>
                    <input
                        type="text"
                        id="newGroup"
                        required=""
                        placeholder="Enter group name"
                    />
                    <br /><br />
                    <label for="groupDescription">Description: </label>
                    <textarea
                        name="groupDescription"
                        id="groupDescription"
                        cols="40"
                        rows="5"
                        placeholder="Enter group description"
                    ></textarea>
                    <br /><br />
                </div>
                <div class="save">
                    <button id="savebutton" type="button" v-on:click="save()">
                        Add Group</button
                    ><br /><br />
                </div>
            </div>
        </form>
    </div>
    <button id="backToHome" type="button" v-on:click="back()">Back</button>
</template>

<script>
import firebaseApp from '@/firebaseDetails';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

async function getUser(email) {
    try {
        const docRef = doc(db, 'users', email);
        const docVal = await getDoc(docRef);
        if (docVal.exists()) {
            console.log('Teacher in database!');
            return docVal.data();
        } else {
            console.log('Teacher not registered in database!');
        }
    } catch (error) {
        console.log('Display Group not working');
        console.log(error);
    }
}

export default {
    name: 'addGroup',
    methods: {
        async save() {
            try {
                const email = document.getElementById('teacherEmail').value;
                const teacher = await getUser(email);
                console.log('Teacher found: ' + teacher);
                const groupName = document
                    .getElementById('newGroup')
                    .value.toString();
                const groupDescription = document
                    .getElementById('groupDescription')
                    .value.toString();

                try {
                    const groupRef = doc(db, 'groups', groupName);
                    const groupSnap = await getDoc(groupRef);
                    if (!groupSnap.exists()) {
                        const newGroup = await setDoc(
                            doc(db, 'groups', groupName),
                            {
                                groupID: groupName,
                                description: groupDescription,
                                teacherEmail: email,
                                teacherName: teacher.username
                            }
                        );
                        console.log(newGroup);
                        console.log('New group created: ' + groupName);
                    } else {
                        console.log(
                            'Group (' + groupName + ') already created!'
                        );
                        await this.$router.push({ name: 'groupsPage' });
                    }
                } catch (error) {
                    console.log('Group failed to be created: ' + groupName);
                    console.log(error);
                }
                await this.$router.push({ name: 'groupsPage' });
            } catch (error) {
                console.log(error);
                console.log('Add Group failed');
            }
            document.getElementById('teacherEmail').value = '';
            document.getElementById('newGroup').value = '';
            document.getElementById('groupDescription').value = '';
        },
        async back() {
            await this.$router.push({ name: 'groupsPage' });
        }
    }
};
</script>

<style></style>

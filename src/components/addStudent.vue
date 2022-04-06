<template>
    <div id="firstContainer">
        <form id="studentGroupForm" ref="studentGroupForm">
            <h1 class="titleofDiv">Add Student</h1>
            <div class="formli">
                <label for="studentEmail">Student Email: </label>
                <input
                    type="text"
                    id="studentEmail"
                    required=""
                    placeholder="Enter student email"
                />
                <br /><br />
                <div class="groupSelection">
                    <label for="groups">Group: </label>
                    <input
                        type="text"
                        id="assignedGroup"
                        required=""
                        placeholder="Enter group name"
                    />
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
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc
} from 'firebase/firestore';

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
        console.log('Display User not working');
        console.log(error);
    }
}

async function copyDeck(grpID) {
    var cardDict = {};
    try {
        const q1 = query(collection(db, 'groups', grpID, 'decks'));
        const allDecks = await getDocs(q1);
        // console.log('Decks Exsits: ' + allDecks.exists());

        var deckIndex = 1;
        for (const deck of allDecks.docs) {
            console.log('Checkpoint 1');
            let currDeck = deck.data();
            let deckKey = 'd' + String(deckIndex);
            cardDict[deckKey] = { data: currDeck, cards: {} };
            console.log('Checkpoint 2');
            // Get Cards in the Deck
            const q2 = query(
                collection(db, 'groups', grpID, 'decks', deck.id, 'cards')
            );
            const allCards = await getDocs(q2);
            var cardIndex = 1;
            for (const card of allCards.docs) {
                console.log('Checkpoint 3');
                let currCard = card.data();
                let cardKey = 'c' + String(cardIndex);
                cardDict[deckKey]['cards'][cardKey] = currCard;
                cardIndex++;
            }
            deckIndex++;
        }
        console.log('Deck copying from ' + grpID + ' completed successfully');
        return cardDict;
    } catch (error) {
        console.log('Failed to copy ' + grpID + ' decks');
        console.log(error);
    }
}

function reset() {
    this.$refs.studentGroupForm.reset();
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
                console.log('Group Name found: ' + groupName);
                // Check if student is already in the group. Else, add them in.
                try {
                    const groupRef = doc(db, 'groups', groupName);
                    const groupSnap = await getDoc(groupRef);
                    console.log('Student exists: ' + groupSnap.exists());
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

                            // Copy existing groups deck into users account
                            const groupDecks = await copyDeck(groupName);
                            console.log('Copy Deck Done!');
                            let totalDecks = Object.keys(groupDecks).length;
                            for (let i = 1; i <= totalDecks; i++) {
                                var currDeck = 'd' + String(i);
                                var deckData = groupDecks[currDeck]['data'];
                                console.log(
                                    'Current Deck ' + currDeck + ' Done!'
                                );

                                // Add Deck
                                const newDeckAdded = await addDoc(
                                    collection(db, 'users', email, 'decks'),
                                    {
                                        title: deckData.title,
                                        tag: deckData.tag,
                                        description: deckData.description,
                                        estimatedTime: deckData.estimatedTime,
                                        needsRecapping: 0,
                                        totalCards: deckData.totalCards,
                                        uncertainCards: 0
                                    }
                                );

                                // Add Cards (if any)
                                if ('cards' in groupDecks[currDeck]) {
                                    let totalCards = Object.keys(
                                        groupDecks[currDeck]['cards']
                                    ).length;
                                    console.log(
                                        'NEW DECK ID: ' + newDeckAdded.id
                                    );
                                    for (let j = 1; j <= totalCards; j++) {
                                        var currCard = 'c' + String(j);
                                        var cardData =
                                            groupDecks[currDeck]['cards'][
                                                currCard
                                            ];
                                        const newCardAdded = await addDoc(
                                            collection(
                                                db,
                                                'users',
                                                email,
                                                'decks',
                                                newDeckAdded.id,
                                                'cards'
                                            ),
                                            {
                                                question: cardData.question,
                                                answer: cardData.answer,
                                                title: cardData.title,
                                                boxType: 1,
                                                firstAnswered: false,
                                                isWrong: false
                                            }
                                        );
                                        console.log(
                                            'NEW CARD ID: ' + newCardAdded.id
                                        );
                                    }
                                }
                            }
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
                reset();
            } catch (error) {
                console.log(error);
                console.log('Add Student failed');
            }
            document.getElementById('studentEmail').value = '';
            document.getElementById('assignedGroup').value = '';
        },
        async back() {
            await this.$router.push({ name: 'studentsPage' });
        }
    }
};
</script>

<style></style>

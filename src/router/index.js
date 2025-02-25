import { createRouter, createWebHistory } from 'vue-router';
import login from '@/views/login';
import registration from '@/views/registration';
import resetPassword from '@/views/resetPassword';
import userDashboard from '@/views/userDashboard';
import Home from '@/screens/home';
import overallDashboard from '@/screens/overallDashboard';
import deckCreation from '@/views/deckCreation';
import deckDetails from '@/views/deckDetails';
import cardsManagement from '@/views/cardsManagement';
import studentsPage from '@/views/studentsPage';
import studentAddition from '@/views/studentAddition';
import groupsPage from '@/views/groupsPage';
import groupAddition from '@/views/groupAddition';
import groupDetails from '@/views/groupDetails';
import groupEdit from '@/views/groupEdit';
import groupDeckCreation from '@/views/groupDeckCreation';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/login',
        children: [
            {
                path: '/login',
                name: 'login',
                component: login
            },
            {
                path: '/registration',
                name: 'register',
                component: registration
            },
            {
                path: '/resetPassword',
                name: 'resetPassword',
                component: resetPassword
            }
        ]
    },
    {
        path: '/Dashboard',
        name: 'Dashboard',
        component: overallDashboard,
        redirect: '/userDash',
        children: [
            {
                path: '/userDash',
                name: 'userDash',
                component: userDashboard
            }
        ]
    },
    {
        path: '/createDeck',
        name: 'createDeck',
        component: deckCreation
    },
    {
        path: '/viewDeck',
        name: 'viewDeck',
        component: deckDetails
    },
    {
        path: '/editCards',
        name: 'cardsManagement',
        component: cardsManagement
    },
    {
        path: '/students',
        name: 'studentsPage',
        component: studentsPage
    },
    {
        path: '/addStudent',
        name: 'addStudent',
        component: studentAddition
    },
    {
        path: '/groups',
        name: 'groupsPage',
        component: groupsPage
    },
    {
        path: '/addGroup',
        name: 'addGroup',
        component: groupAddition
    },
    {
        path: '/viewGroup',
        name: 'viewGroup',
        component: groupDetails
    },
    {
        path: '/editGroup',
        name: 'editGroup',
        component: groupEdit
    },
    {
        path: '/createGroupDeck',
        name: 'createGroupDeck',
        component: groupDeckCreation
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;

<template>
    <router-link to="/userDash">Back Home</router-link>
    <h1>This is the Groups Page</h1>
    <!-- <dashboard></dashboard> -->
    <groups></groups>
</template>

<script>
// import dashboard from "@/components/dashboard";
// import dashboardDeckDisplay from "@/components/dashboardDeckDisplay";
import groups from '@/components/groups';

export default {
    name: 'groupsPage',
    components: {
        groups
    }
};
</script>

<style scoped></style>

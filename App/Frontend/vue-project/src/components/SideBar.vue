<!-- This is the side bar component that is present in the common UI of the app

  @author Jacky Foo <jfoo0016@student.monash.edu>
  
  Created at     : 7-04-2022 12:00
  Last modified  : 20-10-2022 23:30
-->

<style>
@import "../assets/styles/sidebar.css";
</style>

<template>
  <v-navigation-drawer :value="drawer" app class="blue darken-4" dark temporary>
    <v-img height="100" class="blue darken-4 pa-4" src="../assets/logo-monash.jpg" />

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6"> SIMP </v-list-item-title>
        <v-list-item-subtitle> by simps for simps </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <!-- List of options for users to choose from at the side bar-->
    <v-list nav>
      <div v-if="this.$store.state.user.role === 'ADMIN' || this.$store.state.user.role == 'COADMIN' ">
        <v-list-item
          v-for="item in adminItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <div v-else-if="this.$store.state.user.role === 'STUDENT'">
        <v-list-item
          v-for="item in studentItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <div v-else-if="this.$store.state.user.role === 'EMPLOYER'">
        <v-list-item
          v-for="item in employerItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <div v-else>
        <v-list-item
          v-for="item in userItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>

    <template v-slot:append>
      <div class="pa-8">
        <a
          class="PDPA"
          href="https://www.monash.edu.my/__data/assets/pdf_file/0008/517355/Personal-Data-Protection-Notice-MUM.pdf"
          target="_blank" 
          rel="noopener noreferrer"
        >
          Data Protection Notice
        </a>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["drawer"],
  data: () => ({
    adminItems: [
      { title: "Home", icon: "mdi-view-dashboard", path: "/homepage" },
      { title: "Details", icon: "mdi-account", path: "/admindetailsformpage" },
      { title: "Appication Listing", icon: "mdi-briefcase", path: "/empapplicationlist" },
      { title: "Advertisement Listing", icon: "mdi-briefcase", path: "/empjoblist" },
      {
        title: "Admin Dashboard",
        icon: "mdi-help-box",
        path: "/admindashboard",
      },
      {
        title: "Students",
        icon: "mdi-human-handsup",
        path: "/studentList",
      },
      {title: "Help", icon: "mdi-help-circle", path: "/help"}
    ],
    studentItems: [
      { title: "Home", icon: "mdi-view-dashboard", path: "/homepage" },
      { title: "Details", icon: "mdi-face-man-profile", path: "/detailsform" },
      { title: "Reports", icon: "mdi-clipboard", path: "/reports"},
      { title: "Applications", icon: "mdi-file", path: "/studentApplications"},
      {title: "Help", icon: "mdi-help-circle", path: "/help"}
    ],
    employerItems: [
      { title: "Home", icon: "mdi-view-dashboard", path: "/homepage" },
      {
        title: "Add Advertisement",
        icon: "mdi-note-plus",
        path: "/jobadvertisement",
      },
      {
        title: "Profile",
        icon: "mdi-account",
        path: "/empprofile",
      },
      { title: "MyJobs", icon: "mdi-help-box", path: "/myjobs" },
      {title: "Help", icon: "mdi-help-circle", path: "/help"}
    ],
    userItems: [
      { title: "SignUp/Login", icon: "mdi-image", path: "/login" },
    ],
  }),
};
</script>

<style scoped></style>

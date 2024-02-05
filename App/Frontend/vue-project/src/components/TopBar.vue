<!-- This is the top bar component present in the common UI of the app

  @author Jacky Foo <jfoo0016@student.monash.edu>
  
  Created at     : 7-04-2022 12:00
  Last modified  : 20-10-2022 23:30
-->

<template>
<!-- <v-app-bar app> -->
  <v-app-bar app elevation="6" class="blue darken-4" dark>
    <v-app-bar-nav-icon @click="$emit('drawer-event')"></v-app-bar-nav-icon>
    <v-app-bar-title>Student Internship Management Program (SIMP)</v-app-bar-title>
    <v-spacer></v-spacer>
    
    <v-menu offset-y>
      <template v-slot:activator="{ attrs, on }">
        <span style="cursor: pointer" v-bind="attrs" v-on="on">
          <v-chip link>
            <v-badge dot bottom color="green" offset-y="10" offset-x="10">
              <v-avatar size="40">
                <img v-bind:src="displayData.profilePic" />
              </v-avatar>
            </v-badge>
            <span class="ml-3">{{ displayData.fullname }}</span>
          </v-chip>
        </span>
      </template>
      <v-list width="250" class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img v-bind:src="displayData.profilePic" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{
              displayData.firstName + " " + displayData.lastName
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ displayData.role }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <div v-if="$store.state.user.auth">
        <v-list-item
          link
          v-for="(menu, i) in menus"
          :key="i"
          @click="menuActionClick(menu.action)"
        >
          <v-list-item-icon>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ menu.title }}
          </v-list-item-title>
        </v-list-item>
      </div>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
// import axios from "axios";

export default {
  emits: ["drawer-event"],
  computed: {
    displayData() {
      return this.$store.state.user;
    },
  },
  data: () => ({
    // drawer: null,
    menus: [
      { title: "Logout", icon: "mdi-logout", action: "logout" }
    ],
  }),
  methods: {
    menuActionClick(action) {
      if (action == "logout") {
        this.$store.state.user.auth = false;
        this.$store.state.user.token = null;
        this.$store.state.user.email = null;
        this.$store.state.user.firstName = "Guest";
        this.$store.state.user.lastName = "User";
        this.$store.state.user.profilePic = "https://randomuser.me/api/portraits/women/81.jpg";
        this.$store.state.user.id = null;
        this.$store.state.user.role = null;
        this.$router.push({ name: "login" });
      }
    },
    checkUserLogin() {
      if (this.$store.state.user.role && this.$store.state.email) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    // let userData;
    // //get the token from backend
    // await axios
    //   .get(process.env.VUE_APP_BACKEND_LINK+"visitor/users/resolve", {
    //     withCredentials: true,
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     if (res.data.length === 0) {
    //       //User is redirected to signon page to signin again due to token being expired.
    //       this.$router.push({ name: "signup" });
    //     } else {
    //       userData = res.data;
    //       console.log(userData);
    //       //Setting important data in vuex global store
    //       this.$store.state.user.auth = true;
    //       this.$store.state.user.token = userData.token;
    //       this.$store.state.user.email = userData.user.email;
    //       this.$store.state.user.firstName = userData.user.given_name;
    //       this.$store.state.user.lastName = userData.user.family_name;
    //       this.$store.state.user.profilePic = userData.user.picture;
    //       this.$store.state.user.role = userData.userDb[0].userRole;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.$router.push({ name: "signup" });
    //   });
  },
};
</script>

<style scoped></style>

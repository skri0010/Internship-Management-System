<!-- This is the main component for an Admin Profile Page

  @author Suchit Krishna <skri0010@student.monash.edu>
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<template>

    <v-container fluid id="user-profile" tag="section">
      <v-row justify="center">
        <v-col cols="12" md="7">
          <!-- User info card -->
          <AdminProfile></AdminProfile>
  
          <!-- Options card -->
          <AdminDBCard></AdminDBCard>
  
        </v-col>
      </v-row>
      <v-row>
      </v-row>
      <!-- <FooterCard></FooterCard> -->
    </v-container>
  
    
  </template>
  
  
  <script>
    import AdminProfile from './AdminProfile.vue'
    import axios from 'axios'
    import AdminDBCard from './AdminDBCard.vue';
  
    export default {
      data: () => ({
      }),
      watch: {
      },
      methods: {
      },
      components: {AdminProfile, AdminDBCard},
      async mounted() {
           let userData;
  
      //get the token from backend
      await axios
        .get(process.env.VUE_APP_BACKEND_LINK+"visitor/users/resolve", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.length === 0) {
            //User is redirected to signon page to signin again due to token being expired.
            // this.$router.push({ name: "signup" });
          } else {
            userData = res.data;
            console.log(userData)
            //Setting important data in vuex global store
            this.$store.state.user.auth = true;
            this.$store.state.user.token = userData.token;
            this.$store.state.user.email = userData.user.email;
            this.$store.state.user.firstName = userData.user.given_name;
            this.$store.state.user.lastName = userData.user.family_name;
            this.$store.state.user.profilePic = userData.user.picture;
            this.$store.state.user.role = userData.userDb[0].userRole;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$router.push({ name: "signup" });
        });
      }
    }
  </script>
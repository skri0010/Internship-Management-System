<!-- This is details form page also known as the profile page of the student.
     Basic information about the student, his skills and experiences are displayed on the page.

  @author Jacky Foo <jfoo0016@student.monash.edu>
  
  Created at     : 7-04-2022 19:40
  Last modified  : 20-10-2022 21:07
-->
<template>
  <!-- Container for user profile -->
  <v-container fluid id="user-profile" tag="section">
    <v-row justify="center">
      <v-col cols="12" md="7">
        <!-- User info card -->
        <ProfileCard></ProfileCard>

        <!-- Skills card -->
        <SkillsCard></SkillsCard>

        <!-- Experiences card -->
        <ExperiencesCard></ExperiencesCard>

      </v-col>
    </v-row>
    <v-row>
    </v-row>
    <FooterCard></FooterCard>
  </v-container>

  
</template>


<script>
  import ProfileCard from '../ProfileCard.vue'
  import SkillsCard from '../SkillsCard.vue'
  import ExperiencesCard from '../ExperiencesCard.vue'
  import FooterCard from '../FooterCard.vue';
  import axios from 'axios'

  export default {
    data: () => ({
    }),
    watch: {
    },
    methods: {
    },
    components: { ProfileCard, SkillsCard, ExperiencesCard, FooterCard},
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
<!-- This is the Signup/login component

  @author Jacky Foo <jfoo0016@student.monash.edu>
  Reference: Vuejs - Vuetify UI Design, Login app Modern - Log In, Sign Up with Transition, Web Design - Auth
  https://www.youtube.com/watch?v=XPOyEUpMGPQ&ab_channel=AAEIdeaPro

  Created at     : 06-04-2022 17:30
  Last modified  : 07-04-2022 15:30
-->
<template>
  <v-app id="inspire">
    <main id="intro">
      <!--  -->
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="100">
            <v-card class="elevation-6 mt-10">
              <v-window v-model="step">
                <!-- LOGIN PAGE SECTION -->
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card-text class="mt-12">
                        <div style="text-align: center; padding-top: 130px">
                          <h3 class="text-center">Sign in using Google</h3>
                          <h6 class="text-center grey--text">
                            Discover a world of endless possibilities
                          </h6>
                          <v-row align="center" justify="center">
                            <v-col cols="12" sm="8">
                              <div
                                class="d-flex justify-center align-center mx-10 mb-16"
                              >
                                <GoogleLogin
                                  :params="params"
                                  :renderParams="renderParams"
                                  :onSuccess="onSuccess"
                                >
                                </GoogleLogin>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" md="6" class="blue darken-4">
                      <div style="text-align: center; padding: 180px 0">
                        <v-card-text class="white--text">
                          <h3 class="text-center">Are you an Employer?</h3>
                          <h3 class="text-center">Submit an application now</h3>
                          <h6 class="text-center">Let's get you all set up</h6>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn tile outlined dark v-on:click="toSignUp()"
                            >APPLY NOW</v-btn
                          >
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
        <FooterCard></FooterCard>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import axios from "axios";
import FooterCard from "../FooterCard.vue";
import GoogleLogin from "vue-google-login";

//import EventBus from "../main.js"
export default {
  components: {
    FooterCard,
    GoogleLogin,
  },
  data: () => ({
    drawer: null,
    step: 1,
    items: [
      { title: "Dashboard", icon: "mdi-view-dashboard" },
      { title: "Jobs", icon: "mdi-image" },
      { title: "Employer", icon: "mdi-help-box" },
    ],
    user: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      profilePic: "",
    },
    params: {
      // for google sign in:
      client_id: "1039670363666-db72gs4bbu0i1atp7a6obbpcgm7blroe",
    },
    renderParams: {
      width: 250,
      height: 50,
      longtitle: true,
    },
  }),

  props: {
    source: String,
  },

  methods: {
    toSignUp() {
      this.$router.push({ name: "signup" });
    },

    async onSuccess(googleUser) {
      // This only gets the user information: id, name, imageUrl and email
      let self = this;
      console.log(googleUser);
      this.user.email = googleUser.getBasicProfile().getEmail();
      this.user.firstName = googleUser.getBasicProfile().getGivenName();
      this.user.lastName = googleUser.getBasicProfile().getFamilyName();
      this.user.profilePic = googleUser.getBasicProfile().getImageUrl();
      const id_token = googleUser.Cc.id_token;
      console.log(googleUser.getBasicProfile());
      this.$store.state.user.token = id_token;

      axios
        .post(
          process.env.VUE_APP_BACKEND_LINK+"visitor/users/login",
          {
            // email: email,
            tokenId: id_token,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          //Setting important data in vuex global store
          self.$store.state.user.auth = true;
          self.$store.state.user.token = id_token;
          self.$store.state.user.email = self.user.email;
          self.$store.state.user.firstName = self.user.firstName;
          self.$store.state.user.lastName = self.user.lastName;
          self.$store.state.user.profilePic =
          response.data[0].image != null
              ? response.data[0].image
              : self.user.profilePic;
          self.$store.state.user.id = response.data[0]._id;
          const userRole = response.data[0].userRole;
          self.$store.state.user.role = userRole;

          if (userRole == "STUDENT")
          {
            axios
              .post(process.env.VUE_APP_BACKEND_LINK+"visitor/student/add", {
                id: self.$store.state.user.id,
                firstName: self.user.firstName,
                lastName: self.user.lastName,
                email: self.user.email,
                pronouns: "They/Them",
                fieldOfStudy: "",
                education: "",
                unit: "",
                workExperience: [],
                skills: [],
              })
              .catch(function (error) {
                console.log(error);
              });
          }

          if (userRole == "STUDENT" || userRole == "EMPLOYER") {
            self.$router.push({ name: "homepage" });
          }
          else if (userRole == "ADMIN" || userRole == "COADMIN"){
            self.$router.push({ name: "admindashboard" });
          }
        })
        .catch((err) => console.log(err));
      // this.verify(this.user, googleUser);
    },
  },
  mounted() {
    // localStorage.setItem("email", "")
    // localStorage.setItem("id_token", "")
    // const email = localStorage.getItem("email");
    // const id_token = localStorage.getItem("id_token");
    // let self = this;
    //check token expiry
    // if (id_token !== "") {
    //   axios
    //     .post(process.env.VUE_APP_BACKEND_LINK+"student/users/login", {
    //       // email: email,
    //       tokenId: id_token
    //     },{
    //       withCredentials: true
    //     })
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((err) => console.log(err));
    // }
  },
};
</script>

<style scoped>
#intro {
  background-image: url(https://mdbootstrap.com/img/new/fluid/city/008.jpg);
  background-size: cover;
  height: 100%;
  width: 100%;
}

.v-application .rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}

.v-application .rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}
</style>

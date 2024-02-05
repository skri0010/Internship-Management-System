<!-- This is the Profile Card.
    This page allow users to add profile card.

  @author Joshua Ee <jeee0002@student.monash.edu>
  @author Jordan Poon  <jord0004@student.monash.edu>
  @author Arvind Chandrand <acha0094@student.monash.edu>
  @author Jacky Foo <jfoo0016@student.monash.edu>
  @author Kuan Wai Shuet <wkua0005@student.monash.edu>
  
  Created at     : 18-04-2022 13:21
  Last modified  : 20-10-2022 22:00
-->

<style>
@import "../assets/styles/profile-card.css";
</style>

<template>
  <v-card>
    <v-img
      height="300"
      src="https://whatifgaming.com/wp-content/uploads/2021/11/Lumine-and-Paimon-by-melena-Kira-1024x621.png"
    ></v-img>

    <v-card-title>
      My profile

      <v-spacer></v-spacer>

      <v-card-actions>
        <v-dialog transition="dialog-bottom-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark
                >Edit your profile details</v-toolbar
              >
              <v-col cols="12" md="12">
                <v-form v-model="valid">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="firstname"
                          :rules="nameRules"
                          :counter="20"
                          label="First name"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="lastname"
                          :rules="nameRules"
                          :counter="20"
                          label="Last name"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-select
                          v-model="selectedPronoun"
                          :items="pronouns"
                          :rules="pronounRules"
                          label="Pronouns"
                          hint="Let others know how to refer to you"
                          persistent-hint
                          required
                        ></v-select>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-select
                          v-model="selectedUnit"
                          :items="unit"
                          :rules="unitRules"
                          label="Unit"
                          hint="Are you taking Industrial Units"
                          persistent-hint
                          required
                        ></v-select>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="8">
                        <v-text-field
                          v-model="fieldofstudy"
                          :rules="fieldofstudyRules"
                          label="Field of study (e.g. Software Engineering)"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="8">
                        <v-text-field
                          v-model="education"
                          :rules="educationRules"
                          label="Education (e.g. Monash University)"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-btn class="mr-4" @click="submit(); dialog.value = false"> Submit </v-btn>
                  </v-container>
                </v-form>
              </v-col>

              <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-card-actions>
    </v-card-title>

    <v-avatar color="primary" size="150">
      <img v-bind:src="profilePic" />
    </v-avatar>
    <v-avatar class="profile-pic" size="33" color="grey lighten-2">
      <v-file-input
        class="upload-btn"
        id="fileUpload"
        v-model="chosenFile"
        accept="image/*"
        prepend-icon="mdi-upload"
        hide-input
        @change="updateProfilePic"
      >
      </v-file-input>
    </v-avatar>
  

    <v-card-text>{{
      firstname + " " + lastname + " " + displayPronoun(selectedPronoun)
    }}</v-card-text>
    <v-card-text>{{ fieldofstudy }}</v-card-text>
    <v-card-text>{{ education }}</v-card-text>
  </v-card>
</template>

<script>
// import axios from "axios";
import { axiosConfig } from "../axiosConfig";
import store from "../store";

let axiosInstance;

export default {
  data: () => ({
    valid: true,
    firstname: "test",
    lastname: "test",
    chosenFile: null,
    profilePic: null, // set to empty string after integration
    defaultProfilePic:
      "https://images5.alphacoders.com/121/thumbbig-1210103.webp",
    pronouns: ["He/Him", "She/Her", "They/Them"],
    pronounRules: [(v) => !!v || "Pronoun is required"],
    selectedPronoun: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 20 || "Name must be less than 20 characters",
    ],
    selectedUnit: "",
    unit: ["FIT3199", "ENG0002","Voluntary"],
    unitRules: [(v) => !!v || "Unit selection is required"],
    fieldofstudy: "",
    fieldofstudyRules: [(v) => !!v || "Field of study is required"],
    education: "",
    educationRules: [],
  }),
  methods: {

    /**
     * Allowed user to submit details on the profile  
     * @returns {void}  
     */
    submit() {
      let data = this.$store.state.user;
      this.submitDetails(data.email);
    },

    /**
     * Allowed user to select pronouns  
     * @param {string} selectedPronoun 
     * @returns {string} 
     */
    displayPronoun(selectedPronoun) {
      if (selectedPronoun != "") {
        return "(" + selectedPronoun + ")";
      } else {
        return "";
      }
    },

    /**
     * Load details from database based on student's email
     * @param {object} email 
     * @returns {void}
     */
    loadDetails(email) {
      // load details of student from database.
      let self = this;
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"stud/student/retrieve", {
          params: {
            email: email,
          },
        })
        .then((response) => self.displayDetails(response.data));
    },

    /**
     * Load profile picture from database
     * @param {object} email 
     * @returns {void} 
     */
    loadProfilePic(email) {
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"stud/users/getImg", {
          params: {
            email: email,
          },
        })
        .then((response) => {
          if (response.data.length != 0 && response.data[0].image != "") {
            this.profilePic = response.data[0].image;
          } else {
            this.profilePic = this.defaultProfilePic; // default profile pic
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     * Displaying profile details 
     * @param {object} response 
     * @returns {void}  
     */
    displayDetails(response) {
      this.firstname = response.firstName;
      this.lastname = response.lastName;
      this.email = response.email;
      this.selectedPronoun = response.pronouns;
      this.fieldofstudy = response.fieldOfStudy;
      this.education = response.education;
      this.selectedUnit = response.unit;
    },

    /**
     * Allowed user to submit work experience 
     * @param {object} email 
     * @returns {void}  
     */
    submitDetails(email) {
      // store details of student into database
      axiosInstance
        .patch(process.env.VUE_APP_BACKEND_LINK+"stud/student/update", {
          email: email,
          firstName: this.firstname,
          lastName: this.lastname,
          pronouns: this.selectedPronoun,
          fieldOfStudy: this.fieldofstudy,
          education: this.education,
          unit: this.selectedUnit,
        })
        .catch((error) => console.log(error));
    },

    /**
     * this method is used to update the profile pic of the user
     * @returns {void}  
     */
    updateProfilePic() {
      let email = this.$store.state.user.email;
      var reader = new FileReader();
      reader.readAsDataURL(this.chosenFile);
      // set image size limit
      reader.onload = () => { 
        // check the current profile pic
        if (this.profilePic == this.defaultProfilePic) {
          this.uploadProfilePic(email, reader.result);
        } else {
          axiosInstance
            .patch(process.env.VUE_APP_BACKEND_LINK+"stud/users/updateimg", {
              email: email,
              profilePic: reader.result,
            })
            .then(() => {
              this.profilePic = reader.result;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      };
    },

    /**
     * Allowed user to upload profile picture
     * @param {object} email 
     * @param {object} imageB64
     * @returns {void}  
     */
    uploadProfilePic(email, imageB64) {
      axiosInstance
        .post(process.env.VUE_APP_BACKEND_LINK+"stud/users/uploadimg", {
          email: email,
          profilePic: imageB64,
        })
        .then(() => {
          this.profilePic = imageB64;
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
  
  // on page load run this
  mounted() {
    axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase(),
    );

    console.log("Profile card mounted");
    let data = this.$store.state.user;
    this.loadDetails(data.email);
    this.loadProfilePic(data.email);
  },
};
</script>

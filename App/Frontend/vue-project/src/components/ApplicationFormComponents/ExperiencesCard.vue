<!-- This is the Experience Card.
    This page allow users to add skills card.

  @author Jordan Poon Kee Liang <jord0004@student.monash.edu>
  @author Kuan Wai Shuet <wkua0005@student.monash.edu>
  @author Wei Hung Pan <wpan0017@student.monash.edu>
  @author Suchit Sudhir Krishna <skri0010@student.monash.edu>
  @author Hou Ruiqian <rhou0006@student.monash.edu>
  @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
  @author Joshua Ee Xian Zhen <jeee0002@student.monash.edu>

  Created at     : 20-05-2022 17:30
  Last modified  : 20-10-2022 23:00
-->

<template>
  <v-card>
    <v-card-title>
      Experiences
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-dialog transition="dialog-bottom-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>Add a new experience</v-toolbar>
              <v-col cols="12" md="12">
                <v-form v-model="valid">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="experienceTitle"
                          :rules="experienceTitleRules"
                          :counter="20"
                          label="Title"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="employerName"
                          :rules="companyNameRules"
                          label="Company name"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="location"
                          :rules="locationRules"
                          label="Location (optional)"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="yearsOfExperience"
                          :rules="yearsOfExperienceRules"
                          label="Years of experience"
                          type="number"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-btn
                      class="mr-4"
                      @click="
                        submitWorkExp(
                          experienceTitle,
                          employerName,
                          yearsOfExperience,
                          location
                        )
                      "
                    >
                      Submit
                    </v-btn>
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

    <v-row justify="center">
      <v-col cols="12" md="11">
        <v-card
          v-for="experience in experiences"
          :key="experience.title"
          class="ma-3"
        >
          <v-card-title
            >{{ experience.title }}

            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn
                icon
                @click="
                  deleteThisWorkExp(
                    experience.title,
                    experience.employerName,
                    experience.yearsOfExperience,
                    experience.location
                  )
                "
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-title>

          <v-card-text>{{
            "Company name: " + experience.employerName
          }}</v-card-text>
          <v-card-text>{{
            "Years of experience: " + experience.yearsOfExperience
          }}</v-card-text>
          <v-card-text>{{
            "Location: " + getLocation(experience.location)
          }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { axiosConfig } from "../../axiosConfig";
import store from "../../store";

let axiosInstance;

export default {
  data: () => ({
    valid: true,
    experiences: [], //Array of Json Object which required to add into Jobapplication database [{title: experienceTitle, employerName: employerName, yearsOfExperience: yearsOfExperience, location: location}]
    experienceTitle: "",
    experienceTitleRules: [(v) => !!v || "Title is required"],
    employerName: "",
    companyNameRules: [(v) => !!v || "Company name is required"],
    location: "",
    locationRules: [],
    yearsOfExperience: 0,
    yearsOfExperienceRules: [(v) => !!v || "Years of experience is required"],
  }),
  methods: {

    /**
     * Allowed user to submit work experience 
     * @param {string} experienceTitle 
     * @param {string} employerName
     * @param {string} yearsOfExperience
     * @param {string} location
     * @returns {void}  
     */
    submitWorkExp(
      experienceTitle,
      employerName,
      yearsOfExperience,
      location = ""
    ) {
      // function for the button submit in experience card
      this.addExperience(
        experienceTitle,
        employerName,
        yearsOfExperience,
        location
      );
    },

    /**
     * Allowed user to add work experience 
     * @param {string} experienceTitle 
     * @param {string} employerName
     * @param {string} yearsOfExperience
     * @param {string} location
     * @returns {void}  
     */
    addExperience(
      experienceTitle,
      employerName,
      yearsOfExperience,
      location = ""
    ) {
      this.experiences.push({
        title: experienceTitle,
        employerName: employerName,
        yearsOfExperience: yearsOfExperience,
        location: location,
      });
    },

    /**
     * Get location that user inputted
     * @param {string} location 
     * @returns {string} location
     */
    getLocation(location) {
      if (location == "") {
        return "N/A";
      } else {
        return location;
      }
    },

    /**
     * load student details based on the email
     * @param {object} email 
     * @returns {void}  
     */
    loadDetails(email) {
      // load details of student from database
      while (this.experiences.length > 0) {
        // resest the experiences array to empty
        this.experiences.pop();
      }

      let self = this;
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK + "stud/student/retrieve", {
          params: {
            email: email,
          },
        })
        .then((response) => self.displayWorkExp(response.data));
    },

    /**
     * Get mastery based on skills card
     * @param {object} response 
     * @returns {void}  
     */
    displayWorkExp(response) {
      let workExpArray = response.workExperience;
      let arrayLength = workExpArray.length;
      for (var i = 0; i < arrayLength; i++) {
        var eachWorkExp = workExpArray[i];
        this.addExperience(
          eachWorkExp.workExpTitle,
          eachWorkExp.workExpCompanyName,
          eachWorkExp.workExpDuration,
          eachWorkExp.workExpLocation
        );
      }
    },

    /**
     * Allowed user to delete work experience 
     * @param {string} experienceTitle 
     * @param {string} employerName
     * @param {string} yearsOfExperience
     * @param {string} location
     * @returns {void}  
     */
    deleteThisWorkExp(
      experienceTitle,
      employerName,
      yearsOfExperience,
      location = ""
    ) {
      var indexOfdeleteWorkExp;
      var arrayLength = this.experiences.length;
      for (var i = 0; i < arrayLength; i++) {
        var eachWorkExp = this.experiences[i];
        if (
          eachWorkExp.title == experienceTitle &&
          eachWorkExp.employerName == employerName &&
          eachWorkExp.yearsOfExperience == yearsOfExperience &&
          eachWorkExp.location == location
        ) {
          indexOfdeleteWorkExp = i;
          break;
        }
      }

      if (typeof indexOfdeleteWorkExp !== "undefined") {
        this.experiences.splice(indexOfdeleteWorkExp, 1);
      }
    },
  },
  // on page load run this
  mounted() {
    axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase()
    );
    let data = this.$store.state.user;
    this.loadDetails(data.email);
  },
};
</script>

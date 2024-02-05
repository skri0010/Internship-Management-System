<!-- This is the skills Card.
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
      Skills
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
              <v-toolbar color="primary" dark>Add a new skill</v-toolbar>
              <v-col cols="12" md="12">
                <v-form v-model="valid">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="skillTitle"
                          :rules="skillTitleRules"
                          :counter="20"
                          label="Skill Title"
                          required
                        ></v-text-field>
                      </v-col>

                      <div>
                        <v-card-text>
                          Select your skill mastery level
                          <v-rating
                            v-model="rating"
                            color="yellow darken-3"
                            background-color="grey darken-1"
                            length="3"
                            hover
                          ></v-rating>
                          <v-card-text>{{ getMastery(rating) }} </v-card-text>
                        </v-card-text>
                      </div>
                    </v-row>

                    <v-btn
                      class="mr-4"
                      @click="submitSkill(skillTitle, getMastery(rating))"
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
        <v-card v-for="skill in skills" :key="skill.title" class="ma-3">
          <v-card-title
            >{{ skill.title + " " + "(" + skill.mastery + ")" }}

            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn icon @click="deleteThisSkill(skill.title, skill.mastery)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-title>
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
    rating: 1,
    skills: [], //Array of Json Object which required to add into Jobapplication database [{title: experienceTitle, employerName: employerName, yearsOfExperience: yearsOfExperience, location: location}]
    skillTitle: "",
    skillTitleRules: [(v) => !!v || "Skill title is required"],
  }),
  methods: {

    /**
     * Get mastery based on skills card
     * @param {string} rating 
     * @returns {string}  
     */
    getMastery(rating) {
      switch (rating) {
        case 1:
          return "BEGINNER";
        case 2:
          return "INTERMEDIATE";
        case 3:
          return "ADVANCE";
      }
    },

    /**
     * Allowed users to submit skills 
     * @param {string} skillTitle 
     * @param {string} skillMastery 
     * @returns {void} 
     */
    submitSkill(skillTitle, skillMastery) {
      this.addSkill(skillTitle, skillMastery);
    },

    /**
     * Allowed users to add skills
     * @param {string} skillTitle 
     * @param {string} skillMastery 
     * @returns {void} 
     */
    addSkill(skillTitle, skillMastery) {
      this.skills.push({ title: skillTitle, mastery: skillMastery });
    },

    /**
     * Load details of student from database using the email provided
     * @param {object} email object of student email
     * @returns {void} 
     */
    loadDetails(email) {
      // load details of student from database
      while (this.skills.length > 0) {
        // resest the skills array to empty
        this.skills.pop();
      }
      let self = this;

      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"stud/student/retrieve", {
          params: {
            email: email, 
          },
        })
        .then((response) => self.displaySkills(response.data));
    },

    /**
     * Display skills card
     * @param {object} response 
     * @returns {void} 
     */
    displaySkills(response) {
      let skillsArray = response.skills;
      let arrayLength = skillsArray.length;
      for (var i = 0; i < arrayLength; i++) {
        var eachSkill = skillsArray[i];
        this.addSkill(eachSkill.skillTitle, eachSkill.skillMastery);
      }
    },

    /**
     * Allowed user to delete the skills 
     * @param {string} skillTitle 
     * @param {string} skillMastery 
     * @returns {void} 
     */
    deleteThisSkill(skillTitle, skillMastery) {
      // delete the selected skill from database and card
      var indexOfdeleteSkills;
      var arrayLength = this.skills.length;
      for (var i = 0; i < arrayLength; i++) {
        var eachSkill = this.skills[i];
        if (
          eachSkill.title == skillTitle &&
          eachSkill.mastery == skillMastery
        ) {
          indexOfdeleteSkills = i;
          break;
        }
      }
      if (typeof indexOfdeleteSkills !== "undefined") {
        this.skills.splice(indexOfdeleteSkills, 1);
      }
    },
  },
  // on page load run this
  mounted() {
    axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase(),
    );
    let data = this.$store.state.user;
    this.loadDetails(data.email);
  },
};
</script>

<style>
.v-card-text {
  text-align: left;
}
</style>

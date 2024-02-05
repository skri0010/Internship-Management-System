<!-- This is the skill card component used to add and display skills

  @author Jacky Foo <jfoo0016@student.monash.edu>
  
  Created at     : 11-05-2022 12:00
  Last modified  : 20-10-2022 23:30
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
                      @click="submitSkill(skillTitle, getMastery(rating)); dialog.value = false"
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
import { axiosConfig } from "../axiosConfig";
import store from "../store";

let axiosInstance;

export default {
  data: () => ({
    valid: true,
    rating: 1,
    skills: [],
    skillTitle: "",
    skillTitleRules: [(v) => !!v || "Skill title is required"],
  }),
  methods: {
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
    submitSkill(skillTitle, skillMastery) {
      let data = this.$store.state.user;
      this.addSkill(skillTitle, skillMastery);
      this.storeSkillToDatabase(skillTitle, skillMastery, data.email);
    },
    addSkill(skillTitle, skillMastery) {
      this.skills.push({ title: skillTitle, mastery: skillMastery });
    },
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
    displaySkills(response) {
      let skillsArray = response.skills;
      let arrayLength = skillsArray.length;
      for (var i = 0; i < arrayLength; i++) {
        var eachSkill = skillsArray[i];
        this.addSkill(eachSkill.skillTitle, eachSkill.skillMastery);
      }
    },
    storeSkillToDatabase(skillTitle, skillMastery, email) {
      // store details of the newly added skill to database
      var skillSch = { skillTitle: skillTitle, skillMastery: skillMastery };
      axiosInstance
        .patch(process.env.VUE_APP_BACKEND_LINK+"stud/student/update-addSkill", {
          email: email, 
          skill: skillSch,
        })
        .catch((error) => console.log(error));
    },
    deleteThisSkill(skillTitle, skillMastery) {
      // delete the selected skill from database and card
      let data = this.$store.state.user;
      var skillSch = { skillTitle: skillTitle, skillMastery: skillMastery };
      axiosInstance
        .patch(process.env.VUE_APP_BACKEND_LINK+"stud/student/update-removeSkill", {
          email: data.email, 
          deleteSkill: skillSch,
        })
        .catch((error) => console.log(error));

      this.delay(500).then(() => this.loadDetails(data.email));
    },
    delay(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
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

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
                          :counter="30"
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
                          min="0"
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
                          location,
                        ); dialog.value = false
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
                    experience.location,
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
import { axiosConfig } from "../axiosConfig";
import store from "../store";

let axiosInstance;

export default {
  data: () => ({
    valid: true,
    experiences: [],
    experienceTitle: "",
    experienceTitleRules: [(v) => !!v || "Title is required", v => v.length <= 30 || 'Must be less than 30 characters'],
    employerName: "",
    companyNameRules: [(v) => !!v || "Company name is required"],
    location: "",
    locationRules: [],
    yearsOfExperience: 0,
    yearsOfExperienceRules: [(v) => !!v || "Years of experience is required"],
  }),
  methods: {
    submitWorkExp(
      experienceTitle,
      employerName,
      yearsOfExperience,
      location = "",
    ) {
      // function for the button submit in experience card
      let data = this.$store.state.user;
      this.addExperience(
        experienceTitle,
        employerName,
        yearsOfExperience,
        location,
      );
      this.storeWorkExpToDatabase(
        experienceTitle,
        employerName,
        yearsOfExperience,
        location,
        data.email,
      );
    },
    addExperience(
      experienceTitle,
      employerName,
      yearsOfExperience,
      location = "",
    ) {
      this.experiences.push({
        title: experienceTitle,
        employerName: employerName,
        yearsOfExperience: yearsOfExperience,
        location: location,
      });
    },
    getLocation(location) {
      if (location == "") {
        return "N/A";
      } else {
        return location;
      }
    },
    loadDetails(email) {
      // load details of student from database
      while (this.experiences.length > 0) {
        // resest the experiences array to empty
        this.experiences.pop();
      }

      let self = this;
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"stud/student/retrieve", {
          params: {
            email: email,
          },
        })
        .then((response) => self.displayWorkExp(response.data));
    },
    displayWorkExp(response) {
      let workExpArray = response.workExperience;
      let arrayLength = workExpArray.length;
      for (var i = 0; i < arrayLength; i++) {
        var eachWorkExp = workExpArray[i];
        this.addExperience(
          eachWorkExp.workExpTitle,
          eachWorkExp.workExpCompanyName,
          eachWorkExp.workExpDuration,
          eachWorkExp.workExpLocation,
        );
      }
    },
    storeWorkExpToDatabase(
      experienceTitle,
      employerName,
      yearsOfExperience,
      location = "",
      email,
    ) {
      // store details of the newly added work exp in database
      var eachWorkExpSch = {
        workExpTitle: experienceTitle,
        workExpCompanyName: employerName,
        workExpLocation: location,
        workExpDuration: yearsOfExperience,
      };
      axiosInstance
        .patch(process.env.VUE_APP_BACKEND_LINK+"stud/student/update-addWorkExp", {
          email: email,
          eachWorkExp: eachWorkExpSch,
        })
        .catch((error) => console.log(error));
    },
    deleteThisWorkExp(
      experienceTitle,
      employerName,
      yearsOfExperience,
      location = "",
    ) {
      // delete the selected work experience from database and card
      let data = this.$store.state.user;
      var eachWorkExpSch = {
        workExpTitle: experienceTitle,
        workExpCompanyName: employerName,
        workExpLocation: location,
        workExpDuration: yearsOfExperience,
      };
      axiosInstance
        .patch(process.env.VUE_APP_BACKEND_LINK+"stud/student/update-removeWorkExp", {
          email: data.email,
          deleteWorkExp: eachWorkExpSch,
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

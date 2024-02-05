<!-- This is the Employer Job Advertisement component

  @author Wei Hung Pan <wpan0017@student.monash.edu>
  @author Deeksha Sridhar <dsri0006@student.monash.edu> 
  @author Zeenath Zaeema Nashath <znas0003@student.monash.edu> 
  @author Mohammed Rashid <mras0018@student.monash.edu> 

  Created at     : 19-08-2022 
  Last modified  : 15-09-2022 
-->

<template>
  <v-layout align-center justify-center>
    <v-card
      class="elevation-6 mt-10 mb-10 mx-auto pa-12"
      justify="center"
      max-width="60%"
    >
      <v-card-title class="pa-0">
        <v-col class="pa-6" cols="12">
          <h2 class="text-center">Job Advertisement Form</h2>
        </v-col>
      </v-card-title>
      <!-- Form for employer to add job advertisement -->
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <v-row>
            <v-col cols="12">
              <!-- First row -->
              <v-row>
                <h3 class="pl-4">Job:</h3>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="10" lg="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Job Title"
                    rules="required|max:30"
                  >
                    <v-text-field
                      v-model="jobTitle"
                      label="Job Title"
                      :error-messages="errors"
                      outlined
                      required
                      dense
                      color="#2C4C9C"
                      autocomplete="false"
                      :counter="30"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Job Description"
                    rules="required|max:2000"
                  >
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          Job Description
                          <v-spacer></v-spacer>
                          {{ jobDescription.length }}/2000
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <vue-editor
                            v-model="jobDescription"
                            :editorToolbar="customToolbar"
                            placeholder="Job Description / Responsiblity and Duty Here"
                          ></vue-editor>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <div class="red--text text-left">{{ errors[0] }}</div>
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Job Requirement"
                    rules="required|max:2000"
                  >
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          Job Requirement
                          <v-spacer></v-spacer>
                          {{ jobRequirement.length }}/2000
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <vue-editor
                            v-model="jobRequirement"
                            :editorToolbar="customToolbar"
                            placeholder="Job Requirement Here"
                          ></vue-editor>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <div class="red--text text-left">{{ errors[0] }}</div>
                  </validation-provider>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <br />
              <v-divider></v-divider>
              <br />
              <br />
              <v-row>
                <h3 class="pl-4">Company:</h3>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="10" lg="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Contact Person Email"
                    rules="required|max:50"
                  >
                    <v-text-field
                      v-model="contactPerson"
                      label="Contact Person Email (HR)"
                      outlined
                      dense
                      color="#2C4C9C"
                      autocomplete="false"
                      required
                      :counter="50"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Company Address Street"
                    rules="required|max:50"
                  >
                    <v-text-field
                      v-model="employerAddressStreet"
                      label="Street"
                      outlined
                      dense
                      color="#2C4C9C"
                      autocomplete="false"
                      required
                      :counter="50"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12" sm="12" md="6" lg="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="City"
                    rules="required|max:20"
                  >
                    <v-text-field
                      v-model="employerAddressCity"
                      label="City"
                      outlined
                      dense
                      color="#2C4C9C"
                      autocomplete="false"
                      required
                      :counter="20"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12" sm="12" md="6" lg="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="State"
                    rules="required|max:20"
                  >
                    <v-select
                      v-model="employerAddressState"
                      :items="state"
                      label="State"
                      dense
                      color="#2C4C9C"
                      outlined
                      :counter="20"
                      :error-messages="errors"
                    ></v-select>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Company Overview"
                    rules="required|max:1000"
                  >
                    <v-textarea
                      v-model="companyOverview"
                      auto-grow
                      filled
                      required
                      color="#2C4C9C"
                      label="Company Overview"
                      rows="2"
                      :counter="1000"
                      :error-messages="errors"
                    ></v-textarea>
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- Third row -->
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
              <br />
              <br />
              <v-row>
                <h3 class="pl-4">Job Advertisement Duration:</h3>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-dialog
                    ref="dialog"
                    v-model="jobAdvertisementDialog"
                    persistent
                    width="40%"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-row>
                        <v-col cols="12" sm="12" md="6" lg="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Advertisement Start Date"
                            rules="required"
                          >
                            <v-text-field
                              v-model="advertisementDuration[0]"
                              label="Start"
                              prepend-icon="mdi-calendar"
                              readonly
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                              :error-messages="errors"
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="12" md="6" lg="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Advertisement End Date"
                            rules="required"
                          >
                            <v-text-field
                              v-model="advertisementDuration[1]"
                              label="End"
                              prepend-icon="mdi-calendar"
                              readonly
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                              :error-messages="errors"
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </template>
                    <v-date-picker
                      v-model="advertisementDuration"
                      scrollable
                      range
                      outlined
                      dense
                      color="#2C4C9C"
                      full-width
                      :min="new Date(Date.now()).toISOString().substr(0, 10)"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="jobAdvertisementDialog = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="jobAdvertisementDialog = false"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
              <br />
              <br />
              <v-row>
                <h3 class="pl-4">Hiring Local/International Student:</h3>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Hiring Student Nationality"
                    rules="required"
                  >
                    <v-checkbox
                      v-model="studentNationality"
                      label="Local"
                      value="local"
                      input-value="true"
                      dense
                      hide-details
                      :error-messages="errors"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="studentNationality"
                      label="International"
                      value="international"
                      dense
                      hide-details
                      :error-messages="errors"
                    >
                    </v-checkbox>
                    <div class="red--text text-left">{{ errors[0] }}</div>
                  </validation-provider>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
              <br />
              <br />
              <v-row>
                <h3 class="pl-4">Job Additional Information:</h3>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Additional Information"
                    rules="max:1000"
                  >
                    <v-textarea
                      v-model="additionalInformation"
                      auto-grow
                      filled
                      color="#2C4C9C"
                      label="Additional Information [Optional]"
                      rows="2"
                      :error-messages="errors"
                      :counter="1000"
                    ></v-textarea>
                  </validation-provider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </form>
      </validation-observer>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="clear()"> Clear </v-btn>
        <v-btn
          color="#2C4C9C"
          dark
          tile
          depressed
          type="submit"
          @click="submit()"
        >
          SUBMIT
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- Notification snackbar to provide feedback on actions by user -->
    <v-snackbar
      v-model="notification"
      timeout="1000"
      :color="notiColor"
      v-bind="{
        bottom: true,
        right: true,
      }"
    >
      {{ notificationText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="notification = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { axiosConfig } from "../../axiosConfig";
import { required, digits, email, max } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { VueEditor } from "vue2-editor";

setInteractionMode("lazy");

extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})",
});

extend("required", {
  ...required,
  message: "{_field_} cannot be empty",
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});

extend("email", {
  ...email,
  message: "Email must be valid",
});

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    VueEditor,
  },
  data: () => ({
    customToolbar: [
      [{ header: [false, 4, 5, 6] }],
      ["bold", "italic", "underline"], // toggled buttons
      [{ align: "" }, { align: "center" }, { align: "right" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      //[{ color: [] }], // dropdown with defaults from theme
      ["clean"], // remove formatting button
    ],
    // input field variables
    employerData: null,
    employerAddressStreet: null,
    employerAddressCity: null,
    employerAddressState: null,
    employerName: null,
    jobTitle: null,
    jobDescription: "",
    jobRequirement: "",
    additionalInformation: null,
    companyOverview: null,
    contactPerson: null,
    advertisementDuration: [null, null],
    jobDescriptionDialog: false,
    jobAdvertisementDialog: false,
    studentNationality: [],
    axiosInstance: null,
    notification: false, // true will show notification snackbar
    notiColor: "#19946b", // determine the color for the notification snackbar
    notificationText: null, // content of the notification snackbar
    state: [
      "Johor",
      "Kedah",
      "Kelantan",
      "Kuala Lumpur",
      "Labuan",
      "Malacca",
      "Negeri Sembilan",
      "Pahang",
      "Penang",
      "Perak",
      "Perlis",
      "Putrajaya",
      "Sabah",
      "Sarawak",
      "Selangor",
      "Terengganu",
    ],
  }),

  methods: {
    // Function will clear all fields in form
    clear() {
      this.studentNationality = [];
      this.advertisementDuration = [null, null];
      this.jobTitle = null;
      this.jobDescription = "";
      this.jobRequirement = "";
      this.additionalInformation = null;
      this.companyOverview = null;
      this.updateField(this.employerData);
      this.$refs.observer.reset();
    },
    // Function to display message to the user
    displayNotification(message, color) {
      this.notificationText = message;
      this.notification = true;
      this.notiColor = color;
    },
    // Validation function to submit form to backend
    async submit() {
      if (await this.$refs.observer.validate()) {
        this.getData();
        this.clear();
      }
    },
    // Function to submit form to backend
    async getData() {
      let hireType = null;
      if (this.studentNationality.length == 1) {
        hireType = this.studentNationality[0];
      } else if (this.studentNationality.length == 2) {
        var hiretype1 = this.studentNationality[0];
        var hiretype2 = this.studentNationality[1];
        hireType = hiretype1 + "/" + hiretype2;
      }

      let data = {
        employerName: this.employerName,
        employerId: this.$store.state.user.id,
        jobTitle: this.jobTitle,
        jobDescription: this.jobDescription,
        jobRequirement: this.jobRequirement,
        jobAdditionalInformation: this.additionalInformation,
        hireType: hireType,
        employerOverview: this.companyOverview,
        employerAddress: `${this.employerAddressStreet}, ${this.employerAddressCity}, ${this.employerAddressState}`,
        employerContactPerson: this.contactPerson,
        advertisementStartDate: this.advertisementDuration[0],
        advertisementEndDate: this.advertisementDuration[1],
      };
      // let job;
      let self = this;
      this.axiosInstance
        .post(process.env.VUE_APP_BACKEND_LINK+"emp/advert", data)
        .then(function (response) {
          //job = response.data;
          console.log(response);
          self.displayNotification("ADVERTISEMENT ADDED SUCCESSFULLY", "#19946b");
        })
        .catch(function (error) {
          console.log(error);
          self.displayNotification(
            "ERROR ADDING ADVERTISEMENT APPLICATION",
            "#94193c"
          );
        });
      this.clear();

    //   let jobId = {
    //   jobId: job._id
    // }
    // create job counter stats when each job advertiesment is created
    // this.axiosInstance
    //   .post(process.env.VUE_APP_BACKEND_LINK+"admin/admin/CreateTopJobsCounter", jobId)
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
    },
    // Function to update the current data without refreshing data via request to backend
    updateField(data) {
      this.employerAddressStreet = data.employerAddressStreet;
      this.employerAddressCity = data.employerAddressCity;
      this.employerAddressState = data.employerAddressState;
      this.contactPerson = data.employerContactPersonEmail;
    },
  },
  async created() {
    this.axiosInstance = axiosConfig(
      this.$store.state.user.token,
      this.$store.state.user.role.toLowerCase()
    );
    let self = this;
    await this.axiosInstance
      .get(process.env.VUE_APP_BACKEND_LINK+"emp/prof/" + this.$store.state.user.id)
      .then((response) => {
        let data = response.data;
        this.employerData = data;
        this.employerName = data.employerName;
        this.updateField(data);
      })
      .catch(function (error) {
        console.log(error);
        self.displayNotification(
            "ERROR RETRIEVING EMPLOYER PROFILE",
            "#94193c"
          );
      });
  },
};
</script>
<style>
.v-expansion-panel-header__icon {
  padding-left: 4px;
}
.signup {
  background-color: #2c4c9c;
}
</style>

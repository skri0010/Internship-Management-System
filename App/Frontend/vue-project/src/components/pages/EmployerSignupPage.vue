<!-- This is the Employer Sign Up Page component

  @author Wei Hung Pan <wpan0017@student.monash.edu>
  @author Deeksha Sridhar <dsri0006@student.monash.edu> 
  @author Zeenath Zaeema Nashath <znas0003@student.monash.edu> 
  @author Mohammed Rashid <mras0018@student.monash.edu> 

  Created at     : 19-08-2022 
  Last modified  : 20-10-2022 
-->

<template>
  <v-layout align-center justify-center class="signup">
    <v-card
      class="elevation-6 mt-10 mb-10 mx-auto pa-12"
      justify="center"
      style="max-width: 60%"
    >
      <v-row>
        <v-col cols="1">
          <v-btn text @click="backToLogin()">
            <v-icon> mdi-arrow-left </v-icon>Back
          </v-btn>
        </v-col>
      </v-row>
      <v-card-title class="pa-0">
        <v-col class="pa-6" cols="12">
          <h2 class="text-center">Register To Our Platform</h2>
          <h6 class="text-center grey--text">
            All set to provide opportunity to interns
          </h6>
        </v-col>
      </v-card-title>
      <!-- Form for user to apply for employer role -->
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <!-- First row -->
          <v-row>
            <v-col cols="12">
              <h3 class="text-left">Email:</h3>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6">
              <validation-provider
                v-slot="{ errors }"
                name="Email"
                rules="required|email"
              >
                <v-text-field
                  v-model="email"
                  label="Primary Email"
                  :error-messages="errors"
                  outlined
                  required
                  dense
                  color="#2C4C9C"
                  autocomplete="false"
                  placeholder="Email for login"
                />
              </validation-provider>
            </v-col>
          </v-row>
          <br />
          <br />
          <v-row>
            <v-col cols="12">
              <h3 class="text-left">Company Details:</h3>
            </v-col>

            <v-col cols="12">
              <validation-provider
                v-slot="{ errors }"
                name="Company Name"
                rules="required|max:20"
              >
                <v-text-field
                  v-model="companyName"
                  label="Company Name"
                  outlined
                  required
                  dense
                  color="#2C4C9C"
                  autocomplete="false"
                  :counter="20"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="6">
              <validation-provider
                v-slot="{ errors }"
                name="Company Industry"
                rules="required|max:50"
              >
                <v-select
                  v-model="employerIndustry"
                  :items="industry"
                  label="Company Industry"
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
                name="Company Website"
                rules="required|max:40"
              >
                <v-text-field
                  v-model="employerWebsite"
                  label="Company Website"
                  outlined
                  dense
                  color="#2C4C9C"
                  autocomplete="false"
                  required
                  :counter="40"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
          </v-row>

          <br />
          <br />

          <v-row>
            <v-col cols="12">
              <h3 class="text-left">Company Address:</h3>
            </v-col>

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

          <!-- Forth row -->
          <!-- Contact name and number -->
          <br />
          <br />
          <v-row>
            <v-col cols="12">
              <h3 class="text-left">Company Contact Person:</h3>
            </v-col>

            <v-col cols="12">
              <!-- Contact Email -->
              <validation-provider
                v-slot="{ errors }"
                name="Contact Email"
                rules="required|email"
              >
                <v-text-field
                  v-model="contactEmail"
                  label="Contact Email"
                  outlined
                  dense
                  color="#2C4C9C"
                  autocomplete="false"
                  required
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="6">
              <validation-provider
                v-slot="{ errors }"
                name="Contact Person"
                rules="required|max:20"
              >
                <v-text-field
                  v-model="contactPerson"
                  label="Contact Name (HR)"
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
                name="Contact Number"
                :rules="{
                  required: true,
                  regex: '^[0-9*#+]+$',
                }"
              >
                <v-text-field
                  v-model="contactNo"
                  label="Contact No"
                  outlined
                  dense
                  color="#2C4C9C"
                  autocomplete="false"
                  placeholder="+601XXXXXXXX"
                  required
                  :counter="15"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
          </v-row>

          <br />
          <br />
          <!-- Fifth row -->
          <v-row>
            <h3 class="pl-4">Salary/Internship Allowance (RM)</h3>
          </v-row>

          <v-row>
            <v-col cols="12">
              <validation-provider
                v-slot="{ errors }"
                name="Salary/Internship Allowance"
                rules="required|"
              >
                <v-range-slider
                  v-model="range"
                  :max="max"
                  :min="min"
                  hide-details
                  class="align-center"
                  :error-messages="errors"
                >
                  <template v-slot:prepend>
                    <v-text-field
                      :value="range[0]"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                      @change="$set(range, 0, $event)"
                    ></v-text-field>
                  </template>
                  <template v-slot:append>
                    <v-text-field
                      :value="range[1]"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                      @change="$set(range, 1, $event)"
                    ></v-text-field>
                  </template>
                </v-range-slider>
              </validation-provider>
            </v-col>
          </v-row>

          <br />
          <br />

          <v-row>
            <!-- Hiring Students -->
            <v-col cols="12">
              <h3 class="text-left">Hiring Local/International Student:</h3>
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
                <!-- <div class="red--text text-left">{{ errors[0] }}</div> -->
              </validation-provider>
            </v-col>
          </v-row>
          <br />
          <br />

          <!-- Comment and submit -->
          <v-row>
            <h3 class="pl-4">Work arrangement during pandemic:</h3>
          </v-row>

          <v-row>
            <v-col cols="12">
              <!-- Working Arrangement -->

              <v-radio-group v-model="arrangement" class="mt-0" row required>
                <v-radio label="Remote" value="Remote"> </v-radio>
                <v-radio label="Face to Face" value="F2F"> </v-radio>
                <v-radio label="Rotation Basis" value="Rotation"> </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <br />
          <br />

          <!-- Comment and submit -->
          <v-row>
            <h3 class="pl-4">Additional Remark:</h3>
          </v-row>

          <v-row>
            <v-col cols="12">
              <validation-provider
                v-slot="{ errors }"
                name="Additional Information"
                rules="max:300"
              >
                <v-textarea
                  v-model="comment"
                  auto-grow
                  filled
                  color="#2C4C9C"
                  label="Comment/Remark"
                  rows="2"
                  :error-messages="errors"
                  :counter="300"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>

          <!-- Privacy Policy -->
          <v-row class="pl-3">
            <validation-provider
              v-slot="{ errors }"
              name="Privacy Policy"
              rules="policy"
            >
              <v-checkbox
                v-model="privacyPolicy"
                value="privacyChecked"
                input-value="true"
                dense
                :error-messages="errors"
              >
                <template v-slot:label>
                  <div>
                    I have read and agree to the
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <a @click="viewPrivacy" v-on="on"> Privacy Policy </a>
                      </template>
                      View Policy
                    </v-tooltip>
                    .
                  </div>
                </template>
              </v-checkbox>
            </validation-provider>
            <v-dialog max-width="600px" v-model="privacyDialog">
              <v-card >
                <!-- Contents of privacy policy -->
                <v-card-title>
                  <h3>Privacy Policy</h3>
                </v-card-title>
                <v-card-subtitle style="text-align:left">
                  Last updated: 29/09/2022
                </v-card-subtitle>
                <v-card-text >
                  <p style="text-align:left">
                    Our privacy policy lists the data that we collect, the reason behind it as well as the persistance of the data
                    that is being stored.
                  </p>
                  <p style="text-align:left"> 
                    When you sign up at SIMP as an employer, you agree to share the details that are listed below:
                    <ul>
                      <li>Email Address</li>
                      <li>Company name</li>
                      <li>Company industry</li>
                      <li>Company website</li>
                      <li>Company address</li>
                      <li>Contact details</li>
                    </ul> 
                    We use this data to provide better services to our users and veriify the authenticity of companies that
                    are willing to use our system. The verification process is performed by our admin team who then approves 
                    whether a company is viable to use our system.        
                  </p>
                  <p style="text-align:left">
                    The data we collect is stored as long as a company is associated with our system. Once a company is no longer
                    part of our application, their data is removed from our system.  
                  </p>
                </v-card-text>
              </v-card>
            </v-dialog>
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
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import axios from "axios";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

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

extend("regex", {
  ...regex,
  message: "{_field_} {_value_} does not match {regex}",
});

extend("email", {
  ...email,
  message: "Email must be valid",
});

extend("policy", {
  ...required,
  message: "Policy Agreement must be selected",
});

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data: () => ({
    // input field variables
    email: null,
    companyName: null,
    employerIndustry: null,
    employerWebsite: null,
    employerAddressStreet: null,
    employerAddressCity: null,
    employerAddressState: null,
    contactPerson: null,
    contactNo: null,
    contactEmail: null,
    studentNationality: [],
    arrangement: "Remote",
    comment: null,
    min: 0,
    max: 5000,
    range: [100, 4000],
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
    industry: [
      "Computer/IT",
      "Engineering",
      "Sales/Marketing",
      "Consulting",
      "Services",
      "Healthcare",
      "Accounting/Finance",
      "Hospitality",
      "Retail",
      "Pharmacy",
      "Building/Construction",
      "Banking",
    ],
    privacyDialog: false,
    privacyPolicy: false,
    notification: false, // true will show notification snackbar
    notiColor: "#19946b", // determine the color for the notification snackbar
    notificationText: null, // content of the notification snackbar
  }),
  /* eslint-disable */
  /* Disable error logging for this file */
  methods: {
    // Function to display message to the user
    displayNotification(message, color) {
      this.notificationText = message;
      this.notification = true;
      this.notiColor = color;
    },
    // Function to allow user to view the privacy policy
    viewPrivacy() {
      this.privacyDialog = true;
    },
    // Function to redirect user back to login page
    async backToLogin() {
      this.$router.push({ name: "login" });
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
      // if the input fields are not empty, then push to database
      let hire = null;
      if (this.studentNationality.length == 1) {
        hire = this.studentNationality[0];
      } else {
        let hiretype1 = this.studentNationality[0];
        let hiretype2 = this.studentNationality[1];
        hire = hiretype1 + ", " + hiretype2;
      }
      let data = {
        employerEmail: this.email,
        employerName: this.companyName,
        employerIndustry: this.employerIndustry,
        employerWebsite: this.employerWebsite,
        employerAddressStreet: this.employerAddressStreet,
        employerAddressCity: this.employerAddressCity,
        employerAddressState: this.employerAddressState,
        employerContactPerson: this.contactPerson,
        employerContactPersonNo: this.contactNo,
        employerContactPersonEmail: this.contactEmail,
        salaryRange: this.range[0] + "-" + this.range[1],
        hireType: hire,
        workArrangement: this.arrangement,
        remark: this.comment,
      };
      console.log(data);
      let self = this;
      await axios
        .post(process.env.VUE_APP_BACKEND_LINK+"visitor/app", data)
        .then(function (response) {
          self.displayNotification(
            "EMPLOYER APPLICATION SUBMITTED SUCCESSFULLY",
            "#19946b"
          );
        })
        .catch(function (error) {
          self.displayNotification(
            "ERROR SUBMITTING EMPLOYER APPLICATION",
            "#94193c"
          );
        });
    },
    // Function will clear all fields in form
    clear() {
      this.email = null;
      this.companyName = null;
      this.employerIndustry = null;
      this.employerWebsite = null;
      this.employerAddressStreet = null;
      this.employerAddressCity = null;
      this.employerAddressState = null;
      this.contactPerson = null;
      this.contactNo = null;
      this.contactEmail = null;
      this.studentNationality = [];
      this.arrangement = "Remote";
      this.comment = null;
      this.min = 0;
      this.max = 5000;
      this.range = [100, 4000];
      this.privacyPolicy = false;
      this.$refs.observer.reset();
    },
    // on page load run this
    created() {},
  },
};
</script>
<style>
.v-card-text {
  text-align: left;
}
.signup {
  background-color: #2c4c9c;
}
</style>

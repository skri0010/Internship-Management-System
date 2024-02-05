<!-- This is the Employer Profile Page component

  @author Wei Hung Pan <wpan0017@student.monash.edu>
  @author Deeksha Sridhar <dsri0006@student.monash.edu> 
  @author Zeenath Zaeema Nashath <znas0003@student.monash.edu> 
  @author Mohammed Rashid <mras0018@student.monash.edu> 

  Created at     : 19-08-2022 
  Last modified  : 20-10-2022 
-->

<template>
  <!-- Employer Profile Page -->
  <validation-observer ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <v-layout align-center justify-center>
        <v-row>
          <v-col cols="12" class="mt-16">
            <v-avatar
              size="160"
              class="rounded-circle elevation-6 mt-n12 d-inline-block"
            >
              <img v-bind:src="profilePic" alt="user" />
            </v-avatar>
            <v-avatar class="profile-pic" size="40" color="grey lighten-2">
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
          </v-col>

          <v-col cols="12" lg="4" class="px-6">
            <v-card class="mt-12">
              <v-card-title class="black--text mt-8">
                <p class="ml-3 text--primary">Company Info</p>
              </v-card-title>
              <v-form>
                <v-container class="py-0">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="employerName"
                        disabled
                        outlined
                        label="Company Name (disabled)"
                      />
                    </v-col>

                    <v-col cols="12" sm="12" md="6" lg="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Company Industry"
                        rules="required|max:50"
                      >
                        <v-select
                          v-model="employerIndustry"
                          :items="industry"
                          :disabled="disableInput"
                          label="Company Industry"
                          outlined
                          :color="inputColor"
                          autocomplete="false"
                          required
                          :counter="50"
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" sm="12" md="6" lg="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Company Website"
                        rules="required|max:40"
                      >
                        <v-text-field
                          outlined
                          :disabled="disableInput"
                          v-model="employerWebsite"
                          :color="inputColor"
                          :counter="40"
                          label="Company Website"
                          autocomplete="false"
                          required
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4" class="px-6">
            <v-card class="mt-12">
              <v-card-title class="black--text mt-8">
                <p class="ml-3 text--primary">Company Address</p>
              </v-card-title>
              <v-form>
                <v-container class="py-0">
                  <v-row>
                    <v-col cols="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Company Address Street"
                        rules="required|max:50"
                      >
                        <v-text-field
                          v-model="employerAddressStreet"
                          label="Street"
                          outlined
                          autocomplete="false"
                          required
                          :color="inputColor"
                          :disabled="disableInput"
                          :counter="50"
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" sm="12" md="6" lg="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="City"
                        rules="required|max:20"
                      >
                        <v-text-field
                          outlined
                          :disabled="disableInput"
                          v-model="employerAddressCity"
                          :color="inputColor"
                          :counter="20"
                          label="City"
                          autocomplete="false"
                          required
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" sm="12" md="6" lg="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="State"
                        rules="required|max:20"
                      >
                        <v-select
                          :color="inputColor"
                          :disabled="disableInput"
                          v-model="employerAddressState"
                          :items="state"
                          label="State"
                          outlined
                          required
                          :counter="20"
                          :error-messages="errors"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4" class="px-6">
            <v-card class="mt-12">
              <v-card-title class="black--text mt-8">
                <p class="ml-3 text--primary">Company Contact Person</p>
              </v-card-title>
              <v-form>
                <v-container class="py-0">
                  <v-row>
                    <v-col cols="12" sm="12" md="6" lg="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Contact Person"
                        rules="required|max:20"
                      >
                        <v-text-field
                          :color="inputColor"
                          outlined
                          :disabled="disableInput"
                          v-model="employerContactPerson"
                          :counter="20"
                          label="Contact Name"
                          autocomplete="false"
                          required
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" sm="12" md="6" lg="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Contact Number"
                        :rules="{
                          required: true,
                          regex: '^[0-9*#+]+$',
                        }"
                      >
                        <v-text-field
                          :color="inputColor"
                          outlined
                          :disabled="disableInput"
                          v-model="employerContactPersonNo"
                          :counter="15"
                          label="Contact No"
                          autocomplete="false"
                          placeholder="+601XXXXXXXX"
                          required
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="email"
                        rules="required|email"
                      >
                        <v-text-field
                          :color="inputColor"
                          outlined
                          :disabled="disableInput"
                          v-model="employerContactPersonEmail"
                          label="Contact Email"
                          :error-messages="errors"
                          required
                          autocomplete="false"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>

          <v-col cols="12" class="px-6 text-right">
            <v-btn
              elevation="6"
              min-width="150"
              class="mx-4"
              @click="editProfile()"
            >
              EDIT
            </v-btn>

            <v-btn
              color="#2C4C9C"
              elevation="6"
              min-width="150"
              :loading="loading"
              class="ml-4 white--text"
              :disabled="disableInput"
              @click="updateProfile()"
            >
              UPDATE
            </v-btn>
          </v-col>
          <v-col cols="12" class="px-6 text-right">
            <div class="mb-16"></div>
          </v-col>
        </v-row>

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
            <v-btn
              color="white"
              text
              v-bind="attrs"
              @click="notification = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-layout>
    </form>
  </validation-observer>
  <!-- Can use a cart to wrap around and add the button at the bottom -->
</template>

<script>
import { axiosConfig } from "../../axiosConfig";
import { required, email, max } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
setInteractionMode("lazy");

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
  name: "UserProfileView",
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data: () => ({
    profilePic:
      "https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg",
    employerName: null,
    employerIndustry: null,
    employerWebsite: null,
    employerAddressStreet: null,
    employerAddressCity: null,
    employerAddressState: null,
    employerContactPerson: null,
    employerContactPersonNo: null,
    employerContactPersonEmail: null,
    employerData: null,
    disableInput: true,
    inputColor: "#2c4c9c",
    loading: false,
    axiosInstance: null,
    chosenFile: null,
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
    async populateInfo() {
      let self = this;
      await this.axiosInstance
        .get(
          process.env.VUE_APP_BACKEND_LINK +
            "emp/prof/" +
            this.$store.state.user.id
        )
        .then((response) => {
          let data = response.data;
          self.employerData = data;
          self.updateField(data);
        })
        .catch((error) => {
          self.displayNotification("FETCH FAILED", "#94193c");
        });
    },
    async updateProfile() {
      this.loading = true;
      let self = this;
      if (await this.$refs.observer.validate()) {
        let data = {
          employerWebsite: this.employerWebsite,
          employerIndustry: this.employerIndustry,
          employerAddressStreet: this.employerAddressStreet,
          employerAddressCity: this.employerAddressCity,
          employerAddressState: this.employerAddressState,
          employerContactPerson: this.employerContactPerson,
          employerContactPersonNo: this.employerContactPersonNo,
          employerContactPersonEmail: this.employerContactPersonEmail,
        };
        await this.axiosInstance
          .put(
            process.env.VUE_APP_BACKEND_LINK +
              "emp/prof/" +
              this.$store.state.user.id,
            data
          )
          .then((response) => {
            self.employerData = response.data;
            self.displayNotification("UPDATE SUCCESS", "#19946b");
          })
          .catch((error) => {
            self.displayNotification("UPDATE FAILED", "#94193c");
          });
      } else {
        self.displayNotification("INVALID DATA, UPDATE FAILED", "#94193c");
      }
      this.disableInput = true;
      this.updateField(this.employerData);
      this.loading = false;
    },
    // this method is used to update the profile pic of the user
    updateProfilePic() {
      let email = this.$store.state.user.email;
      var reader = new FileReader();
      let self = this;
      reader.readAsDataURL(this.chosenFile);
      // set image size limit
      reader.onload = () => {
        // check the current profile pic
        if (this.profilePic == this.defaultProfilePic) {
          this.uploadProfilePic(email, reader.result);
        } else {
          this.axiosInstance
            .patch(process.env.VUE_APP_BACKEND_LINK + "emp/users/updateimg", {
              email: email,
              profilePic: reader.result,
            })
            .then((response) => {
              self.profilePic = reader.result;
              self.$store.state.user.profilePic = reader.result;
              self.displayNotification(
                "PROFILE PICTURE UPDATE SUCCESSFULLY",
                "#19946b"
              );
            })
            .catch((error) => {
              self.displayNotification(
                "PROFILE PICTURE UPDATE FAILED",
                "#94193c"
              );
            });
        }
      };
    },
    updateField(data) {
      this.employerName = data.employerName;
      this.employerWebsite = data.employerWebsite;
      this.employerIndustry = data.employerIndustry;
      this.employerAddressStreet = data.employerAddressStreet;
      this.employerAddressCity = data.employerAddressCity;
      this.employerAddressState = data.employerAddressState;
      this.employerContactPerson = data.employerContactPerson;
      this.employerContactPersonNo = data.employerContactPersonNo;
      this.employerContactPersonEmail = data.employerContactPersonEmail;
    },
    editProfile() {
      this.disableInput = !this.disableInput;
      if (this.disableInput) {
        let data = this.employerData;
        this.updateField(data);
      }
    },
  },
  async created() {
    this.axiosInstance = axiosConfig(
      this.$store.state.user.token,
      this.$store.state.user.role.toLowerCase()
    );
    this.populateInfo();
    this.profilePic = this.$store.state.user.profilePic;
  },
};
</script>
<style></style>

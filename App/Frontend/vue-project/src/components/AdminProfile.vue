<!-- This is the subcomponent for Admin person info on profile page

  @author Suchit Krishna <skri0010@student.monash.edu>
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<style>
    @import "../assets/styles/profile-card.css";
    </style>
    
    <template>
      <v-card>
        <v-img
          height="250"
          src="https://images.unsplash.com/photo-1584968153986-3f5fe523b044?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
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
    
        <v-card-text>{{
          firstname + " " + lastname + " " + displayPronoun(selectedPronoun)
        }}</v-card-text>
        <v-card-text>You Currently Have {{ role }} Privileges</v-card-text>
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
        role:"",
      }),
      methods: {
        submit() {
          let data = this.$store.state.user;
          this.submitDetails(data.email);
        },
        displayPronoun(selectedPronoun) {
          if (selectedPronoun != "") {
            return "(" + selectedPronoun + ")";
          } else {
            return "";
          }
        },
        loadDetails(email) {
          // load details of admin from database.
          let self = this;
          axiosInstance
            .get(process.env.VUE_APP_BACKEND_LINK+"admin/users/retrieve", {
              params: {
                email: email,
              },
            })
            .then((response) => self.displayDetails(response.data));
        },
        loadProfilePic(email) {
          // load profile pic of admin from database.
          axiosInstance
            .get(process.env.VUE_APP_BACKEND_LINK+"admin/users/getimg", {
              params: {
                email: email,
              },
            })
            .then((response) => {
            console.log("here")
            console.log(response)
              if (response.data.length != 0 && response.data[0].image != null) {
                this.profilePic = response.data[0].image;
              } else {
                this.profilePic = this.$store.state.user.profilePic; // default profile pic
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },
        displayDetails(response) {
          // Display details from local store
          this.firstname = this.$store.state.user.firstName;
          this.lastname = this.$store.state.user.lastName;
          this.email = this.$store.state.user.email;
          this.selectedPronoun = response.pronouns;
          this.role = this.$store.state.user.role;

        },
        submitDetails(email) {
          // store details of admin into database
          axiosInstance
            .patch(process.env.VUE_APP_BACKEND_LINK+"admin/users/retrieve", {
              email: email,
              firstName: this.firstname,
              lastName: this.lastname,
              pronouns: this.selectedPronoun,
            })
            .catch((error) => console.log(error));
        },
    
        // this method is used to update the profile pic of the user
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
                .patch(process.env.VUE_APP_BACKEND_LINK+"admin/users/updateimg", {
                  email: email,
                  profilePic: reader.result,
                })
                .then((response) => {
                  console.log(response);
                  this.profilePic = reader.result;
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          };
        },
        uploadProfilePic(email, imageB64) {
          // upload profile pic of admin from database.
          axiosInstance
            .post(process.env.VUE_APP_BACKEND_LINK+"admin/users/uploadimg", {
              email: email,
              profilePic: imageB64,
            })
            .then((response) => {
              console.log(response);
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
    
        // console.log("Profile card mounted");
        let data = this.$store.state.user;
        this.loadDetails(data.email);
        this.loadProfilePic(data.email);
      },
    };
    </script>
    
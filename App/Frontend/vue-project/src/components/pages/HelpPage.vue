<!-- This is the help page component.
     Help page allows access to user decumentation that serves as a guide on how to utilise the application.

  @author Jacky Foo <jfoo0016@student.monash.edu>
  
  Created at     : 28-09-2022 19:40
  Last modified  : 20-10-2022 21:12
-->
<template>
    <v-container fluid>
        <v-card>
            <v-card-title>Help page</v-card-title>
            <span class="text-left">
                <v-card-text>The place to get help for usage of the application</v-card-text>
            </span>
        </v-card>

        <v-card>
            <v-card-title>
                Documentation
            </v-card-title>
            <span class="text-left">
                <v-card-text>Click on the button below to access the user guide</v-card-text>
            </span>


            <v-col class="text-left">
                <v-btn color="primary" @click="openUserGuide()">
                    User guide
                </v-btn>
            </v-col>
        </v-card>
    </v-container>
</template>

<script>
export default {
    methods: {
        openUserGuide() {
            let user = this.$store.state.user;

            if (user.role == "STUDENT") {
                window.open("https://docs.google.com/document/d/1fogM80EYCgvqwZCYcCoMweFyaElYIL8CLj1dcAoh1oo/edit?usp=sharing")
            } else if (user.role == "EMPLOYER") {
                window.open("https://docs.google.com/document/d/1fogM80EYCgvqwZCYcCoMweFyaElYIL8CLj1dcAoh1oo/edit?usp=sharing")
            } else if (user.role == "ADMIN") {
                window.open("https://docs.google.com/document/d/1fogM80EYCgvqwZCYcCoMweFyaElYIL8CLj1dcAoh1oo/edit?usp=sharing")
            } else if (user.role == "COADMIN") {
                window.open("https://docs.google.com/document/d/1fogM80EYCgvqwZCYcCoMweFyaElYIL8CLj1dcAoh1oo/edit?usp=sharing")
            } else {
                window.open("https://docs.google.com/document/d/1fogM80EYCgvqwZCYcCoMweFyaElYIL8CLj1dcAoh1oo/edit?usp=sharing")
            }
        }
    },
    mounted() {
    },
}
</script>
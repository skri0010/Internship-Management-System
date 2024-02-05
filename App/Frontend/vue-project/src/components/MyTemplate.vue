<!-- This is a base template that can be used for the development of other pages

  @author Jacky Foo <jfoo0016@student.monash.edu>

  Created at     : 7-04-2022 10:00
  Last modified  : 20-10-2022 23:15
-->

<template>
  <!-- The main container for the app-->
  <v-app id="inspire">
    <!-- navigation drawer at the left size of the screen-->
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        

        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Monash-Intern
          </v-list-item-title>
          <v-list-item-subtitle>
            by students for students
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to = "item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Monash-Intern</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <!--  -->
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
        drawer: null,
        items: [
          { title: 'Home', icon: 'mdi-view-dashboard', path: '/' },
          { title: 'SignUp', icon: 'mdi-image', path: '/login' },
          { title: 'Template', icon: 'mdi-help-box', path: '/mytemplate' },
        ], 
    }),
    
  }
</script>
<template>
  <!-- Somehow the topbar btns will bug if I use this piece of code instead of the btm one -->
  <!-- <div id="app">
    <SideBar :drawer="drawer" />
    <TopBar @drawer-event="drawer = !drawer" />

    <v-main>
      
    </v-main>
  </div> -->

  <v-app id="app">
    <SideBar :drawer="drawer" />
    <TopBar v-click-outside="onClickOutside" @drawer-event="drawer = !drawer" />
    <v-main style="background: #f5f5f540" >
      <v-container class="pa-0" fluid>
        <router-view @close="drawer = false"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from "./components/SideBar.vue";
import TopBar from "./components/TopBar.vue";
import axios from "axios";

// axios.defaults.headers.common['authorization'] = this.$store.state.user.token
// axios.defaults.headers.common['authorization'] = self.$store.state.user.token
// axios.defaults.headers.common['role'] = this.$store.state.user.role.toLowerCase();

export default {
  components: { TopBar, SideBar },
  data: () => ({
    drawer: false,
  }),
  async mounted() {
    let userData;

    //get the token from backend
    await axios
      .get(process.env.VUE_APP_BACKEND_LINK+"visitor/users/resolve", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.length === 0) {
          //User is redirected to signon page to signin again due to token being expired.
          this.$router.push({ name: "login" });
        } else {
          userData = res.data;
          //Setting important data in vuex global store
          this.$store.state.user.auth = true;
          this.$store.state.user.token = userData.token;
          this.$store.state.user.email = userData.user.email;
          this.$store.state.user.id = userData.userDb[0]._id;
          this.$store.state.user.firstName = userData.user.given_name;
          this.$store.state.user.lastName = userData.user.family_name;
          this.$store.state.user.profilePic =
            userData.userDb[0].image != null
              ? userData.userDb[0].image
              : userData.user.picture;
          this.$store.state.user.role = userData.userDb[0].userRole;
        }
      })
      .catch((err) => {
        console.log(err);
        this.$router.push({ name: "login" });
      });
  },
  methods: {
    onClickOutside () {
        this.drawer = false
      },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>

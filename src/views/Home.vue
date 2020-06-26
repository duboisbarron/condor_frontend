<template>
  <v-app>
    <v-row align-content="center">
      <v-col cols="2" />
      <v-col cols="4">
        <v-hover
          v-slot:default="{ hover }"
        >

          <v-card
            :elevation="hover ? 12 : 2"
            class="mx-auto"
            height="100"
            max-width="350"
            @click="go_to_graph"
          >
            <h1 style="color: seagreen;">
              Option Graphs
            </h1>
          </v-card>
        </v-hover>
      </v-col>

      <v-col cols="4">
        <v-hover
          v-slot:default="{ hover }"
        >
          <v-card
            :elevation="hover ? 12 : 2"
            class="mx-auto"
            height="100"
            max-width="350"
            @click="go_to_condors"
          >
            <h1 style="color: seagreen;">
              Find Iron Condors
            </h1>
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="2" />
    </v-row>
  </v-app>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import router from '../router'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    go_to_graph () {
      console.log('clicked card')
      router.push('/options')
    },
    go_to_condors () {
      router.push('/condors')
    }
  }
}
</script>

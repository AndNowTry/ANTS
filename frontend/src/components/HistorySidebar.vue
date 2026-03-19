<template>
  <VNavigationDrawer
      temporary
      width="300"
      elevation="2"
      touchless
      class="app-customizer"
      expand-on-hover
      permanent
      rail
  >
    <v-list>
      <v-list-item
          prepend-icon="mdi-history"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
      <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
    </v-list>
  </VNavigationDrawer>
</template>


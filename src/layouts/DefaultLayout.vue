<template>
    <div class="app-layout">
      <HeaderLayout />
      <MainLayout>
        <slot></slot>
      </MainLayout>
    </div>
  </template>
  
  <script setup>
  import HeaderLayout from './HeaderLayout.vue';
  import MainLayout from './MainLayout.vue';
  </script>
  
  <style scoped>
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  </style>
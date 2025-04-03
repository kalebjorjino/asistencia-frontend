<template>
    <main class="app-main container mx-auto py-8 px-4">
      <slot></slot>
    </main>
  </template>
  
  <style scoped>
  .app-main {
    flex-grow: 1; /* El main content ocupa el espacio restante */
    /* Otros estilos específicos para el main content si los hay */
  }
  </style>
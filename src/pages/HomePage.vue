<script setup>
import FormBuilderLayout from "../layouts/FormBuilderLayout.vue";
import FormBuilderDragDropLayout from "../layouts/FormBuilderDragDropLayout.vue";
</script>

<template>
  <div>
    <div class="container mt-5">
      <RouterLink class="btn btn-info" to="/edit">Edit Form Builder</RouterLink>
      <h1 class="mb-4">Dynamic Form Builder</h1>
      <FormBuilderLayout />
    </div>
  </div>
</template>

<style scoped></style>

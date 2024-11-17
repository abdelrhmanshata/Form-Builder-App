<script setup>
import FormBuilderLayout from "../layouts/FormBuilderLayout.vue";
import FormBuilderDragDropLayout from "../layouts/FormBuilderDragDropLayout.vue";
</script>

<template>
  <div>
    <div class="container my-10">
      <RouterLink class="btn btn-danger" to="/">Back</RouterLink>
      <hr />
      <FormBuilderDragDropLayout />
    </div>
  </div>
</template>

<style scoped></style>

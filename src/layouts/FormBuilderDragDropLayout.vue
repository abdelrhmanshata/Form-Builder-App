<template>
  <div>
    <div class="container">
      <h1 class="mb-4">Dynamic Form Builder</h1>
      <BasicFormBuilder :schema="formSchema" @form-submit="handleFormSubmit" />
      <hr />
      <h1 class="mb-4">Dynamic Form Builder (Drag - Drop)</h1>
      <FormBuilder
        :schema="formSchema"
        @form-submit="handleFormSubmit"
        @schema-update="updateSchema"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import BasicFormBuilder from "../components/BasicFormBuilder/BasicFormBuilder.vue";
import FormBuilder from "../components/DragDropFormBuilder/FormBuilder.vue";

const SCHEMA_STORAGE_KEY = "formSchema";

const formSchema = ref(
  // if not found schema you can use the default schema
  JSON.parse(localStorage.getItem(SCHEMA_STORAGE_KEY)) || [
    {
      model: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
      required: true,
    },
    {
      model: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
    {
      model: "age",
      label: "Age",
      type: "number",
      placeholder: "Enter your age",
      required: true,
    },
    {
      model: "bio",
      label: "Bio",
      type: "textarea",
      placeholder: "Enter your bio",
      required: false,
    },
    {
      model: "newsletter",
      label: "Subscribe to newsletter",
      type: "checkbox",
      required: false,
    },
    {
      model: "gender",
      label: "Gender",
      type: "radio",
      options: ["Male", "Female"],
      required: false,
    },
  ]
);

const handleFormSubmit = (formData) => {
  console.log("Form data submitted from FormBuilder:", formData);
};

const updateSchema = (updatedSchema) => {
  formSchema.value = [...updatedSchema];
  localStorage.setItem(SCHEMA_STORAGE_KEY, JSON.stringify(formSchema.value));
  console.log(
    "Schema updated in parent and saved to localStorage:",
    formSchema.value
  );
};

onMounted(() => {
  console.log("Loaded schema from localStorage:", formSchema.value);
});
</script>

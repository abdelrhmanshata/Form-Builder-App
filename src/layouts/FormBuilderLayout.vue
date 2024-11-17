<template>
  <div>
    <div class="container">
      <FormBuilder :schema="formSchema" @form-submit="handleFormSubmit" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FormBuilder from "../components/BasicFormBuilder/BasicFormBuilder.vue";

// Define the form schema using `ref` to make it reactive
const formSchema = ref([
  {
    type: "text",
    label: "Name",
    model: "name",
    placeholder: "Enter your name",
  },
  {
    type: "email",
    label: "Email",
    model: "email",
    placeholder: "Enter your email",
  },
  {
    type: "number",
    label: "Age",
    model: "age",
    placeholder: "Enter your age",
  },
  {
    type: "select",
    label: "Gender",
    model: "gender",
    options: ["Male", "Female", "Other"],
  },
  {
    type: "textarea",
    label: "Bio",
    model: "bio",
    placeholder: "Tell us about yourself",
  },
  { type: "checkbox", label: "Agree to Terms", model: "agree" },
  {
    type: "radio",
    label: "Subscription",
    model: "subscription",
    options: ["Basic", "Premium"],
  },
]);

// Event handler for form submission
const handleFormSubmit = (data) => {
  console.log("Form Data Received:", data);
};
</script>

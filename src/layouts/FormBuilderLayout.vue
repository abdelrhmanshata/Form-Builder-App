<template>
  <div>
    <div class="container">
      <FormBuilder :schema="formSchema" @form-submit="handleFormSubmit" />
    </div>
  </div>
</template>

<script>
import FormBuilder from "../components/BasicFormBuilder/BasicFormBuilder.vue";

export default {
  name: "FormBuilderLayout",
  components: { FormBuilder },
  data() {
    return {
      formSchema: [
        {
          type: "text",
          label: "Name",
          model: "name",
          placeholder: "Enter your name",
        },
        {
          type: "text",
          label: "Name1",
          model: "name1",
          placeholder: "Enter your name",
        },
        {
          type: "text",
          label: "First Name",
          model: "firstName",
          placeholder: "Enter your first name",
        },
        {
          type: "text",
          label: "Last Name",
          model: "lastName",
          placeholder: "Enter your last name",
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
      ],
    };
  },
  methods: {
    handleFormSubmit(data) {
      console.log("Form Data Received:", data);
    },
  },
};
</script>

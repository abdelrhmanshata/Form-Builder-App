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

<script>
import BasicFormBuilder from "../components/BasicFormBuilder/BasicFormBuilder.vue";
import FormBuilder from "../components/DragDropFormBuilder/FormBuilder.vue";

export default {
  name: "FormBuilderDragDropLayout",
  components: {
    BasicFormBuilder,
    FormBuilder,
  },
  data() {
    return {
      formSchema: [
        {
          model: "name",
          label: "Name",
          type: "text",
          placeholder: "Enter your name",
        },
        {
          model: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        {
          model: "age",
          label: "Age",
          type: "number",
          placeholder: "Enter your age",
        },
        {
          model: "bio",
          label: "Bio",
          type: "textarea",
          placeholder: "Enter your bio",
        },
        {
          model: "newsletter",
          label: "Subscribe to newsletter",
          type: "checkbox",
        },
        {
          model: "gender",
          label: "Gender",
          type: "radio",
          options: ["Male", "Female"],
        },
      ],
    };
  },
  methods: {
    handleFormSubmit(formData) {
      console.log("Form data submitted from FormBuilder:", formData);
    },
    updateSchema(updatedSchema) {
      this.formSchema = [...updatedSchema]; // تحديث النسخة الأصلية من الـ schema
      console.log("Schema updated in parent:", this.formSchema);
    },
  },
};
</script>

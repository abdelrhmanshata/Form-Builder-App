<template>
  <form @submit.prevent="handleSubmit" class="p-4 bg-light border rounded">
    <div v-for="field in schema" :key="field.model" class="mb-3">
      <!-- Label -->
      <label :for="field.model" class="form-label">{{ field.label }}</label>

      <!-- Input Fields -->
      <input
        v-if="['text', 'email', 'number', 'password'].includes(field.type)"
        :type="field.type"
        :id="field.model"
        :placeholder="field.placeholder"
        v-model="formData[field.model]"
        class="form-control"
      />

      <!-- Select Dropdown -->
      <select
        v-if="field.type === 'select'"
        :id="field.model"
        v-model="formData[field.model]"
        class="form-select"
      >
        <option value="" disabled>Select {{ field.label }}</option>
        <option v-for="option in field.options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <!-- Checkbox -->
      <div v-if="field.type === 'checkbox'" class="form-check">
        <input
          :id="field.model"
          type="checkbox"
          v-model="formData[field.model]"
          class="form-check-input"
        />
        <label :for="field.model" class="form-check-label">{{
          field.label
        }}</label>
      </div>

      <!-- Radio Buttons -->
      <div v-if="field.type === 'radio'">
        <div class="form-check" v-for="option in field.options" :key="option">
          <input
            :id="`${field.model}-${option}`"
            :value="option"
            type="radio"
            v-model="formData[field.model]"
            class="form-check-input"
          />
          <label :for="`${field.model}-${option}`" class="form-check-label">
            {{ option }}
          </label>
        </div>
      </div>

      <!-- Textarea -->
      <textarea
        v-if="field.type === 'textarea'"
        :id="field.model"
        :placeholder="field.placeholder"
        v-model="formData[field.model]"
        rows="3"
        class="form-control"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button type="submit" class="btn btn-primary w-100">Submit</button>
  </form>
</template>

<script>
export default {
  name: "BasicFormBuilder",
  props: {
    schema: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      formData: {},
    };
  },
  created() {
    // Initialize formData with default values
    this.schema.forEach((field) => {
      if (field.type === "checkbox") {
        this.formData[field.model] = false;
      } else if (field.type === "radio") {
        this.formData[field.model] = null;
      } else {
        this.formData[field.model] = "";
      }
    });
  },
  methods: {
    handleSubmit() {
      console.log("Form submitted:", this.formData);
      this.$emit("form-submit", this.formData); // Emit form data to parent
    },
  },
};
</script>

<style scoped>
/* Add custom padding for better spacing if necessary */
.form-check {
  margin-bottom: 0.5rem;
}
</style>

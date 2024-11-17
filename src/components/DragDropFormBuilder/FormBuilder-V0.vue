<template>
  <div class="form-builder-container">
    <!-- Sidebar with available fields -->
    <div class="sidebar">
      <h3>Available Fields</h3>
      <div
        v-for="field in availableFields"
        :key="field.model"
        class="field-item"
        :draggable="true"
        @dragstart="onDragStart(field)"
      >
        <span>{{ field.label }}</span>
      </div>
    </div>

    <!-- Form Area with Drag and Drop support -->
    <form @submit.prevent="handleSubmit" class="p-4 bg-light border rounded">
      <div
        v-for="(field, index) in schema"
        :key="index"
        class="mb-3"
        @drop.prevent="onDrop($event, field)"
        @dragover.prevent
      >
        <!-- Dynamic Form Fields based on schema -->
        <label :for="field.model" class="form-label">{{ field.label }}</label>
        <!-- The same input handling as in your original code (text, select, etc.) -->
        <input
          v-if="['text', 'email', 'number', 'password'].includes(field.type)"
          :type="field.type"
          :id="field.model"
          v-model="formData[field.model]"
          class="form-control"
        />
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
        <textarea
          v-if="field.type === 'textarea'"
          :id="field.model"
          v-model="formData[field.model]"
          class="form-control"
          :placeholder="field.placeholder"
        ></textarea>
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
        <div v-if="field.type === 'radio'" class="form-check">
          <input
            type="radio"
            v-model="formData[field.model]"
            :id="field.model"
            :value="field.value"
            class="form-check-input"
          />
          <label :for="field.model" class="form-check-label">{{
            field.label
          }}</label>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary w-100">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "FormBuilder",
  props: {
    schema: {
      type: Array,
      required: true,
      default: () => [], // Default value in case schema is not passed
    },
  },
  data() {
    return {
      formData: {},
      availableFields: [
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
  created() {
    // Ensure schema exists and initialize form data
    if (this.schema && Array.isArray(this.schema)) {
      this.initializeFormData();
    } else {
      console.warn("schema is not defined or not an array");
    }
  },
  methods: {
    initializeFormData() {
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
    handleSubmit() {
      console.log("Form submitted:", this.formData);
      this.$emit("form-submit", this.formData); // Emit the form data to parent
    },
    onDragStart(field) {
      this.draggedField = field;
    },
    onDrop(event, field) {
      const index = this.schema.indexOf(field);
      this.schema.splice(index, 0, this.draggedField);
      this.initializeFormData(); // Reinitialize form data to match new schema
    },
  },
};
</script>

<style scoped>
.form-builder-container {
  display: flex;
  gap: 2rem;
}

.sidebar {
  width: 200px;
  border-right: 1px solid #ccc;
  padding: 10px;
}

.field-item {
  cursor: pointer;
  padding: 8px;
  background: #f0f0f0;
  margin-bottom: 10px;
  border-radius: 5px;
}

.field-item:hover {
  background: #ddd;
}
</style>

<template>
  <div class="form-builder-container">
    <!-- Sidebar with available fields -->
    <div class="sidebar w-25">
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
      <hr />
      <!-- Control Panel for selected field -->
      <div v-if="selectedField" class="control-panel mt-4">
        <h4>Edit Field</h4>
        <label>Field Label</label>
        <input
          v-model="selectedField.label"
          type="text"
          class="form-control"
          placeholder="Enter field label"
        />

        <!-- <label>Field Type</label>
        <select v-model="selectedField.type" class="form-select">
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="number">Number</option>
          <option value="textarea">Textarea</option>
          <option value="select">Select</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
        </select> -->

        <!-- Placeholder (for input, textarea, etc.) -->
        <!-- <div
          v-if="
            ['text', 'email', 'number', 'textarea'].includes(selectedField.type)
          "
        >
          <label>Placeholder</label>
          <input
            v-model="selectedField.placeholder"
            type="text"
            class="form-control"
            placeholder="Enter placeholder"
          />
        </div> -->

        <!-- Options for select, radio (dynamic) -->
        <!-- <div v-if="['select', 'radio'].includes(selectedField.type)">
          <label>Options</label>
          <div
            v-for="(option, index) in selectedField.options"
            :key="index"
            class="input-group mb-2"
          >
            <input
              v-model="selectedField.options[index]"
              type="text"
              class="form-control"
              placeholder="Enter option"
            />
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="removeOption(index)"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="addOption"
          >
            Add Option
          </button>
        </div> -->

        <button
          type="button"
          class="btn btn-outline-success mt-3 flex-1 w-100"
          @click="saveFieldChanges"
        >
          Save Changes
        </button>
      </div>
    </div>

    <!-- Form Area with Drag and Drop support -->
    <form
      @submit.prevent="handleSubmit"
      class="p-4 bg-light border rounded w-75"
    >
      <div
        v-for="(field, index) in schema"
        :key="field.model"
        class="p-1"
        @drop.prevent="onDrop($event, field)"
        @dragover.prevent
        @click="selectField(index)"
      >
        <!-- Label -->
        <label :for="field.model" class="form-label">{{ field.label }}</label>
        <!-- Field -->
        <div class="d-flex">
          <div class="flex-1-1">
            <!-- Dynamic Form Fields based on schema -->
            <input
              v-if="
                ['text', 'email', 'number', 'password'].includes(field.type)
              "
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
              <option
                v-for="option in field.options"
                :key="option"
                :value="option"
              >
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
          <!-- Action Buttons for Edit and Remove -->
          <div class="p-2 d-flex justify-end align-center">
            <v-icon class="text-red" @click="removeField(index)">
              mdi-close-circle-outline
            </v-icon>
          </div>
        </div>
      </div>
      <!-- Submit Button: only visible when formData has data -->
      <!-- <button v-if="isFormValid" type="submit" class="btn btn-primary w-100">
        Submit
      </button> -->
      <button
        type="button"
        class="btn btn-primary w-100 mt-10"
        @click="saveSchema"
      >
        Save Schema
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { defineProps, defineEmits } from "vue";

// تعريف الخصائص (Props) والأحداث (Emits)
const props = defineProps({
  schema: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["form-submit", "schema-update"]);

// البيانات (Data)
const formData = ref({});
const selectedField = ref(null);
const availableFields = ref([
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
]);

// الحقول المسحوبة أثناء السحب
const draggedField = ref(null);

// إعداد البيانات عند الإنشاء
const initializeFormData = () => {
  formData.value = {};
  props.schema.forEach((field) => {
    if (field.type === "checkbox") {
      formData.value[field.model] = false;
    } else if (field.type === "radio") {
      formData.value[field.model] = null;
    } else {
      formData.value[field.model] = "";
    }
  });
};

// الحقل المطلوب لتحديد ما إذا كان النموذج صالحًا
const isFormValid = computed(() => Object.keys(formData.value).length > 0);

// دالة لإرسال البيانات عند تقديم النموذج
const handleSubmit = () => {
  console.log("Form submitted:", formData.value);
  emit("form-submit", formData.value);
};

// التعامل مع السحب والإفلات
const onDragStart = (field) => {
  draggedField.value = field;
};

const onDrop = (event, field) => {
  const index = props.schema.indexOf(field);
  if (index !== -1) {
    props.schema.splice(index, 0, draggedField.value);
    initializeFormData();
  }
};

// تعديل وإزالة الحقول
const removeField = (index) => {
  const removedField = props.schema.splice(index, 1)[0];
  delete formData.value[removedField.model];
};

const selectField = (index) => {
  selectedField.value = { ...props.schema[index] };
};

const saveFieldChanges = () => {
  const index = props.schema.findIndex(
    (field) => field.model === selectedField.value.model
  );
  if (index !== -1) {
    props.schema[index] = { ...selectedField.value };
    selectedField.value = null;
    initializeFormData();
  }
};

// إضافة أو إزالة الخيارات
const addOption = () => {
  if (selectedField.value) {
    selectedField.value.options.push("");
  }
};

const removeOption = (index) => {
  if (selectedField.value) {
    selectedField.value.options.splice(index, 1);
  }
};

// إرسال التحديثات للمكون الأب
const saveSchema = () => {
  emit("schema-update", props.schema);
  console.log("Schema saved");
};

// مراقبة تغييرات الـ schema
watch(
  () => props.schema,
  (newSchema) => {
    initializeFormData();
  },
  { immediate: true }
);
</script>

<style scoped>
.form-builder-container {
  display: flex;
  gap: 2rem;
}

.sidebar {
  width: 250px;
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

.control-panel {
  padding-top: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 15px;
}

.input-group {
  display: flex;
  gap: 10px;
}
.action-buttons {
  display: flex;
  gap: 2px;
}
</style>

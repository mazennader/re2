/* =========================
   JCR ADMIN DASHBOARD
   PART 1
========================= */
/* =========================
   ADMIN PROTECTION
========================= */

async function protectAdminPage() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) {
    window.location.href = "jcr-login-2026.html";
    return;
  }

  document.body.classList.remove("admin-checking");
}

const BUCKET_NAME = "property-images";
const FALLBACK_IMAGE = "images/logo.jpeg";

let properties = [];
let selectedFiles = [];
let editingPropertyId = null;
let existingImages = [];
let propertyToDelete = null;

/* =========================
   DOM ELEMENTS
========================= */

const propertyForm = document.getElementById("propertyForm");
const propertyIdInput = document.getElementById("propertyId");

const titleInput = document.getElementById("title");
const locationInput = document.getElementById("location");
const countryInput = document.getElementById("country");
const priceInput = document.getElementById("price");
const typeInput = document.getElementById("type");
const bedsInput = document.getElementById("beds");
const bathsInput = document.getElementById("baths");
const parkingInput = document.getElementById("parking");
const houseAreaInput = document.getElementById("houseArea");
const landAreaInput = document.getElementById("landArea");
const descriptionInput = document.getElementById("description");
const propertyImagesInput = document.getElementById("propertyImages");

const imagePreviewGrid = document.getElementById("imagePreviewGrid");
const propertiesList = document.getElementById("propertiesList");
const emptyState = document.getElementById("emptyState");

const totalPropertiesEl = document.getElementById("totalProperties");
const housePropertiesEl = document.getElementById("houseProperties");
const landPropertiesEl = document.getElementById("landProperties");
const apartmentRentPropertiesEl =
  document.getElementById("apartmentRentProperties");

const adminSearchInput = document.getElementById("adminSearchInput");
const refreshBtn = document.getElementById("refreshBtn");
const savePropertyBtn = document.getElementById("savePropertyBtn");
const clearFormBtn = document.getElementById("clearFormBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");

const adminAlert = document.getElementById("adminAlert");
const adminAlertText = document.getElementById("adminAlertText");

const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* =========================
   LOAD PROPERTIES
========================= */

async function loadAdminProperties() {
  showAlert("Loading properties...", "info");

  const { data, error } = await supabaseClient
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    showAlert("Failed to load properties.", "error");
    return;
  }

  properties = data || [];

  renderDashboardStats();
  renderPropertiesList(properties);

  showAlert("Properties loaded successfully.", "success");
}

/* =========================
   DASHBOARD STATS
========================= */

function renderDashboardStats() {
  const total = properties.length;

  const houses = properties.filter((property) => {
    return (
      property.type === "sale" ||
      property.type === "villa" ||
      property.type === "house"
    );
  }).length;

  const lands = properties.filter((property) => {
    return property.type === "land";
  }).length;

  const apartmentsRentals = properties.filter((property) => {
    return (
      property.type === "apartment" ||
      property.type === "rent" ||
      property.type === "chalet"
    );
  }).length;

  totalPropertiesEl.innerText = total;
  housePropertiesEl.innerText = houses;
  landPropertiesEl.innerText = lands;
  apartmentRentPropertiesEl.innerText = apartmentsRentals;
}

/* =========================
   RENDER PROPERTY LIST
========================= */

function renderPropertiesList(list) {
  propertiesList.innerHTML = "";

  if (!list || list.length === 0) {
    emptyState.classList.add("show");
    return;
  }

  emptyState.classList.remove("show");

  list.forEach((property) => {
    const card = document.createElement("div");
    card.className = "admin-property-card";

    const image =
      property.images && property.images.length > 0
        ? property.images[0]
        : FALLBACK_IMAGE;

    card.innerHTML = `
      <div class="admin-property-img">
        <img src="${image}" alt="${property.title || "Property"}">
      </div>

      <div class="admin-property-info">
        <h3>${property.title || "Untitled Property"}</h3>

        <p>
          <i class="fa-solid fa-location-dot"></i>
          ${property.location || "Location not added"}
        </p>

        <div class="property-tags">
          <span class="gold-tag">
            ${formatPrice(property.price)}
          </span>

          <span>
            ${formatType(property.type)}
          </span>

          <span>
            <i class="fa-solid fa-house"></i>
            ${property.house_area || "No house area"}
          </span>

          <span>
            <i class="fa-solid fa-tree"></i>
            ${property.land_area || "No land area"}
          </span>

          <span>
            <i class="fa-solid fa-bed"></i>
            ${property.beds || 0} Beds
          </span>

          <span>
            <i class="fa-solid fa-bath"></i>
            ${property.baths || 0} Baths
          </span>
        </div>
      </div>

      <div class="admin-property-actions">
        <button class="icon-btn edit-btn" data-id="${property.id}" title="Edit">
          <i class="fa-solid fa-pen"></i>
        </button>

        <button class="icon-btn delete delete-btn" data-id="${property.id}" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    propertiesList.appendChild(card);
  });

  attachPropertyActionEvents();
}

/* =========================
   SEARCH
========================= */

function handleAdminSearch() {
  const term = adminSearchInput.value.toLowerCase().trim();

  const filtered = properties.filter((property) => {
    return (
      String(property.title || "").toLowerCase().includes(term) ||
      String(property.location || "").toLowerCase().includes(term) ||
      String(property.country || "").toLowerCase().includes(term) ||
      String(property.type || "").toLowerCase().includes(term) ||
      String(property.price || "").toLowerCase().includes(term) ||
      String(property.house_area || "").toLowerCase().includes(term) ||
      String(property.land_area || "").toLowerCase().includes(term)
    );
  });

  renderPropertiesList(filtered);
}

/* =========================
   HELPERS PART 1
========================= */

function formatPrice(price) {
  if (!price) return "Price on request";

  return `$${Number(price).toLocaleString()}`;
}

function formatType(type) {
  if (type === "sale") return "Villa / For Sale";
  if (type === "rent") return "Rental";
  if (type === "land") return "Land";
  if (type === "apartment") return "Apartment";
  if (type === "chalet") return "Chalet";
  if (type === "commercial") return "Commercial";
  if (type === "office") return "Office";

  return "Property";
}
/* =========================
   PART 2
   IMAGE PREVIEW + UPLOAD
   ADD PROPERTY
========================= */

/* =========================
   IMAGE SELECTION
========================= */

function handleImageSelection(event) {
    const files = Array.from(event.target.files);
  
    if (!files.length) return;
  
    selectedFiles = [...selectedFiles, ...files];
  
    renderImagePreviews();
  }
  
  function renderImagePreviews() {
    imagePreviewGrid.innerHTML = "";
  
    existingImages.forEach((imageUrl, index) => {
      const preview = document.createElement("div");
      preview.className = "preview-card";
  
      preview.innerHTML = `
        <img src="${imageUrl}" alt="Existing Image">
  
        <button type="button" class="remove-existing-image" data-index="${index}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
  
      imagePreviewGrid.appendChild(preview);
    });
  
    selectedFiles.forEach((file, index) => {
      const preview = document.createElement("div");
      preview.className = "preview-card";
  
      const imageUrl = URL.createObjectURL(file);
  
      preview.innerHTML = `
        <img src="${imageUrl}" alt="Selected Image">
  
        <button type="button" class="remove-new-image" data-index="${index}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
  
      imagePreviewGrid.appendChild(preview);
    });
  
    attachImageRemoveEvents();
  }
  
  function attachImageRemoveEvents() {
    document.querySelectorAll(".remove-new-image").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        selectedFiles.splice(index, 1);
        renderImagePreviews();
      });
    });
  
    document.querySelectorAll(".remove-existing-image").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        existingImages.splice(index, 1);
        renderImagePreviews();
      });
    });
  }
  
  /* =========================
     UPLOAD IMAGES
  ========================= */
  
  async function uploadImages(files) {
    const uploadedUrls = [];
  
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;
  
      const filePath = `properties/${fileName}`;
  
      const { error } = await supabaseClient.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);
  
      if (error) {
        console.error(error);
        throw new Error("Image upload failed.");
      }
  
      const { data } = supabaseClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);
  
      uploadedUrls.push(data.publicUrl);
    }
  
    return uploadedUrls;
  }
  
  /* =========================
     COLLECT FORM DATA
  ========================= */
  
  function getPropertyFormData(images) {
    return {
      title: titleInput.value.trim(),
      location: locationInput.value.trim(),
      country: countryInput.value,
      price: Number(priceInput.value),
      type: typeInput.value,
  
      beds: Number(bedsInput.value) || 0,
      baths: Number(bathsInput.value) || 0,
      parking: Number(parkingInput.value) || 0,
  
      house_area: houseAreaInput.value.trim() || null,
      land_area: landAreaInput.value.trim() || null,
  
      description: descriptionInput.value.trim() || null,
      images: images,
    };
  }
  
  /* =========================
     SAVE PROPERTY
  ========================= */
  
  async function handleSaveProperty(event) {
    event.preventDefault();
  
    if (!titleInput.value.trim()) {
      showAlert("Please add a property title.", "error");
      return;
    }
  
    if (!locationInput.value.trim()) {
      showAlert("Please add a location.", "error");
      return;
    }
  
    if (!priceInput.value) {
      showAlert("Please add a price.", "error");
      return;
    }
  
    try {
      savePropertyBtn.disabled = true;
      savePropertyBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Saving...
      `;
  
      showAlert("Uploading images and saving property...", "info");
  
      const uploadedImages = await uploadImages(selectedFiles);
  
      const finalImages = [...existingImages, ...uploadedImages];
  
      const propertyData = getPropertyFormData(finalImages);
  
      if (editingPropertyId) {
        await updateProperty(editingPropertyId, propertyData);
      } else {
        await createProperty(propertyData);
      }
  
      await loadAdminProperties();
  
      resetForm();
  
      showAlert("Property saved successfully.", "success");
    } catch (error) {
      console.error(error);
      showAlert(error.message || "Failed to save property.", "error");
    } finally {
      savePropertyBtn.disabled = false;
      savePropertyBtn.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Property
      `;
    }
  }
  
  /* =========================
     CREATE PROPERTY
  ========================= */
  
  async function createProperty(propertyData) {
    const { error } = await supabaseClient
      .from("properties")
      .insert([propertyData]);
  
    if (error) {
      console.error(error);
      throw new Error("Failed to create property.");
    }
  }
  
  /* =========================
     UPDATE PROPERTY PLACEHOLDER
     REAL FUNCTION COMES IN PART 3
  ========================= */
  
  async function updateProperty(id, propertyData) {
    const { error } = await supabaseClient
      .from("properties")
      .update(propertyData)
      .eq("id", id);
  
    if (error) {
      console.error(error);
      throw new Error("Failed to update property.");
    }
  }
  /* =========================
   PART 3
   EDIT + DELETE PROPERTY
========================= */

/* =========================
   ATTACH ACTION BUTTONS
========================= */

function attachPropertyActionEvents() {
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        startEditProperty(id);
      });
    });
  
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        openDeleteModal(id);
      });
    });
  }
  
  /* =========================
     EDIT PROPERTY
  ========================= */
  
  function startEditProperty(id) {
    const property = properties.find((item) => String(item.id) === String(id));
  
    if (!property) {
      showAlert("Property not found.", "error");
      return;
    }
  
    editingPropertyId = property.id;
    propertyIdInput.value = property.id;
  
    titleInput.value = property.title || "";
    locationInput.value = property.location || "";
    countryInput.value = property.country || "lebanon";
    priceInput.value = property.price || "";
    typeInput.value = property.type || "sale";
  
    bedsInput.value = property.beds || 0;
    bathsInput.value = property.baths || 0;
    parkingInput.value = property.parking || 0;
  
    houseAreaInput.value = property.house_area || "";
    landAreaInput.value = property.land_area || "";
  
    descriptionInput.value = property.description || "";
  
    existingImages = property.images || [];
    selectedFiles = [];
  
    renderImagePreviews();
  
    formTitle.innerText = "Edit Property";
  
    savePropertyBtn.innerHTML = `
      <i class="fa-solid fa-floppy-disk"></i>
      Update Property
    `;
  
    document
      .getElementById("property-form-section")
      .scrollIntoView({ behavior: "smooth" });
  
    showAlert("Editing property. Update the details and save.", "info");
  }
  
  /* =========================
     DELETE PROPERTY
  ========================= */
  
  function openDeleteModal(id) {
    propertyToDelete = id;
    deleteModal.classList.add("show");
  }
  
  function closeDeleteModal() {
    propertyToDelete = null;
    deleteModal.classList.remove("show");
  }
  
  async function confirmDeleteProperty() {
    if (!propertyToDelete) return;
  
    try {
      confirmDeleteBtn.disabled = true;
  
      confirmDeleteBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Deleting...
      `;
  
      const { error } = await supabaseClient
        .from("properties")
        .delete()
        .eq("id", propertyToDelete);
  
      if (error) {
        console.error(error);
        throw new Error("Failed to delete property.");
      }
  
      closeDeleteModal();
  
      await loadAdminProperties();
  
      if (editingPropertyId === propertyToDelete) {
        resetForm();
      }
  
      showAlert("Property deleted successfully.", "success");
    } catch (error) {
      console.error(error);
      showAlert(error.message || "Failed to delete property.", "error");
    } finally {
      confirmDeleteBtn.disabled = false;
  
      confirmDeleteBtn.innerHTML = `
        <i class="fa-solid fa-trash"></i>
        Delete Property
      `;
    }
  }
  
  /* =========================
     RESET FORM
  ========================= */
  
  function resetForm() {
    propertyForm.reset();
    countryInput.value = "lebanon";
  
    propertyIdInput.value = "";
    editingPropertyId = null;
    existingImages = [];
    selectedFiles = [];
  
    imagePreviewGrid.innerHTML = "";
  
    formTitle.innerText = "Add New Property";
  
    savePropertyBtn.innerHTML = `
      <i class="fa-solid fa-floppy-disk"></i>
      Save Property
    `;
  }
  /* =========================
   PART 4
   ALERTS + EVENTS + INIT
========================= */

function showAlert(message, type = "info") {
    adminAlert.className = `admin-alert show ${type}`;
    adminAlertText.innerText = message;
  
    setTimeout(() => {
      adminAlert.classList.remove("show");
    }, 3500);
  }
  
  /* =========================
     EVENTS
  ========================= */
  
  if (propertyForm) {
    propertyForm.addEventListener("submit", handleSaveProperty);
  }
  
  if (propertyImagesInput) {
    propertyImagesInput.addEventListener("change", handleImageSelection);
  }
  
  if (adminSearchInput) {
    adminSearchInput.addEventListener("keyup", handleAdminSearch);
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener("click", loadAdminProperties);
  }
  
  if (clearFormBtn) {
    clearFormBtn.addEventListener("click", resetForm);
  }
  
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", resetForm);
  }
  
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", closeDeleteModal);
  }
  
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", confirmDeleteProperty);
  }
  
  if (deleteModal) {
    deleteModal.addEventListener("click", (e) => {
      if (e.target === deleteModal) {
        closeDeleteModal();
      }
    });
  }
  
  /* =========================
     DRAG AND DROP
  ========================= */
  
  const uploadZone = document.getElementById("uploadZone");
  
  if (uploadZone) {
    uploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadZone.classList.add("dragging");
    });
  
    uploadZone.addEventListener("dragleave", () => {
      uploadZone.classList.remove("dragging");
    });
  
    uploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadZone.classList.remove("dragging");
  
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
  
      selectedFiles = [...selectedFiles, ...files];
      renderImagePreviews();
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      window.location.href = "jcr-login-2026.html";
    });
  }
  /* =========================
     START ADMIN
  ========================= */
  
  window.addEventListener("DOMContentLoaded", async () => {
    await protectAdminPage();
    loadAdminProperties();
  });
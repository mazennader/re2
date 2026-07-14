/* =========================
   SUPABASE PROPERTIES
========================= */

let properties = [];

const WHATSAPP_NUMBER = "96181193623";
const FALLBACK_IMAGE = "images/logo.jpeg";

/* =========================
   LOADER
========================= */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
    }, 700);
  }
});

/* =========================
   HELPERS
========================= */

function formatPrice(price) {
  if (!price) return "Price on request";

  return `$${Number(price).toLocaleString()}`;
}

function getBadgeText(type) {
  if (type === "sale") return "For Sale";
  if (type === "rent") return "For Rent";
  if (type === "land") return "Land";
  if (type === "villa") return "Villa";
  if (type === "apartment") return "Apartment";

  return "Property";
}

function getBadgeClass(type) {
  if (type === "sale") return "badge-sale";
  if (type === "rent") return "badge-rent";
  if (type === "land") return "badge-land";

  return "badge-sale";
}

function getImages(property) {
  if (property.images && property.images.length > 0) {
    return property.images;
  }

  return [FALLBACK_IMAGE];
}

function getAreaText(property) {
  const houseArea = property.house_area;
  const landArea = property.land_area;

  if (houseArea && landArea) {
    return `House: ${houseArea} | Land: ${landArea}`;
  }

  if (houseArea) {
    return `House: ${houseArea}`;
  }

  if (landArea) {
    return `Land: ${landArea}`;
  }

  return "Area on request";
}

function createWhatsAppLink(property) {
  const message = `Hello, I am interested in this property: ${property.title}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* =========================
   LOAD FROM SUPABASE
========================= */

async function loadProperties() {
  const { data, error } = await supabaseClient
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  properties = data || [];

  if (document.getElementById("propertiesGrid")) {
    renderProperties();
  }

  if (document.querySelector(".details-page")) {
    renderDetailsPage();
  }

  startScrollAnimations();
}

/* =========================
   HOME PAGE
========================= */

const propertiesGrid = document.getElementById("propertiesGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsText = document.getElementById("resultsText");
const filterButtons = document.querySelectorAll(".filter-btn");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const minPriceRange = document.getElementById("minPriceRange");
const maxPriceRange = document.getElementById("maxPriceRange");

const minPriceLabel = document.getElementById("minPriceLabel");
const maxPriceLabel = document.getElementById("maxPriceLabel");

const rangeProgress = document.getElementById("rangeProgress");

const priceSort = document.getElementById("priceSort");

const applyPriceFilter = document.getElementById("applyPriceFilter");
const resetPriceFilter = document.getElementById("resetPriceFilter");

let currentFilter = "all";
let visibleProperties = 6;

let appliedMinPrice = 0;
let appliedMaxPrice = 10000000;
let currentSort = "default";

function getNumericPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return null;
  }

  return numericPrice;
}

function formatFilterPrice(price) {
  return `$${Number(price).toLocaleString()}`;
}

function updatePriceSliderUI() {
  if (
    !minPriceRange ||
    !maxPriceRange ||
    !minPriceLabel ||
    !maxPriceLabel ||
    !rangeProgress
  ) {
    return;
  }

  let minValue = Number(minPriceRange.value);
  let maxValue = Number(maxPriceRange.value);

  const minimumGap = Number(minPriceRange.step) || 10000;

  if (maxValue - minValue < minimumGap) {
    if (document.activeElement === minPriceRange) {
      minValue = maxValue - minimumGap;
      minPriceRange.value = minValue;
    } else {
      maxValue = minValue + minimumGap;
      maxPriceRange.value = maxValue;
    }
  }

  minPriceLabel.innerText = formatFilterPrice(minValue);
  maxPriceLabel.innerText = formatFilterPrice(maxValue);

  const sliderMinimum = Number(minPriceRange.min);
  const sliderMaximum = Number(minPriceRange.max);
  const sliderRange = sliderMaximum - sliderMinimum;

  const minPercent =
    ((minValue - sliderMinimum) / sliderRange) * 100;

  const maxPercent =
    ((maxValue - sliderMinimum) / sliderRange) * 100;

  rangeProgress.style.left = `${minPercent}%`;
  rangeProgress.style.right = `${100 - maxPercent}%`;
}

function renderProperties() {
  if (!propertiesGrid || !searchInput || !resultsText) return;

  const searchTerm = searchInput.value.toLowerCase();

  let filtered = properties.filter((property) => {
    const priceText = formatPrice(property.price).toLowerCase();
    const areaText = getAreaText(property).toLowerCase();
    const numericPrice = getNumericPrice(property.price);
  
    const matchesSearch =
      String(property.title || "").toLowerCase().includes(searchTerm) ||
      String(property.location || "").toLowerCase().includes(searchTerm) ||
      String(property.type || "").toLowerCase().includes(searchTerm) ||
      priceText.includes(searchTerm) ||
      areaText.includes(searchTerm);
  
    const matchesCategory =
      currentFilter === "all" || property.type === currentFilter;
  
    const matchesPrice =
      numericPrice !== null &&
      numericPrice >= appliedMinPrice &&
      numericPrice <= appliedMaxPrice;
  
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  if (currentSort === "low-high") {
    filtered.sort((propertyA, propertyB) => {
      const priceA = getNumericPrice(propertyA.price);
      const priceB = getNumericPrice(propertyB.price);
  
      if (priceA === null) return 1;
      if (priceB === null) return -1;
  
      return priceA - priceB;
    });
  }
  
  if (currentSort === "high-low") {
    filtered.sort((propertyA, propertyB) => {
      const priceA = getNumericPrice(propertyA.price);
      const priceB = getNumericPrice(propertyB.price);
  
      if (priceA === null) return 1;
      if (priceB === null) return -1;
  
      return priceB - priceA;
    });
  }

  resultsText.innerText = `${filtered.length} properties available`;

propertiesGrid.innerHTML = "";

const propertiesToShow = filtered.slice(0, visibleProperties);

propertiesToShow.forEach((property, index) => {
    const images = getImages(property);
    const badgeText = getBadgeText(property.type);
    const badgeClass = getBadgeClass(property.type);

    const featureHtml = `
      <span>
        <i class="fa-solid fa-bed"></i>
        ${property.beds || 0}
      </span>

      <span>
        <i class="fa-solid fa-bath"></i>
        ${property.baths || 0}
      </span>

      <span>
        <i class="fa-solid fa-expand"></i>
        ${getAreaText(property)}
      </span>
    `;

    const card = document.createElement("div");
    card.className = "property-card";

    card.innerHTML = `
      <div class="property-image">
        <img src="${images[0]}" alt="${property.title || "Property"}">

        <div class="property-badge ${badgeClass}">
          ${badgeText}
        </div>
      </div>

      <div class="property-content">
        <h3 class="property-title">
          ${property.title || "Untitled Property"}
        </h3>

        <div class="property-location">
          <i class="fa-solid fa-location-dot"></i>
          ${property.location || "Location on request"}
        </div>

        <div class="property-price">
          ${formatPrice(property.price)}
        </div>

        <div class="property-features">
          ${featureHtml}
        </div>

        <div class="card-buttons">
          <button class="details-btn">
            View Details
          </button>

          <a
            href="${createWhatsAppLink(property)}"
            target="_blank"
            class="whatsapp-btn"
          >
            <i class="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `property-details.html?id=${property.id}`;
    });

    const whatsappBtn = card.querySelector(".whatsapp-btn");

    whatsappBtn.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    propertiesGrid.appendChild(card);

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 90 * index);
  });
  if (loadMoreBtn) {

    if (visibleProperties < filtered.length) {

        loadMoreBtn.style.display = "block";

    } else {

        loadMoreBtn.style.display = "none";

    }

}
}

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      currentFilter = button.dataset.filter;

visibleProperties = 6;

renderProperties();
    });
  });
}

if (searchBtn) {

  searchBtn.addEventListener("click", () => {

      visibleProperties = 6;

      renderProperties();

  });

}

if (searchInput) {

  searchInput.addEventListener("keyup", () => {

      visibleProperties = 6;

      renderProperties();

  });

}
if (loadMoreBtn) {

  loadMoreBtn.addEventListener("click", () => {

      visibleProperties += 6;

      renderProperties();

  });

}
if (minPriceRange && maxPriceRange) {
  minPriceRange.addEventListener("input", updatePriceSliderUI);
  maxPriceRange.addEventListener("input", updatePriceSliderUI);

  updatePriceSliderUI();
}

if (applyPriceFilter) {
  applyPriceFilter.addEventListener("click", () => {
    appliedMinPrice = Number(minPriceRange.value);
    appliedMaxPrice = Number(maxPriceRange.value);
    currentSort = priceSort.value;

    visibleProperties = 6;

    renderProperties();

    const propertiesSection =
      document.querySelector(".properties-section");

    if (propertiesSection) {
      propertiesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

if (resetPriceFilter) {
  resetPriceFilter.addEventListener("click", () => {
    minPriceRange.value = minPriceRange.min;
    maxPriceRange.value = maxPriceRange.max;
    priceSort.value = "default";

    appliedMinPrice = Number(minPriceRange.min);
    appliedMaxPrice = Number(maxPriceRange.max);
    currentSort = "default";

    visibleProperties = 6;

    updatePriceSliderUI();
    renderProperties();
  });
}
if (priceSort) {
  priceSort.addEventListener("change", () => {
    currentSort = priceSort.value;
    visibleProperties = 6;
    renderProperties();
  });
}

/* =========================
   DETAILS PAGE
========================= */

function renderDetailsPage() {
  const detailsPage = document.querySelector(".details-page");

  if (!detailsPage) return;

  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("id");

  const property =
    properties.find((item) => String(item.id) === String(propertyId)) ||
    properties[0];

  if (!property) {
    document.querySelector(".details-page").innerHTML =
      "<h1>Property not found</h1>";
    return;
  }

  const images = getImages(property);
  let currentImageIndex = 0;

  const detailTitle = document.getElementById("detailTitle");
  const detailLocation = document.getElementById("detailLocation");
  const detailPrice = document.getElementById("detailPrice");
  const detailDescription = document.getElementById("detailDescription");
  const mainPropertyImage = document.getElementById("mainPropertyImage");
  const thumbnailRow = document.getElementById("thumbnailRow");
  const galleryDots = document.getElementById("galleryDots");
  const detailsBadge = document.getElementById("detailsBadge");
  const prevImage = document.getElementById("prevImage");
  const nextImage = document.getElementById("nextImage");
  const breadcrumbTitle = document.getElementById("breadcrumbTitle");
  const detailsWhatsApp = document.getElementById("detailsWhatsApp");

  detailTitle.innerText = property.title || "Untitled Property";
  detailLocation.innerText = property.location || "Location on request";
  detailPrice.innerText = formatPrice(property.price);
  detailDescription.innerText =
    property.description || "Description available upon request.";

  breadcrumbTitle.innerText = property.title || "Property Details";

  document.getElementById("detailBeds").innerText = property.beds || 0;
  document.getElementById("detailBaths").innerText = property.baths || 0;
  document.getElementById("detailHouseArea").innerText =
    property.house_area || "-";
  document.getElementById("detailLandArea").innerText =
    property.land_area || "-";
  document.getElementById("detailParking").innerText = property.parking || 0;

  document.getElementById("sideType").innerText = getBadgeText(property.type);
  document.getElementById("sideBeds").innerText = property.beds || 0;
  document.getElementById("sideBaths").innerText = property.baths || 0;
  document.getElementById("sideHouseArea").innerText =
    property.house_area || "-";
  document.getElementById("sideLandArea").innerText =
    property.land_area || "-";
  document.getElementById("sideParking").innerText =
    `${property.parking || 0} Spaces`;

  detailsWhatsApp.href = createWhatsAppLink(property);

  detailsBadge.innerText = getBadgeText(property.type);
  detailsBadge.classList.add(getBadgeClass(property.type));

  thumbnailRow.innerHTML = "";
  galleryDots.innerHTML = "";

  function updateGallery() {
    mainPropertyImage.src = images[currentImageIndex];

    document.querySelectorAll(".thumbnail-img").forEach((thumb, index) => {
      thumb.classList.toggle("active", index === currentImageIndex);
    });

    document.querySelectorAll(".gallery-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentImageIndex);
    });
  }

  images.forEach((image, index) => {
    const thumb = document.createElement("img");
    thumb.src = image;
    thumb.className = "thumbnail-img";

    thumb.addEventListener("click", () => {
      currentImageIndex = index;
      updateGallery();
    });

    thumbnailRow.appendChild(thumb);

    const dot = document.createElement("button");
    dot.className = "gallery-dot";

    dot.addEventListener("click", () => {
      currentImageIndex = index;
      updateGallery();
    });

    galleryDots.appendChild(dot);
  });

  prevImage.addEventListener("click", () => {
    currentImageIndex =
      (currentImageIndex - 1 + images.length) % images.length;

    updateGallery();
  });

  nextImage.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;

    updateGallery();
  });

  updateGallery();
}

/* =========================
   SCROLL ANIMATIONS
========================= */

function startScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  document
    .querySelectorAll(
      ".property-card,.feature-box,.contact-card,.stat-box,.details-card,.sidebar-card"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(40px)";
      el.style.transition = "0.8s ease";
      observer.observe(el);
    });
}
function goBackToProperties() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "index.html#propertiesGrid";
  }
}
/* =========================
   START APP
========================= */

loadProperties();
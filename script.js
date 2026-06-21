
/* =========================
   LUXURY PROPERTIES
========================= */

const properties = [
  {
    id: 1,
    title: "Property 1",
    location: "Lebanon",
    price: "Price on request",
    type: "sale",
    beds: 3,
    baths: 2,
    area: "Contact for details",
    parking: 1,
    featured: "Yes",
    images: [
      "images/pro1-1.jpeg",
      "images/pro1-2.jpeg",
      "images/pro1-3.jpeg",
      "images/pro1-4.jpeg",
      "images/pro1-5.jpeg",
      "images/pro1-6.jpeg",
      "images/pro1-7.jpeg",
      "images/pro1-8.jpeg",
      "images/pro1-9.jpeg"
    ],
    description:
      "A featured property with a clean modern presentation, multiple interior and exterior images, and all key details available upon request."
  },

  {
    id: 2,
    title: "Property 2",
    location: "Lebanon",
    price: "Price on request",
    type: "sale",
    beds: 3,
    baths: 2,
    area: "Contact for details",
    parking: 1,
    featured: "Yes",
    images: [
      "images/pro2-1.jpeg",
      "images/pro2-2.jpeg",
      "images/pro2-3.jpeg",
      "images/pro2-4.jpeg",
      "images/pro2-5.jpeg"
    ],
    description:
      "A second featured property displayed with professional gallery images, suitable for buyers looking for a clean and elegant real estate listing."
  }
];
  
  /* =========================
     LOADER
  ========================= */
  
  window.addEventListener("load", () => {
  
    const loader = document.getElementById("loader");
  
    if(loader){
  
      setTimeout(() => {
  
        loader.classList.add("hide");
  
      },700);
  
    }
  
  });
  
  /* =========================
     HELPERS
  ========================= */
  
  function getBadgeText(type){
  
    if(type === "sale") return "For Sale";
  
    if(type === "rent") return "For Rent";
  
    if(type === "land") return "Land";
  
    return "Property";
  
  }
  
  function getBadgeClass(type){
  
    if(type === "sale") return "badge-sale";
  
    if(type === "rent") return "badge-rent";
  
    if(type === "land") return "badge-land";
  
  }
  
  function isLand(property){
  
    return property.type === "land";
  
  }
  
  /* =========================
     HOME PAGE
  ========================= */
  
  const propertiesGrid =
    document.getElementById("propertiesGrid");
  
  const searchInput =
    document.getElementById("searchInput");
  
  const searchBtn =
    document.getElementById("searchBtn");
  
  const resultsText =
    document.getElementById("resultsText");
  
  const filterButtons =
    document.querySelectorAll(".filter-btn");
  
  let currentFilter = "all";
  
  function renderProperties(){
  
    if(
      !propertiesGrid ||
      !searchInput ||
      !resultsText
    ) return;
  
    const searchTerm =
      searchInput.value.toLowerCase();
  
    const filtered = properties.filter((property) => {
  
      const matchesSearch =
  
        property.title
        .toLowerCase()
        .includes(searchTerm)
  
        ||
  
        property.location
        .toLowerCase()
        .includes(searchTerm);
  
      const matchesFilter =
  
        currentFilter === "all"
  
        ||
  
        property.type === currentFilter;
  
      return matchesSearch && matchesFilter;
  
    });
  
    resultsText.innerText =
      `${filtered.length} luxury properties available`;
  
    propertiesGrid.innerHTML = "";
  
    filtered.forEach((property,index) => {
  
      const badgeText =
        getBadgeText(property.type);
  
      const badgeClass =
        getBadgeClass(property.type);
  
      const featureHtml = isLand(property)
  
        ?
  
        `
          <span>
            <i class="fa-solid fa-expand"></i>
            ${property.area}
          </span>
  
          <span>
            <i class="fa-solid fa-map"></i>
            ${property.zoning}
          </span>
  
          <span>
            <i class="fa-solid fa-road"></i>
            Road Access
          </span>
        `
  
        :
  
        `
          <span>
            <i class="fa-solid fa-bed"></i>
            ${property.beds}
          </span>
  
          <span>
            <i class="fa-solid fa-bath"></i>
            ${property.baths}
          </span>
  
          <span>
            <i class="fa-solid fa-expand"></i>
            ${property.area}
          </span>
        `;
  
      const card =
        document.createElement("div");
  
      card.className = "property-card";
  
      card.innerHTML = `
  
        <div class="property-image">
  
          <img
            src="${property.images[0]}"
            alt="${property.title}"
          >
  
          <div class="property-badge ${badgeClass}">
  
            ${badgeText}
  
          </div>
  
        </div>
  
        <div class="property-content">
  
          <h3 class="property-title">
  
            ${property.title}
  
          </h3>
  
          <div class="property-location">
  
            <i class="fa-solid fa-location-dot"></i>
  
            ${property.location}
  
          </div>
  
          <div class="property-price">
  
            ${property.price}
  
          </div>
  
          <div class="property-features">
  
            ${featureHtml}
  
          </div>
  
          <div class="card-buttons">
  
            <button class="details-btn">
  
              View Details
  
            </button>
  
            <a
              href="https://wa.me/9613123123"
              target="_blank"
              class="whatsapp-btn"
            >
  
              <i class="fa-brands fa-whatsapp"></i>
  
            </a>
  
          </div>
  
        </div>
  
      `;
  
      card.addEventListener("click",() => {
  
        window.location.href =
          `property-details.html?id=${property.id}`;
  
      });
  
      const whatsappBtn =
        card.querySelector(".whatsapp-btn");
  
      whatsappBtn.addEventListener("click",(e) => {
  
        e.stopPropagation();
  
      });
  
      propertiesGrid.appendChild(card);
  
      setTimeout(() => {
  
        card.style.opacity = "1";
  
        card.style.transform =
          "translateY(0)";
  
      },90 * index);
  
    });
  
  }
  
  if(filterButtons.length > 0){
  
    filterButtons.forEach((button) => {
  
      button.addEventListener("click",() => {
  
        filterButtons.forEach((btn) => {
  
          btn.classList.remove("active");
  
        });
  
        button.classList.add("active");
  
        currentFilter =
          button.dataset.filter;
  
        renderProperties();
  
      });
  
    });
  
  }
  
  if(searchBtn){
  
    searchBtn.addEventListener(
      "click",
      renderProperties
    );
  
  }
  
  if(searchInput){
  
    searchInput.addEventListener(
      "keyup",
      renderProperties
    );
  
  }
  
  renderProperties();
  
  /* =========================
     DETAILS PAGE
  ========================= */
  
  const detailsPage =
    document.querySelector(".details-page");
  
  if(detailsPage){
  
    const params =
      new URLSearchParams(window.location.search);
  
    const propertyId =
      Number(params.get("id")) || 1;
  
    const property =
  
      properties.find(
        (item) => item.id === propertyId
      )
  
      ||
  
      properties[0];
  
    let currentImageIndex = 0;
  
    const detailTitle =
      document.getElementById("detailTitle");
  
    const detailLocation =
      document.getElementById("detailLocation");
  
    const detailPrice =
      document.getElementById("detailPrice");
  
    const detailDescription =
      document.getElementById("detailDescription");
  
    const mainPropertyImage =
      document.getElementById("mainPropertyImage");
  
    const thumbnailRow =
      document.getElementById("thumbnailRow");
  
    const galleryDots =
      document.getElementById("galleryDots");
  
    const detailsBadge =
      document.getElementById("detailsBadge");
  
    const prevImage =
      document.getElementById("prevImage");
  
    const nextImage =
      document.getElementById("nextImage");
  
    detailTitle.innerText =
      property.title;
  
    detailLocation.innerText =
      property.location;
  
    detailPrice.innerText =
      property.price;
  
    detailDescription.innerText =
      property.description;
  
    detailsBadge.innerText =
      getBadgeText(property.type);
  
    detailsBadge.classList.add(
      getBadgeClass(property.type)
    );
  
    function updateGallery(){
  
      mainPropertyImage.src =
        property.images[currentImageIndex];
  
      document
        .querySelectorAll(".thumbnail-img")
        .forEach((thumb,index) => {
  
          thumb.classList.toggle(
            "active",
            index === currentImageIndex
          );
  
        });
  
    }
  
    property.images.forEach((image,index) => {
  
      const thumb =
        document.createElement("img");
  
      thumb.src = image;
  
      thumb.className =
        "thumbnail-img";
  
      thumb.addEventListener("click",() => {
  
        currentImageIndex = index;
  
        updateGallery();
  
      });
  
      thumbnailRow.appendChild(thumb);
  
      const dot =
        document.createElement("button");
  
      dot.className =
        "gallery-dot";
  
      dot.addEventListener("click",() => {
  
        currentImageIndex = index;
  
        updateGallery();
  
      });
  
      galleryDots.appendChild(dot);
  
    });
  
    prevImage.addEventListener("click",() => {
  
      currentImageIndex =
  
        (
          currentImageIndex - 1 +
          property.images.length
        )
  
        %
  
        property.images.length;
  
      updateGallery();
  
    });
  
    nextImage.addEventListener("click",() => {
  
      currentImageIndex =
  
        (
          currentImageIndex + 1
        )
  
        %
  
        property.images.length;
  
      updateGallery();
  
    });
  
    updateGallery();
  
  }
  
  /* =========================
     SCROLL ANIMATIONS
  ========================= */
  
  const observer =
    new IntersectionObserver(
  
      (entries) => {
  
        entries.forEach((entry) => {
  
          if(entry.isIntersecting){
  
            entry.target.style.opacity = "1";
  
            entry.target.style.transform =
              "translateY(0)";
  
          }
  
        });
  
      },
  
      {
        threshold:0.15
      }
  
    );
  
  document
    .querySelectorAll(
      ".property-card,.feature-box,.contact-card,.stat-box,.details-card,.sidebar-card"
    )
  
    .forEach((el) => {
  
      el.style.opacity = "0";
  
      el.style.transform =
        "translateY(40px)";
  
      el.style.transition =
        "0.8s ease";
  
      observer.observe(el);
  
    });
  
  

/* =========================
   LUXURY PROPERTIES
========================= */

const properties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "Dubai Hills Estate",
      price: "$2,850,000",
      type: "sale",
      beds: 5,
      baths: 6,
      area: "620m²",
      parking: 3,
      featured: "Yes",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1600&auto=format&fit=crop"
      ],
      description:
        "Exceptional luxury villa featuring premium architecture, expansive interiors, a private pool, and high-end finishes designed for elegant modern living."
    },
  
    {
      id: 2,
      title: "Skyline Penthouse",
      location: "Downtown Dubai",
      price: "$4,200/mo",
      type: "rent",
      beds: 3,
      baths: 4,
      area: "280m²",
      parking: 2,
      featured: "Yes",
      images: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop"
      ],
      description:
        "Luxury penthouse with panoramic skyline views, elegant interior design, floor-to-ceiling windows, and premium lifestyle amenities."
    },
  
    {
      id: 3,
      title: "Waterfront Mansion",
      location: "Palm Jumeirah",
      price: "$8,900,000",
      type: "sale",
      beds: 7,
      baths: 8,
      area: "980m²",
      parking: 5,
      featured: "Yes",
      images: [
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585152915-d208bec867a1?q=80&w=1600&auto=format&fit=crop"
      ],
      description:
        "Ultra-luxury waterfront mansion with private beach access, modern architecture, premium finishes, and breathtaking sea views."
    },
  
    {
      id: 4,
      title: "Minimal Luxury Apartment",
      location: "Business Bay",
      price: "$3,500/mo",
      type: "rent",
      beds: 2,
      baths: 2,
      area: "170m²",
      parking: 1,
      featured: "No",
      images: [
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop"
      ],
      description:
        "Modern apartment with clean contemporary design, elegant spaces, premium finishes, and excellent city accessibility."
    },
  
    {
      id: 5,
      title: "Luxury Hillside Estate",
      location: "Emirates Hills",
      price: "$12,500,000",
      type: "sale",
      beds: 8,
      baths: 9,
      area: "1400m²",
      parking: 6,
      featured: "Yes",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1600&auto=format&fit=crop"
      ],
      description:
        "Prestigious estate located in one of the most exclusive luxury communities featuring exceptional architecture and elite amenities."
    },
  
    {
      id: 6,
      title: "Premium Investment Land",
      location: "Batroun, Lebanon",
      price: "$480,000",
      type: "land",
      area: "2,400m²",
      zoning: "Residential",
      roadAccess: "Yes",
      view: "Sea View",
      featured: "Yes",
      images: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop"
      ],
      description:
        "Exceptional land opportunity with panoramic sea views, premium location, and strong long-term investment potential."
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
  
  
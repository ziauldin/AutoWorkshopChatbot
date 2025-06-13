document.addEventListener("DOMContentLoaded", () => {
  // CAR_DATA variable declaration
  const CAR_DATA = {
    Acura: ["ILX", "MDX", "RDX", "TLX"],
    Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
    BMW: ["3 Series", "5 Series", "X3", "X5"],
    Chevrolet: ["Camaro", "Corvette", "Equinox", "Malibu", "Silverado", "Tahoe"],
    Ford: ["Escape", "Explorer", "F-150", "Focus", "Mustang"],
    Honda: ["Accord", "Civic", "CR-V", "Odyssey", "Pilot"],
    Hyundai: ["Elantra", "Santa Fe", "Sonata", "Tucson"],
    Jeep: ["Cherokee", "Grand Cherokee", "Wrangler"],
    Kia: ["Forte", "Optima", "Sorento", "Soul", "Sportage"],
    Lexus: ["ES", "IS", "NX", "RX"],
    Mazda: ["CX-5", "CX-9", "Mazda3", "Mazda6"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE"],
    Nissan: ["Altima", "Maxima", "Murano", "Pathfinder", "Rogue"],
    Subaru: ["Crosstrek", "Forester", "Impreza", "Outback"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
    Toyota: ["Camry", "Corolla", "Highlander", "RAV4", "Tacoma", "Tundra"],
    Volkswagen: ["Atlas", "Golf", "Jetta", "Passat", "Tiguan"],
  }

  // DOM Elements
  const sidebar = document.querySelector(".sidebar")
  const newChatBtn = document.getElementById("new-chat-btn")
  const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn")
  const toggleThemeBtn = document.getElementById("toggle-theme-btn")
  const clearHistoryBtn = document.getElementById("clear-history-btn")
  const welcomeScreen = document.getElementById("welcome-screen")
  const chatInterface = document.getElementById("chat-interface")
  const chatMessages = document.getElementById("chat-messages")
  const userInput = document.getElementById("user-input")
  const sendBtn = document.getElementById("send-btn")
  const attachImageBtn = document.getElementById("attach-image-btn")
  const voiceInputBtn = document.getElementById("voice-input-btn")
  const exportChatBtn = document.getElementById("export-chat-btn")
  const chatTitleText = document.getElementById("chat-title-text")
  const imageUploadForm = document.getElementById("image-upload-form")
  const imageUpload = document.getElementById("image-upload")
  const viewHistoryBtn = document.getElementById("view-history-btn")
  const historyList = document.getElementById("history-list")

  // Text size elements
  const textSizeXLarge = document.getElementById("text-size-xlarge")
  const textSizeXXLarge = document.getElementById("text-size-xxlarge")

  // Manual input elements
  const manufacturerInput = document.getElementById("manufacturer-input")
  const modelInput = document.getElementById("model-input")
  const yearInput = document.getElementById("year-input")
  const startChatBtn = document.getElementById("start-chat-btn")
  const toggleSelectionMode = document.getElementById("toggle-selection-mode")
  const toggleManualMode = document.getElementById("toggle-manual-mode")
  const manualInputForm = document.getElementById("manual-input-form")
  const selectionGrids = document.getElementById("selection-grids")

  // Navigation elements
  const manufacturerSelection = document.getElementById("manufacturer-selection")
  const modelSelection = document.getElementById("model-selection")
  const yearSelection = document.getElementById("year-selection")
  const manufacturerGrid = document.getElementById("manufacturer-grid")
  const modelGrid = document.getElementById("model-grid")
  const yearGrid = document.getElementById("year-grid")
  const backToManufacturer = document.getElementById("back-to-manufacturer")
  const backToModel = document.getElementById("back-to-model")
  const modelTitle = document.getElementById("model-title")
  const yearTitle = document.getElementById("year-title")
  const steps = document.querySelectorAll(".step")

  // Modals
  const imageModal = document.getElementById("image-modal")
  const imagePreview = document.getElementById("image-preview")
  const closeModalBtns = document.querySelectorAll(".close-modal-btn")
  const comparisonModal = document.getElementById("comparison-modal")

  // State variables
  let currentSessionId = localStorage.getItem("currentSessionId") || null
  let selectedManufacturer = null
  let selectedModel = null
  let selectedYear = null
  let isDarkTheme = localStorage.getItem("darkTheme") === "true"
  let isProcessing = false
  let currentTextSize = localStorage.getItem("textSize") || "xxlarge"

  // Apply saved theme
  if (isDarkTheme) {
    document.body.classList.add("dark-theme")
    toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode'
  }

  // Apply saved text size
  applyTextSize(currentTextSize)

  // Initialize the app
  initializeApp()

  // Event Listeners
  newChatBtn.addEventListener("click", resetChat)
  toggleSidebarBtn.addEventListener("click", toggleSidebar)
  toggleThemeBtn.addEventListener("click", toggleTheme)
  clearHistoryBtn.addEventListener("click", clearHistory)
  sendBtn.addEventListener("click", sendMessage)
  attachImageBtn.addEventListener("click", () => imageUpload.click())
  imageUpload.addEventListener("change", handleImageUpload)
  viewHistoryBtn.addEventListener("click", toggleSidebar)
  backToManufacturer.addEventListener("click", showManufacturerSelection)
  backToModel.addEventListener("click", showModelSelection)

  // Text size buttons
  textSizeXLarge.addEventListener("click", () => setTextSize("xlarge"))
  textSizeXXLarge.addEventListener("click", () => setTextSize("xxlarge"))

  // Manual input and selection mode toggles
  toggleSelectionMode.addEventListener("click", toggleInputMode)
  toggleManualMode.addEventListener("click", toggleInputMode)
  startChatBtn.addEventListener("click", startChatFromManualInput)

  // Close modals when clicking close button
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      imageModal.classList.remove("active")
      comparisonModal.classList.remove("active")
    })
  })

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === imageModal) {
      imageModal.classList.remove("active")
    }
    if (e.target === comparisonModal) {
      comparisonModal.classList.remove("active")
    }
  })

  // Handle user input
  userInput.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      sendBtn.disabled = false
    } else {
      sendBtn.disabled = true
    }

    // Auto-resize textarea
    this.style.height = "auto"
    this.style.height = this.scrollHeight + "px"
  })

  // Handle Enter key
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!sendBtn.disabled) {
        sendMessage()
      }
    }
  })

  // Handle suggestion chips
  document.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", function () {
      userInput.value = this.dataset.text
      userInput.dispatchEvent(new Event("input"))
      sendMessage()
    })
  })

  // Initialize the application
  function initializeApp() {
    loadChatHistory()

    // If we have an active session, load it
    if (currentSessionId) {
      loadChatSession(currentSessionId)
    }

    // Show manual input form by default
    manualInputForm.style.display = "block"
    selectionGrids.style.display = "none"

    // Set up voice input if available
    setupVoiceInput()

    // Set up manual input validation
    setupManualInputValidation()

    // Populate manufacturer grid
    populateManufacturerGrid()
  }

  // Populate manufacturer grid
  function populateManufacturerGrid() {
    manufacturerGrid.innerHTML = ""
    Object.keys(CAR_DATA)
      .sort()
      .forEach((manufacturer) => {
        const item = document.createElement("div")
        item.className = "grid-item"
        item.textContent = manufacturer
        item.addEventListener("click", () => {
          selectedManufacturer = manufacturer
          modelTitle.textContent = `Select ${manufacturer} Model`
          populateModelGrid(manufacturer)
          showModelSelection()
          updateActiveStep("model")
        })
        manufacturerGrid.appendChild(item)
      })
  }

  // Populate model grid
  function populateModelGrid(manufacturer) {
    modelGrid.innerHTML = ""
    CAR_DATA[manufacturer].sort().forEach((model) => {
      const item = document.createElement("div")
      item.className = "grid-item"
      item.textContent = model
      item.addEventListener("click", () => {
        selectedModel = model
        yearTitle.textContent = `Select ${manufacturer} ${model} Year`
        populateYearGrid()
        showYearSelection()
        updateActiveStep("year")
      })
      modelGrid.appendChild(item)
    })
  }

  // Populate year grid
  function populateYearGrid() {
    yearGrid.innerHTML = ""
    const currentYear = new Date().getFullYear()
    const startYear = 2000

    for (let year = currentYear; year >= startYear; year--) {
      const item = document.createElement("div")
      item.className = "grid-item year-item"
      item.textContent = year
      item.addEventListener("click", () => {
        selectedYear = year
        startChat(selectedManufacturer, selectedModel, selectedYear)
      })
      yearGrid.appendChild(item)
    }
  }

  // Set up manual input validation
  function setupManualInputValidation() {
    function validateForm() {
      const manufacturer = manufacturerInput.value.trim()
      const model = modelInput.value.trim()
      const year = yearInput.value.trim()

      startChatBtn.disabled = !(
        manufacturer &&
        model &&
        year &&
        Number.parseInt(year) >= 1900 &&
        Number.parseInt(year) <= new Date().getFullYear()
      )
    }

    manufacturerInput.addEventListener("input", validateForm)
    modelInput.addEventListener("input", validateForm)
    yearInput.addEventListener("input", validateForm)

    // Set max year to current year
    yearInput.max = new Date().getFullYear()
  }

  // Toggle between manual input and selection mode
  function toggleInputMode() {
    if (manualInputForm.style.display === "none") {
      manualInputForm.style.display = "block"
      selectionGrids.style.display = "none"
      toggleManualMode.classList.add("active")
      toggleSelectionMode.classList.remove("active")
    } else {
      manualInputForm.style.display = "none"
      selectionGrids.style.display = "block"
      toggleManualMode.classList.remove("active")
      toggleSelectionMode.classList.add("active")
    }
  }

  // Start chat from manual input
  function startChatFromManualInput() {
    const manufacturer = manufacturerInput.value.trim();
    const model = modelInput.value.trim();
    const year = Number.parseInt(yearInput.value.trim());

    if (!manufacturer || !model || isNaN(year)) {
      showNotification("Please fill in all fields correctly", "error");
      return;
    }

    startChat(manufacturer, model, year);
  }

  // Start chat with selected car details
  function startChat(manufacturer, model, year) {
    showNotification("Starting new conversation...", "info")

    if (!manufacturer || !model || !year) {
      showNotification("Please provide complete vehicle details", "error")
      return
    }

    fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        manufacturer: manufacturer,
        model: model,
        year: year,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        currentSessionId = data.session_id
        localStorage.setItem("currentSessionId", currentSessionId)

        chatTitleText.textContent = `${year} ${manufacturer} ${model}`

        chatMessages.innerHTML = ""

        addMessage(
          "assistant",
          `Hello! I'm ready to help with your ${year} ${manufacturer} ${model}. What issues are you experiencing?`,
          new Date(),
        )

        welcomeScreen.style.display = "none"
        chatInterface.style.display = "flex"

        userInput.focus()

        loadChatHistory()

        updateTextSizeOnServer(currentTextSize)
      })
      .catch((error) => {
        console.error("Error starting chat:", error)
        showNotification("Failed to start conversation. Please try again.", "error")
      })
  }

  // Set text size
  function setTextSize(size) {
    textSizeXLarge.classList.remove("active")
    textSizeXXLarge.classList.remove("active")

    if (size === "xlarge") textSizeXLarge.classList.add("active")
    if (size === "xxlarge") textSizeXXLarge.classList.add("active")

    applyTextSize(size)

    localStorage.setItem("textSize", size)
    currentTextSize = size

    if (currentSessionId) {
      updateTextSizeOnServer(size)
    }
  }

  // Apply text size to the document
  function applyTextSize(size) {
    document.body.classList.remove("text-xlarge", "text-xxlarge")
    document.body.classList.add(`text-${size}`)
  }

  // Update text size on server
  function updateTextSizeOnServer(size) {
    fetch("/api/set-text-size", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: size,
        session_id: currentSessionId,
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error updating text size:", error)
      })
  }

  // Send message
  function sendMessage() {
    if (isProcessing || !currentSessionId) return

    const message = userInput.value.trim()
    if (message === "") return

    addMessage("user", message, new Date())

    userInput.value = ""
    userInput.style.height = "auto"
    sendBtn.disabled = true

    isProcessing = true
    addTypingIndicator()

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: currentSessionId,
        message: message,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        removeTypingIndicator()
        addMessage("assistant", data.message, new Date(), null, data.products)
        isProcessing = false
      })
      .catch((error) => {
        console.error("Error sending message:", error)
        removeTypingIndicator()
        addMessage(
          "assistant",
          "Sorry, I encountered an error processing your request. Please try again.",
          new Date(),
        )
        showNotification("Failed to send message. Please try again.", "error")
        isProcessing = false
      })
  }

  // Add message to chat
  function addMessage(role, content, timestamp, carImage = null, products = null) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${role}`

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "message-avatar"
    avatarDiv.innerHTML = role === "user" ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>'

    const contentDiv = document.createElement("div")
    contentDiv.className = "message-content"

    const formattedContent = content.replace(/\n/g, "<br>")
    contentDiv.innerHTML = formattedContent

    if (carImage) {
      const imageContainer = document.createElement("div")
      imageContainer.className = "car-image-container"

      const image = document.createElement("img")
      image.className = carImage.includes("wikipedia.org") ? "wikipedia-image" : "car-image"
      image.src = carImage
      image.alt = "Vehicle Image"
      image.addEventListener("click", () => showImageModal(carImage))

      image.onerror = () => {
        image.src =
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"
        image.alt = "Image Not Available"
        image.className = "wikipedia-image"
      }

      imageContainer.appendChild(image)

      // Add Wikipedia attribution if applicable
      if (carImage.includes("wikipedia.org")) {
        const attribution = document.createElement("div")
        attribution.className = "wikipedia-attribution"
        attribution.textContent = "Image from Wikipedia"
        imageContainer.appendChild(attribution)
      }

      contentDiv.appendChild(imageContainer)
    }

    const triggerWords = ["product", "recommend", "part", "tool", "suggest"]
    const lastUserMessage = chatMessages.querySelector(".message.user:last-child .message-content")?.textContent || ""

    if (products && products.length > 0 && triggerWords.some((kw) => lastUserMessage.toLowerCase().includes(kw))) {
      const productsContainer = document.createElement("div")
      productsContainer.className = "products-container"

      const productsTitle = document.createElement("div")
      productsTitle.className = "products-title"
      productsTitle.innerHTML = '<i class="fas fa-shopping-cart"></i> Recommended Products'
      productsContainer.appendChild(productsTitle)

      products.forEach((product) => {
        const productItem = document.createElement("div")
        productItem.className = "product-item"

        const productInfo = document.createElement("div")
        productInfo.className = "product-info"

        const productTitle = document.createElement("div")
        productTitle.className = "product-title"
        productTitle.textContent = product.title

        const productCategory = document.createElement("div")
        productCategory.className = "product-category"
        productCategory.textContent = product.manufacturer || "Auto Parts"

        productInfo.appendChild(productTitle)
        productInfo.appendChild(productCategory)

        const productPrice = document.createElement("div")
        productPrice.className = "product-price"
        productPrice.textContent = `PKR ${product.price.toFixed(2)}`

        productItem.appendChild(productInfo)
        productItem.appendChild(productPrice)

        if (product.url) {
          productItem.addEventListener("click", () => {
            window.open(product.url, "_blank")
          })
          productItem.style.cursor = "pointer"
        }

        productsContainer.appendChild(productItem)
      })

      contentDiv.appendChild(productsContainer)
    }

    const timestampDiv = document.createElement("div")
    timestampDiv.className = "message-timestamp"
    timestampDiv.textContent = formatTimestamp(timestamp)

    messageDiv.appendChild(avatarDiv)
    messageDiv.appendChild(contentDiv)
    contentDiv.appendChild(timestampDiv)

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Add typing indicator
  function addTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "message assistant typing-indicator"
    typingDiv.id = "typing-indicator"

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "message-avatar"
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>'

    const contentDiv = document.createElement("div")
    contentDiv.className = "message-content"
    contentDiv.innerHTML = '<div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>'

    typingDiv.appendChild(avatarDiv)
    typingDiv.appendChild(contentDiv)

    chatMessages.appendChild(typingDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  // Format timestamp
  function formatTimestamp(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Show image modal
  function showImageModal(imageSrc) {
    const modalContent = document.querySelector(".modal-content")
    const loadingDiv = modalContent.querySelector(".image-loading")
    const imagePreview = modalContent.querySelector("#image-preview")

    // Reset modal state
    loadingDiv.style.display = "flex"
    imagePreview.style.display = "none"
    imagePreview.src = ""
    imagePreview.alt = "Loading image..."

    // Remove any existing attribution
    const existingAttribution = modalContent.querySelector(".wikipedia-attribution")
    if (existingAttribution) {
      existingAttribution.remove()
    }

    imageModal.classList.add("active")

    // Create new image element to test loading
    const testImage = new Image()
    testImage.crossOrigin = "anonymous" // Add CORS header
    testImage.onload = () => {
      // Image loaded successfully
      imagePreview.src = imageSrc
      imagePreview.style.display = "block"
      loadingDiv.style.display = "none"

      // Check if it's a Wikipedia image and add attribution
      if (imageSrc.includes("wikipedia.org")) {
        const attribution = document.createElement("div")
        attribution.className = "wikipedia-attribution"
        attribution.textContent = "Image from Wikipedia"
        modalContent.appendChild(attribution)
      }
    }

    testImage.onerror = () => {
      // Image failed to load - show Wikipedia placeholder
      imagePreview.src =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"
      imagePreview.alt = "Image Not Available"
      imagePreview.style.display = "block"
      loadingDiv.style.display = "none"
    }

    testImage.src = imageSrc
  }

  // Toggle sidebar
  function toggleSidebar() {
    sidebar.classList.toggle("active")
  }

  // Toggle theme
  function toggleTheme() {
    isDarkTheme = !isDarkTheme
    document.body.classList.toggle("dark-theme")

    if (isDarkTheme) {
      toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode'
    } else {
      toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode'
    }

    localStorage.setItem("darkTheme", isDarkTheme)
  }

  // Reset chat
  function resetChat() {
    selectedManufacturer = null
    selectedModel = null
    selectedYear = null
    currentSessionId = null
    localStorage.removeItem("currentSessionId")

    chatMessages.innerHTML = ""
    userInput.value = ""
    sendBtn.disabled = true

    manufacturerInput.value = ""
    modelInput.value = ""
    yearInput.value = ""
    startChatBtn.disabled = true

    chatInterface.style.display = "none"
    welcomeScreen.style.display = "flex"

    manufacturerSelection.style.display = "block"
    modelSelection.style.display = "none"
    yearSelection.style.display = "none"
    updateActiveStep("manufacturer")

    if (window.innerWidth < 992) {
      sidebar.classList.remove("active")
    }
  }

  // Clear history
  function clearHistory() {
    if (!confirm("Are you sure you want to clear all conversation history?")) {
      return
    }

    fetch("/api/clear-history", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data.success) {
          showNotification("History cleared successfully", "success")
          historyList.innerHTML = '<div class="history-empty">No past conversations found</div>'

          if (currentSessionId) {
            resetChat()
          }
        } else {
          showNotification("Failed to clear history", "error")
        }
      })
      .catch((error) => {
        console.error("Error clearing history:", error)
        showNotification("Failed to clear history", "error")
      })
  }

  // Load chat history
  function loadChatHistory() {
    fetch("/api/history")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data.sessions && data.sessions.length > 0) {
          historyList.innerHTML = ""

          data.sessions.forEach((session) => {
            const historyItem = document.createElement("div")
            historyItem.className = "history-item"
            if (session.id === currentSessionId) {
              historyItem.classList.add("active")
            }

            const carDetails = document.createElement("div")
            carDetails.className = "history-car-details"
            carDetails.textContent = `${session.car_details.year} ${session.car_details.manufacturer} ${session.car_details.model}`

            const lastMessage = document.createElement("div")
            lastMessage.className = "history-last-message"
            lastMessage.textContent = session.last_message

            const historyDate = document.createElement("div")
            historyDate.className = "history-date"

            const date = new Date(session.created_at)
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

            historyDate.innerHTML = `
                        <span>${formattedDate}</span>
                        <span>${session.message_count} messages</span>
                    `

            historyItem.appendChild(carDetails)
            historyItem.appendChild(lastMessage)
            historyItem.appendChild(historyDate)

            historyItem.addEventListener("click", () => loadChatSession(session.id))

            historyList.appendChild(historyItem)
          })
        } else {
          historyList.innerHTML = '<div class="history-empty">No past conversations found</div>'
        }
      })
      .catch((error) => {
        console.error("Error loading history:", error)
        historyList.innerHTML = '<div class="history-empty">Failed to load history</div>'
        showNotification("Failed to load chat history", "error")
      })
  }

  // Load chat session
  function loadChatSession(sessionId) {
    showNotification("Loading conversation...", "info")

    fetch(`/api/history/${sessionId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        currentSessionId = sessionId
        localStorage.setItem("currentSessionId", sessionId)

        selectedManufacturer = data.car_details.manufacturer
        selectedModel = data.car_details.model
        selectedYear = data.car_details.year

        chatTitleText.textContent = `${selectedYear} ${selectedManufacturer} ${selectedModel}`

        chatMessages.innerHTML = ""

        data.messages.forEach((msg) => {
          addMessage(msg.role, msg.content, new Date(msg.timestamp), msg.car_image || null, msg.products || null)
        })

        welcomeScreen.style.display = "none"
        chatInterface.style.display = "flex"

        loadChatHistory()

        if (data.text_size && data.text_size !== currentTextSize) {
          setTextSize(data.text_size)
        }

        if (window.innerWidth < 992) {
          sidebar.classList.remove("active")
        }
      })
      .catch((error) => {
        console.error("Error loading session:", error)
        showNotification("Failed to load conversation", "error")
      })
  }

  // Handle image upload
  function handleImageUpload() {
    if (!currentSessionId || !imageUpload.files || !imageUpload.files[0]) {
      return
    }

    const file = imageUpload.files[0]

    if (!file.type.startsWith("image/")) {
      showNotification("Please select an image file", "error")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image size should be less than 5MB", "error")
      return
    }

    showNotification("Uploading image...", "info")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("session_id", currentSessionId)

    // Show loading state
    const uploadIndicator = document.createElement("div")
    uploadIndicator.className = "notification info"
    uploadIndicator.innerHTML = `
        <div class="spinner" style="width:20px;height:20px;margin-right:10px;"></div>
        <span>Uploading image...</span>
    `
    document.body.appendChild(uploadIndicator)
    setTimeout(() => uploadIndicator.classList.add("show"), 10)

    fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data.success) {
          userInput.value += ` [Image uploaded: ${file.name}]`
          userInput.dispatchEvent(new Event("input"))

          // Remove loading indicator
          uploadIndicator.classList.remove("show")
          setTimeout(() => uploadIndicator.remove(), 300)

          showImageModal(data.file_url)
          showNotification("Image uploaded successfully", "success")
        } else {
          throw new Error(data.message || "Failed to upload image")
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error)
        uploadIndicator.classList.remove("show")
        setTimeout(() => uploadIndicator.remove(), 300)
        showNotification("Failed to upload image", "error")
      })
  }

  // Setup voice input if available
  function setupVoiceInput() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      voiceInputBtn.style.display = "none"
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    let isListening = false

    voiceInputBtn.addEventListener("click", () => {
      if (isListening) {
        recognition.stop()
        return
      }

      isListening = true
      voiceInputBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>'
      voiceInputBtn.classList.add("active")

      try {
        recognition.start()
        showNotification("Listening...", "info")
      } catch (error) {
        console.error("Speech recognition error:", error)
        showNotification("Could not start voice input", "error")
        isListening = false
        voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>'
        voiceInputBtn.classList.remove("active")
      }
    })

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      userInput.value = transcript
      userInput.dispatchEvent(new Event("input"))
    }

    recognition.onend = () => {
      isListening = false
      voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>'
      voiceInputBtn.classList.remove("active")
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      showNotification("Voice input error: " + event.error, "error")
      isListening = false
      voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>'
      voiceInputBtn.classList.remove("active")
    }
  }

  // Update active step
  function updateActiveStep(step) {
    steps.forEach((s) => {
      if (s.dataset.step === step) {
        s.classList.add("active")
      } else {
        s.classList.remove("active")
      }
    })
  }

  // Show manufacturer selection
  function showManufacturerSelection() {
    manufacturerSelection.style.display = "block"
    modelSelection.style.display = "none"
    updateActiveStep("manufacturer")
  }

  // Show model selection
  function showModelSelection() {
    modelSelection.style.display = "block"
    yearSelection.style.display = "none"
    updateActiveStep("model")
  }

  // Show year selection
  function showYearSelection() {
    yearSelection.style.display = "block"
    updateActiveStep("year")
  }

  // Export chat
  exportChatBtn.addEventListener("click", () => {
    if (!currentSessionId) return

    fetch(`/api/history/${currentSessionId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        let exportText = `Chat History - ${data.car_details.year} ${data.car_details.manufacturer} ${data.car_details.model}\n`
        exportText += `Date: ${new Date(data.created_at).toLocaleString()}\n\n`

        data.messages.forEach((msg) => {
          const role = msg.role === "user" ? "You" : "Vehicle Diagnosis Assistant"
          const timestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          exportText += `[${timestamp}] ${role}: ${msg.content}\n\n`
        })

        const blob = new Blob([exportText], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `chat_${data.car_details.manufacturer}_${data.car_details.model}_${new Date().toISOString().split("T")[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        showNotification("Chat exported successfully", "success")
      })
      .catch((error) => {
        console.error("Error exporting chat:", error)
        showNotification("Failed to export chat", "error")
      })
  })

  // Show notification
  function showNotification(message, type = "info") {
    const existingNotifications = document.querySelectorAll(".notification")
    existingNotifications.forEach((notification) => {
      notification.remove()
    })

    const notification = document.createElement("div")
    notification.className = `notification ${type}`

    let icon = "info-circle"
    if (type === "success") icon = "check-circle"
    if (type === "error") icon = "exclamation-circle"
    if (type === "warning") icon = "exclamation-triangle"

    notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 3000)
  }

  // Handle window resize for responsive design
  window.addEventListener("resize", () => {
    if (window.innerWidth < 992 && sidebar.classList.contains("active")) {
      sidebar.classList.remove("active")
    }

    if (userInput.value) {
      userInput.style.height = "auto"
      userInput.style.height = userInput.scrollHeight + "px"
    }
  })

  // Handle network status changes
  window.addEventListener("online", () => {
    showNotification("You are back online", "success")
  })

  window.addEventListener("offline", () => {
    showNotification("You are offline. Some features may not work.", "warning")
  })

  // Add error boundary for unhandled exceptions
  window.addEventListener("error", (event) => {
    console.error("Unhandled error:", event.error)
    showNotification("An unexpected error occurred. Please try refreshing the page.", "error")
  })
})
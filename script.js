document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Set Active Navigation Link based on current URL
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('.nav-links a');
    const menuLength = menuItem.length;
    
    for (let i = 0; i < menuLength; i++) {
        if (menuItem[i].href === currentLocation || (currentLocation.endsWith('/') && menuItem[i].getAttribute('href') === 'index.html')) {
            menuItem[i].classList.add('active');
        } else {
            menuItem[i].classList.remove('active');
        }
    }

    // Intersection Observer for Fade-In Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Hero Status Text Animation (one by one from left to right)
    const heroStatus = document.querySelector('.hero-status');
    if (heroStatus) {
        const originalText = heroStatus.textContent.trim();
        heroStatus.textContent = '';
        
        const words = originalText.split(' ');
        let charCount = 0;
        
        words.forEach((word, wordIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            
            for (let i = 0; i < word.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.textContent = word[i];
                charSpan.classList.add('char-span');
                charSpan.style.animationDelay = `${charCount * 0.04}s`;
                wordSpan.appendChild(charSpan);
                charCount++;
            }
            
            heroStatus.appendChild(wordSpan);
            
            // Add a space between words
            if (wordIdx < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.innerHTML = '&nbsp;';
                spaceSpan.style.display = 'inline-block';
                heroStatus.appendChild(spaceSpan);
                charCount++;
            }
        });
        
        // Trigger the animation after a short delay
        setTimeout(() => {
            heroStatus.classList.add('start-animation');
        }, 300);
    }

    // Document Grid Dual-Filtering Logic
    const filterSiklusBtns = document.querySelectorAll('#filter-siklus .filter-btn');
    const filterKategoriBtns = document.querySelectorAll('#filter-kategori .filter-btn');
    const docCards = document.querySelectorAll('.doc-card');

    if (filterSiklusBtns.length > 0 && filterKategoriBtns.length > 0 && docCards.length > 0) {
        let currentSiklus = 'semua';
        let currentKategori = 'semua';

        function filterCards() {
            docCards.forEach(card => {
                const cardSiklus = card.getAttribute('data-siklus');
                const cardKategori = card.getAttribute('data-kategori');
                
                const matchSiklus = currentSiklus === 'semua' || cardSiklus === currentSiklus;
                const matchKategori = currentKategori === 'semua' || cardKategori === currentKategori;

                if (matchSiklus && matchKategori) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        // Handle Siklus Filter Clicks
        filterSiklusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterSiklusBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update current filter and apply
                currentSiklus = btn.getAttribute('data-filter');
                filterCards();
            });
        });

        // Handle Kategori Filter Clicks
        filterKategoriBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterKategoriBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update current filter and apply
                currentKategori = btn.getAttribute('data-filter');
                filterCards();
            });
        });
    }

    // Premium Upload Interactive Logic
    const uploadContainers = document.querySelectorAll('.upload-container');

    uploadContainers.forEach(container => {
        const fileInput = container.querySelector('.file-input');
        const uploadZone = container.querySelector('.card-upload-zone');
        let uploadedInfo = container.querySelector('.uploaded-file-info');

        // If uploadZone exists, set up upload events
        if (uploadZone && fileInput) {
            // Trigger input click on upload zone click
            uploadZone.addEventListener('click', (e) => {
                // Prevent trigger if clicking on progress bar or children in a way that interferes
                if (e.target.closest('.upload-progress-container')) return;
                fileInput.click();
            });

            // Drag and drop events
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    uploadZone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                uploadZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    uploadZone.classList.remove('dragover');
                }, false);
            });

            uploadZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files.length > 0) {
                    handleFile(files[0]);
                }
            });

            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    handleFile(fileInput.files[0]);
                }
            });
        }

        // Setup delete/ganti file button for existing or new uploaded files
        setupDeleteHandler(container);

        function handleFile(file) {
            const progressContainer = container.querySelector('.upload-progress-container');
            const progressBar = container.querySelector('.upload-progress-bar');
            
            if (!progressContainer || !progressBar) return;

            // Show progress bar
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 15) + 5; // increment 5-20%
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Delay slightly to let progress bar fill up visually
                    setTimeout(() => {
                        completeUpload(file);
                    }, 200);
                }
                progressBar.style.width = `${progress}%`;
            }, 80);
        }

        function completeUpload(file) {
            // Hide progress container and reset bar
            const progressContainer = container.querySelector('.upload-progress-container');
            if (progressContainer) progressContainer.style.display = 'none';

            // Generate temporary URL for preview/view
            const fileUrl = URL.createObjectURL(file);
            
            // Get correct icon based on file extension
            const fileExt = file.name.split('.').pop().toLowerCase();
            let iconClass = 'fa-solid fa-file';
            let iconColor = '#0084ff';
            
            if (fileExt === 'pdf') {
                iconClass = 'fa-solid fa-file-pdf';
                iconColor = '#e74c3c';
            } else if (['doc', 'docx'].includes(fileExt)) {
                iconClass = 'fa-solid fa-file-word';
                iconColor = '#2b6cb0';
            } else if (['ppt', 'pptx'].includes(fileExt)) {
                iconClass = 'fa-solid fa-file-powerpoint';
                iconColor = '#d69e2e';
            } else if (['png', 'jpg', 'jpeg'].includes(fileExt)) {
                iconClass = 'fa-solid fa-file-image';
                iconColor = '#319795';
            }

            // Create uploaded-file-info if it doesn't exist
            if (!uploadedInfo) {
                uploadedInfo = document.createElement('div');
                uploadedInfo.className = 'uploaded-file-info';
                container.insertBefore(uploadedInfo, uploadZone);
            }

            // Populate uploaded-file-info
            uploadedInfo.innerHTML = `
                <div class="uploaded-file-icon" style="color: ${iconColor};"><i class="${iconClass}"></i></div>
                <div class="uploaded-file-details">
                    <span class="uploaded-file-name">${file.name}</span>
                </div>
                <div class="uploaded-file-actions">
                    <a href="${fileUrl}" target="_blank" class="btn-action-file btn-view" title="Buka File">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <button class="btn-action-file btn-delete" title="Ganti File">
                        <i class="fa-solid fa-rotate"></i>
                    </button>
                </div>
            `;

            // Hide upload zone, show uploaded-file-info
            if (uploadZone) uploadZone.style.display = 'none';
            uploadedInfo.style.display = 'flex';

            // Setup the delete button on the newly created element
            setupDeleteHandler(container);
        }

        function setupDeleteHandler(container) {
            const deleteBtn = container.querySelector('.btn-delete');
            if (!deleteBtn) return;

            // Remove existing listener to prevent duplicates (by cloning and replacing)
            const newDeleteBtn = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

            newDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const currentUploadedInfo = container.querySelector('.uploaded-file-info');
                const currentUploadZone = container.querySelector('.card-upload-zone');
                const currentFileInput = container.querySelector('.file-input');

                // If it is a dynamically uploaded file, revoke object URL to free memory
                const viewBtn = container.querySelector('.btn-view');
                if (viewBtn) {
                    const href = viewBtn.getAttribute('href');
                    if (href && href.startsWith('blob:')) {
                        URL.revokeObjectURL(href);
                    }
                }

                // Reset input
                if (currentFileInput) currentFileInput.value = '';

                // Hide info, show upload zone
                if (currentUploadedInfo) {
                    currentUploadedInfo.style.display = 'none';
                }
                if (currentUploadZone) {
                    currentUploadZone.style.display = 'flex';
                    // Reset the progress bar inside the upload zone
                    const progressBar = currentUploadZone.querySelector('.upload-progress-bar');
                    if (progressBar) progressBar.style.width = '0%';
                }
            });
        }
    });
});


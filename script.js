let currentFolder = "";

// 1. Load Navigation Tabs dynamically
fetch('tabs.json')
    .then(res => res.json())
    .then(tabs => {
        const nav = document.getElementById('navbar');
        tabs.forEach((tab, index) => {
            const a = document.createElement('a');
            a.innerText = tab.name.toUpperCase();
            a.href = `#${tab.folder}`;
            a.onclick = () => switchCategory(tab.folder, a);
            nav.appendChild(a);
            
            // Default to the first tab on page load
            if (index === 0) {
                const hash = window.location.hash.replace('#', '');
                if (hash) {
                    const matchedTab = tabs.find(t => t.folder === hash);
                    if (matchedTab) {
                        switchCategory(hash, document.querySelector(`[href="#${hash}"]`));
                        return;
                    }
                }
                switchCategory(tab.folder, a);
            }
        });
    });

// 2. Switch Categories and Load Respective Images
function switchCategory(folder, element) {
    currentFolder = folder;
    
    // Update Active Nav Link styling
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    if(element) element.classList.add('active');

    const gallery = document.getElementById('gallery');
    const heroSection = document.querySelector('.hero'); // Grabs your cover page

    gallery.innerHTML = ""; // Clear current images

    // NEW LOGIC: Show Cover Page ONLY on 'home', but show the photo gallery on ALL tabs!
    if (folder === 'home') {
        if (heroSection) heroSection.style.display = 'flex'; 
    } else {
        if (heroSection) heroSection.style.display = 'none'; 
    }
    gallery.style.display = 'flex'; // Keeps the beautiful gaps between photos

    // Fetch the automated global structure compiled by GitHub Actions
    fetch('gallery.json')
        .then(res => res.json())
        .then(data => {
            const images = data[folder] || [];
            
            if (images.length === 0) throw new Error("empty");

            images.forEach(imgSrc => {
                // NEW: Skip the cover image so it doesn't duplicate in the gallery!
                if (folder === 'home' && imgSrc.includes('IMG_3154.jpeg')) {
                    return; 
                }

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('gallery-item');

                const img = document.createElement('img');
                img.src = imgSrc;
                img.loading = "lazy"; // Performance optimization

                // Detect image layout once it loads to handle styling
                img.onload = function() {
                    if (this.naturalWidth > this.naturalHeight) {
                        itemDiv.classList.add('landscape');
                    } else {
                        itemDiv.classList.add('portrait');
                    }
                };

                // Lightbox click event
                img.onclick = () => openLightbox(imgSrc);

                itemDiv.appendChild(img);
                gallery.appendChild(itemDiv);
            });
        }).catch(() => {
            gallery.innerHTML = "<p style='text-align:center;color:#666;'>No photos found in this folder yet.</p>";
        });
}

// 3. Fullscreen Lightbox Controls
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Stop page scrolling background
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scroll
}
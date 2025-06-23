document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: DOMContentLoaded fired!");

    // --- Bagian Unggah Foto ---
    const imageUpload = document.getElementById('imageUpload');
    const uploadButton = document.getElementById('uploadButton');
    const uploadedImage = document.getElementById('uploadedImage');
    const uploadedGeminiResult = document.getElementById('uploadedGeminiResult');

    // Fitur ini hanya akan aktif jika elemen 'uploadButton' ditemukan (yaitu di index.html)
    if (uploadButton) {
        console.log("script.js: Upload elements found. Initializing upload logic.");
        uploadButton.addEventListener('click', async () => {
            const file = imageUpload.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImage.src = e.target.result;
                    uploadedImage.style.display = 'block';
                };
                reader.readAsDataURL(file);

                uploadedGeminiResult.textContent = 'Menganalisis... Mohon tunggu.';
                uploadButton.disabled = true;

                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();

                    if (data.gemini_analysis) {
                        uploadedGeminiResult.textContent = data.gemini_analysis;
                    } else if (data.error) {
                        uploadedGeminiResult.textContent = `Error: ${data.error}`;
                    }
                } catch (error) {
                    console.error('Error saat mengunggah atau menganalisis:', error);
                    uploadedGeminiResult.textContent = 'Gagal mendeteksi warna. Periksa koneksi internet atau konsol browser untuk detail.';
                } finally {
                    uploadButton.disabled = false;
                }
            } else {
                alert('Pilih file gambar terlebih dahulu!');
            }
        });
    } else {
        console.log("script.js: Upload elements NOT found on this page. Skipping upload logic.");
    }


    // --- Bagian Deteksi Real-time (Kamera) ---
    const startCameraButton = document.getElementById('startCameraButton');

    // Fitur ini hanya akan aktif jika elemen 'startCameraButton' ditemukan (yaitu di index.html)
    if (startCameraButton) {
        console.log("script.js: Camera elements found. Initializing camera logic.");

        const video = document.getElementById('cameraFeed');
        const stopCameraButton = document.getElementById('stopCameraButton');
        const captureButton = document.getElementById('captureButton');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');

        const cameraGeminiResult = document.getElementById('cameraGeminiResult');
        let stream;

        startCameraButton.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                startCameraButton.style.display = 'none';
                stopCameraButton.style.display = 'inline-block';
                captureButton.style.display = 'inline-block';
                cameraGeminiResult.textContent = '';
            } catch (err) {
                console.error("Error saat mengakses kamera: ", err);
                alert('Gagal mengakses kamera. Pastikan Anda memberikan izin dan tidak ada aplikasi lain yang menggunakan kamera.');
            }
        });

        stopCameraButton.addEventListener('click', () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                video.srcObject = null;
                startCameraButton.style.display = 'inline-block';
                stopCameraButton.style.display = 'none';
                captureButton.style.display = 'none';
                cameraGeminiResult.textContent = '';
            }
        });

        captureButton.addEventListener('click', async () => {
            if (!stream) {
                alert('Kamera belum aktif. Silakan mulai kamera terlebih dahulu!');
                return;
            }

            cameraGeminiResult.textContent = 'Menganalisis... Mohon tunggu.';
            captureButton.disabled = true;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageDataURL = canvas.toDataURL('image/jpeg');

            try {
                const response = await fetch('/stream_analysis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: imageDataURL })
                });
                const data = await response.json();

                if (data.gemini_analysis) {
                    cameraGeminiResult.textContent = data.gemini_analysis;
                } else if (data.error) {
                    cameraGeminiResult.textContent = `Error: ${data.error}`;
                }
            } catch (error) {
                console.error('Error saat memproses stream dari kamera:', error);
                cameraGeminiResult.textContent = 'Gagal menganalisis dari kamera. Periksa koneksi internet atau konsol browser.';
            } finally {
                captureButton.disabled = false;
            }
        });
    } else {
        console.log("script.js: Camera elements NOT found on this page. Skipping camera logic.");
    }


    // --- LOGIKA SIDEBAR (Berlaku untuk semua halaman) ---
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    console.log("script.js: Sidebar element (sidebar):", sidebar);
    console.log("script.js: Menu Toggle element (menuToggle):", menuToggle);
    console.log("script.js: Close Sidebar element (closeSidebar):", closeSidebar);
    console.log("script.js: Sidebar Overlay element (sidebarOverlay):", sidebarOverlay);

    function toggleSidebar() {
        console.log("toggleSidebar function called!");
        sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
        sidebarOverlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    }

    if (sidebar && menuToggle && closeSidebar && sidebarOverlay) {
        console.log("script.js: All critical sidebar elements found. Attaching event listeners.");
        menuToggle.addEventListener('click', toggleSidebar);
        closeSidebar.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    } else {
        console.error("script.js: Critical sidebar elements NOT found. Sidebar functionality might be broken.");
    }

    const currentPath = window.location.pathname;
    sidebarLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === '#') { // Jaga-jaga jika ada link # di masa depan
            link.addEventListener('click', (event) => {
                event.preventDefault();
                if (sidebar.classList.contains('open')) {
                    toggleSidebar();
                }
                alert('Fitur ini belum tersedia!');
            });
        } else {
            link.addEventListener('click', () => {
                if (sidebar.classList.contains('open')) {
                    toggleSidebar();
                }
            });
        }
    });

    // --- LOGIKA IKON SEARCH DI HEADER UTAMA ---
    const mainSearchIcon = document.getElementById('mainSearchIcon');
    if (mainSearchIcon) {
        mainSearchIcon.addEventListener('click', () => {
            alert('Fitur Pencarian Belum Diimplementasikan Sepenuhnya! Ini adalah placeholder.');
        });
    }
});
console.log('Hello');
console.log("John")
console.log('You can call me "Santuy"');
console.log("Go away, I'm Coding");
console.log('I am sorry\nplease forgive me');

//
function hitungKalori(aktivitas, durasi) {
    let kalori = 0;

    if (aktivitas === 'lari') {
        // Membakar 60 kalori setiap 5 menit
        kalori = (durasi / 5) * 60;
    } else if (aktivitas === 'push-up') {
        // Membakar 200 kalori setiap 30 menit
        kalori = (durasi / 30) * 200;
    } else if (aktivitas === 'plank') {
        // Membakar 5 kalori setiap 1 menit
        kalori = durasi * 5;
    } else {
        console.log("Aktivitas tidak dikenal");
        return 0;
    }

    return kalori;
}

// Fungsi utama untuk menjalankan program
function main() {
    let totalKalori = 0;
    let aktivitas;
    let durasi;

    while (true) {
        aktivitas = prompt("Masukkan aktivitas olahraga (lari, push-up, plank) atau ketik 'selesai' untuk menghentikan:");
        if (aktivitas.toLowerCase() === 'selesai') {
            break;
        }
        
        durasi = parseFloat(prompt("Masukkan durasi dalam menit:"));
        if (isNaN(durasi) || durasi < 0) {
            console.log("Durasi tidak valid. Silakan coba lagi.");
            continue;
        }

        let kaloriTerbakar = hitungKalori(aktivitas.toLowerCase(), durasi);
        totalKalori += kaloriTerbakar;
        console.log(`Kalori yang terbakar dari ${aktivitas} selama ${durasi} menit: ${kaloriTerbakar}`);
    }

    console.log(`Total kalori yang terbakar: ${totalKalori}`);
}

// Jalankan program
main();

// Import fungsi Firebase dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// --- PASTE KONFIGURASI FIREBASE ANDA DI SINI ---
const firebaseConfig = {
    apiKey: "AIzaSyCSLxtyU7qLTgoJEpbpm_qUFlsdrt5xmcU",
    authDomain: "nsz-roster.firebaseapp.com",
    databaseURL: "https://nsz-roster-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nsz-roster",
    storageBucket: "nsz-roster.firebasestorage.app",
    messagingSenderId: "959593585564",
    appId: "1:959593585564:web:5ae0e7b2f8515d860d0659",
    measurementId: "G-T5WEXQYBGY"
};

// Inisialisasi Firebase & Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const membersCollection = collection(db, "members");

document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.getElementById('formSection');
    const btnToggleForm = document.getElementById('btnToggleForm');
    const memberForm = document.getElementById('memberForm');
    const staffList = document.getElementById('staffList');
    const anggotaList = document.getElementById('anggotaList');

    // Fungsi Toggle Form
    btnToggleForm.addEventListener('click', () => {
        formSection.classList.toggle('hidden');
        if(formSection.classList.contains('hidden')) {
            btnToggleForm.textContent = '+ Tambahkan Member';
            btnToggleForm.style.backgroundColor = 'var(--accent-blue)';
        } else {
            btnToggleForm.textContent = 'Tutup Form';
            btnToggleForm.style.backgroundColor = 'var(--border-color)';
        }
    });

    // MENDENGARKAN PERUBAHAN DATABASE SECARA REAL-TIME (REALTIME MAGIC!)
    onSnapshot(membersCollection, (snapshot) => {
        const members = [];
        snapshot.forEach((doc) => {
            // Gabungkan ID dari Firestore dengan data form
            members.push({ id: doc.id, ...doc.data() });
        });
        
        renderMembers(members);
    });

    // Fungsi Render UI
    function renderMembers(members) {
        staffList.innerHTML = '';
        anggotaList.innerHTML = '';

        const staffs = members.filter(m => m.role === 'staff');
        const anggotas = members.filter(m => m.role === 'anggota');

        // Render Staff
        if (staffs.length === 0) {
            staffList.innerHTML = '<p class="empty-state">Belum ada data staff.</p>';
        } else {
            staffs.forEach(member => staffList.appendChild(createCard(member)));
        }

        // Render Anggota
        if (anggotas.length === 0) {
            anggotaList.innerHTML = '<p class="empty-state">Belum ada data anggota.</p>';
        } else {
            anggotas.forEach(member => anggotaList.appendChild(createCard(member)));
        }
    }

    // Fungsi Membuat Elemen Card HTML
    function createCard(member) {
        const div = document.createElement('div');
        div.className = `card ${member.role}`;
        
        div.innerHTML = `
            <div class="card-nick">${member.nick}</div>
            <div class="card-name">${member.nama}</div>
            <div class="card-discord">🎮 ${member.discord}</div>
            <div>
                <button class="btn-delete" data-id="${member.id}">Hapus</button>
            </div>
        `;

        // Tambahkan event listener untuk tombol hapus
        const deleteBtn = div.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', async () => {
            if(confirm("Yakin ingin menghapus member ini?")) {
                // Hapus data langsung dari Firestore
                await deleteDoc(doc(db, "members", member.id));
            }
        });

        return div;
    }

    // Fungsi Handle Submit Form ke Database
    memberForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const btnSubmit = memberForm.querySelector('.btn-submit');
        btnSubmit.textContent = 'Menyimpan...'; // Loading state
        btnSubmit.disabled = true;

        const newMember = {
            nama: document.getElementById('nama').value,
            nick: document.getElementById('nick').value,
            discord: document.getElementById('discord').value,
            role: document.getElementById('role').value,
            createdAt: new Date() // Menyimpan waktu input
        };

        try {
            // Tambahkan data ke Firestore
            await addDoc(membersCollection, newMember);
            
            memberForm.reset(); 
            formSection.classList.add('hidden'); 
            btnToggleForm.textContent = '+ Tambahkan Member';
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Gagal menyimpan data!");
        } finally {
            btnSubmit.textContent = 'Simpan Data';
            btnSubmit.disabled = false;
        }
    });
});

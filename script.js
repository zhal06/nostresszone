document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.getElementById('formSection');
    const btnToggleForm = document.getElementById('btnToggleForm');
    const memberForm = document.getElementById('memberForm');
    const staffList = document.getElementById('staffList');
    const anggotaList = document.getElementById('anggotaList');

    // Mengambil data dari LocalStorage, jika kosong buat array baru
    let members = JSON.parse(localStorage.getItem('nsz_members')) || [];

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

    // Fungsi Render UI
    function renderMembers() {
        // Bersihkan kontainer
        staffList.innerHTML = '';
        anggotaList.innerHTML = '';

        // Filter data
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
                <button class="btn-delete" onclick="deleteMember(${member.id})">Hapus</button>
            </div>
        `;
        return div;
    }

    // Fungsi Handle Submit Form
    memberForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah reload halaman

        const newMember = {
            id: Date.now(), // Generate ID unik dari waktu
            nama: document.getElementById('nama').value,
            nick: document.getElementById('nick').value,
            discord: document.getElementById('discord').value,
            role: document.getElementById('role').value
        };

        members.push(newMember); // Masukkan ke array
        saveData(); // Simpan ke storage
        renderMembers(); // Update tampilan
        
        memberForm.reset(); // Bersihkan form
        formSection.classList.add('hidden'); // Sembunyikan form kembali
        btnToggleForm.textContent = '+ Tambahkan Member';
    });

    // Fungsi Delete Member (Global Scope agar bisa dipanggil dari inline onclick)
    window.deleteMember = function(id) {
        if(confirm("Yakin ingin menghapus member ini?")) {
            members = members.filter(m => m.id !== id);
            saveData();
            renderMembers();
        }
    }

    // Fungsi Save ke LocalStorage
    function saveData() {
        localStorage.setItem('nsz_members', JSON.stringify(members));
    }

    // Panggil render pertama kali saat web dibuka
    renderMembers();
});
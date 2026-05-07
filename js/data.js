/* eslint-disable no-unused-vars */
var dataPengguna = [
  { id: 1, nama: "Rina Wulandari",  email: "rina@ut.ac.id",  password: "rina123",  role: "UPBJJ-UT",       lokasi: "UPBJJ Jakarta" },
  { id: 2, nama: "Agus Pranoto",    email: "agus@ut.ac.id",  password: "agus123",  role: "UPBJJ-UT",       lokasi: "UPBJJ Makassar" },
  { id: 3, nama: "Siti Marlina",    email: "siti@ut.ac.id",  password: "siti123",  role: "Puslaba",         lokasi: "Pusat" },
  { id: 4, nama: "Doni Setiawan",   email: "doni@ut.ac.id",  password: "doni123",  role: "Fakultas",        lokasi: "FISIP" },
  { id: 5, nama: "Admin SITTA",     email: "admin@ut.ac.id", password: "admin123", role: "Administrator",   lokasi: "Pusat" }
];

var dataBahanAjar = [
  {
    kodeLokasi: "0TMP01",
    kodeBarang: "ASIP4301",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 548,
    limit: 1000,
    cover: "img/pengantar_komunikasi.jpg",
    harga: 45000
  },
  {
    kodeLokasi: "0JKT01",
    kodeBarang: "EKMA4216",
    namaBarang: "Manajemen Keuangan",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 392,
    limit: 800,
    cover: "img/manajemen_keuangan.jpg",
    harga: 55000
  },
  {
    kodeLokasi: "0SBY02",
    kodeBarang: "EKMA4310",
    namaBarang: "Kepemimpinan",
    jenisBarang: "BMP",
    edisi: "1",
    stok: 278,
    limit: 500,
    cover: "img/kepemimpinan.jpg",
    harga: 42000
  },
  {
    kodeLokasi: "0MLG01",
    kodeBarang: "BIOL4211",
    namaBarang: "Mikrobiologi Dasar",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 165,
    limit: 400,
    cover: "img/mikrobiologi.jpg",
    harga: 60000
  },
  {
    kodeLokasi: "0UPBJJBDG",
    kodeBarang: "PAUD4401",
    namaBarang: "Perkembangan Anak Usia Dini",
    jenisBarang: "BMP",
    edisi: "4",
    stok: 204,
    limit: 600,
    cover: "img/paud_perkembangan.jpeg",
    harga: 48000
  },
  {
    kodeLokasi: "0MKS01",
    kodeBarang: "HKUM4301",
    namaBarang: "Hukum Tata Negara",
    jenisBarang: "Non-BMP",
    edisi: "2",
    stok: 89,
    limit: 300,
    cover: "",
    harga: 35000
  },
  {
    kodeLokasi: "0PDG01",
    kodeBarang: "MKDU4110",
    namaBarang: "Bahasa Indonesia",
    jenisBarang: "BMP",
    edisi: "5",
    stok: 712,
    limit: 1200,
    cover: "",
    harga: 30000
  }
];

var dataHistory = [
  {
    id: "TRX001",
    tanggal: "2025-08-20",
    do: "2023001234",
    pengguna: "Rina Wulandari",
    bahanAjar: "Manajemen Keuangan",
    jumlah: 50,
    status: "Selesai"
  },
  {
    id: "TRX002",
    tanggal: "2025-08-21",
    do: "2023005678",
    pengguna: "Agus Pranoto",
    bahanAjar: "Perkembangan Anak Usia Dini",
    jumlah: 30,
    status: "Selesai"
  },
  {
    id: "TRX003",
    tanggal: "2025-08-22",
    do: "2023009999",
    pengguna: "Doni Setiawan",
    bahanAjar: "Kepemimpinan",
    jumlah: 20,
    status: "Proses"
  },
  {
    id: "TRX004",
    tanggal: "2025-08-23",
    do: "2023007777",
    pengguna: "Siti Marlina",
    bahanAjar: "Mikrobiologi Dasar",
    jumlah: 15,
    status: "Proses"
  },
  {
    id: "TRX005",
    tanggal: "2025-08-24",
    do: "2023003333",
    pengguna: "Rina Wulandari",
    bahanAjar: "Pengantar Ilmu Komunikasi",
    jumlah: 40,
    status: "Selesai"
  }
];

var dataTracking = {
  "2023001234": {
    nomorDO: "2023001234",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "0JKT01",
    total: "Rp 180.000",
    progress: 50,
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },
      { waktu: "2025-08-25 16:30:00", keterangan: "Diteruskan ke Kantor Jakarta Selatan" }
    ]
  },
  "2023005678": {
    nomorDO: "2023005678",
    nama: "Agus Pranoto",
    status: "Terkirim",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG",
    total: "Rp 220.000",
    progress: 100,
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },
      { waktu: "2025-08-25 16:30:10", keterangan: "Diteruskan ke Kantor Kota Bandung" },
      { waktu: "2025-08-26 12:15:33", keterangan: "Tiba di Hub: Kota BANDUNG" },
      { waktu: "2025-08-26 15:06:12", keterangan: "Proses antar ke Cimahi" },
      { waktu: "2025-08-26 20:00:00", keterangan: "Selesai Antar. Penerima: Agus Pranoto" }
    ]
  },
  "2023009999": {
    nomorDO: "2023009999",
    nama: "Doni Setiawan",
    status: "Diproses",
    ekspedisi: "TIKI",
    tanggalKirim: "2025-08-22",
    paket: "0SBY02",
    total: "Rp 95.000",
    progress: 25,
    perjalanan: [
      { waktu: "2025-08-22 08:30:00", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-22 11:00:00", keterangan: "Tiba di Hub: TANGERANG SELATAN" }
    ]
  }
};

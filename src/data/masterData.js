export const MASTER_DATA = {
  // Master Jenis Dokumen
  docTypes: [
    { id: 1, name: "Skripsi", slug: "skripsi", description: "Karya Tulis Ilmiah Mahasiswa S1", isActive: true },
    { id: 2, name: "KTI (Karya Tulis Ilmiah)", slug: "kti", description: "Karya Tulis Ilmiah Mahasiswa D3", isActive: true },
    { id: 3, name: "Jurnal Penelitian", slug: "jurnal-penelitian", description: "Jurnal dari Penelitian Dosen/Mahasiswa", isActive: true },
    { id: 4, name: "Jurnal Pengabdian", slug: "jurnal-pengabdian", description: "Jurnal dari Pengabdian Masyarakat", isActive: true },
    { id: 5, name: "Buku Ajar", slug: "buku-ajar", description: "Buku Referensi/Buku Ajar Dosen", isActive: true },
  ],
  
  // Master Program Studi
  programStudi: [
    { id: 1, name: "S1 Farmasi", code: "S1-F", status: "Aktif", head: "Apoteker Kepala" },
    { id: 2, name: "S1 Gizi", code: "S1-G", status: "Aktif", head: "Ahli Gizi Senior" },
    { id: 3, name: "D3 Kebidanan", code: "D3-K", status: "Aktif", head: "Bidan Kepala" },
    { id: 4, name: "S1 Keperawatan", code: "S1-Kep", status: "Tidak Aktif", head: "-" }, // Contoh status inaktif
  ]
};

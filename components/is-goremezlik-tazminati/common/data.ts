export const columns = [
    {name: 'Dosya No', uid: 'dosyaNo'},
    {name: 'Ad Soyad', uid: 'name'},
    {name: 'Hasar Dosya No', uid: 'hasarDosyaNo'},
    {name: 'Rapor Tarihi', uid: 'raporTarihi'},
    {name: 'Dosya Sahibi', uid: 'dosyaSahibi'},
    {name: 'Onaylayan', uid: 'onaylayan'},
    {name: 'Durum', uid: 'status'},
    {name: 'İşlemler', uid: 'actions'},
];
export const users = [
    {
        id: 1,
        dosyaNo: "IGT-2024-001",
        name: "Ahmet Yılmaz",
        hasarDosyaNo: "HDN-2024-001",
        raporTarihi: "2024-03-15",
        dosyaSahibi: "Mehmet Demir",
        onaylayan: "Ayşe Kaya",
        status: "active",
        email: "ahmet.yilmaz@example.com"
    },
    {
        id: 2,
        dosyaNo: "IGT-2024-002",
        name: "Fatma Şahin",
        hasarDosyaNo: "HDN-2024-015",
        raporTarihi: "2024-03-14",
        dosyaSahibi: "Ali Yıldız",
        onaylayan: "Zeynep Ak",
        status: "success",
        email: "fatma.sahin@example.com"
    },
    {
        id: 3,
        dosyaNo: "IGT-2024-003",
        name: "Mustafa Çelik",
        hasarDosyaNo: "HDN-2024-022",
        raporTarihi: "2024-03-13",
        dosyaSahibi: "Ayşe Kaya",
        onaylayan: "Mehmet Demir",
        status: "paused",
        email: "mustafa.celik@example.com"
    }
];
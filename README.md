# Aplikasi Data Pribadi

Aplikasi Data Pribadi adalah sistem manajemen data karyawan berbasis web (CRUD 1 Tabel) yang dibangun menggunakan Java Spring Boot. Aplikasi ini dikembangkan untuk memenuhi kebutuhan tes teknis rekrutmen.

## Teknologi yang Digunakan

- **Back-End:** Java 21, Spring Boot, Spring Data JPA / Hibernate
- **Database:** H2 In-Memory Database (Data otomatis di-reset saat aplikasi direstart)
- **Front-End:** HTML5, CSS3, JavaScript (jQuery 3.7.1, Bootstrap 5.3.8)

## Fitur Utama

- **Create (Tambah Data):** Menambahkan data pribadi karyawan baru dengan validasi form.
- **Read (Monitoring):** Menampilkan daftar karyawan dengan fitur pencarian gabungan berdasarkan NIK atau Nama Lengkap.
- **Update (Edit Data):** Mengubah data karyawan (kolom NIK bersifat _readonly_ saat mode edit).
- **Delete (Hapus Data):** Menghapus data karyawan dengan pop-up konfirmasi.
- **Umur Dinamis:** Kolom umur pada tabel dihitung secara otomatis menggunakan Java/JS berdasarkan Tanggal Lahir (tidak disimpan secara statis di database).

## Prasyarat Sistem

- Java Development Kit (JDK) 21 atau yang lebih baru.
- _Catatan: Anda tidak perlu menginstal Maven secara global karena proyek ini sudah menyediakan Maven Wrapper (`mvnw`)._

## Cara Menjalankan Aplikasi

1.  Buka terminal atau _command prompt_ dan arahkan ke root direktori proyek ini.
2.  Lakukan proses kompilasi dan _build_ dengan perintah:
    ```bash
    .\mvnw.cmd clean verify
    ```
    _(Gunakan `./mvnw clean verify` jika Anda menggunakan Linux/macOS)_
3.  Setelah proses _build_ sukses, jalankan file `.jar` yang dihasilkan:
    ```bash
    java -jar target/data-pribadi-1.0.0.jar
    ```
4.  Buka _browser_ Anda dan akses aplikasi pada tautan berikut:
    **http://localhost:8080**

## Struktur Database

Aplikasi ini menggunakan satu tabel `personal_data` dengan skema berikut:

- `nik` (String, Primary Key)
- `nama_lengkap` (String)
- `jenis_kelamin` (String)
- `tanggal_lahir` (Date)
- `alamat` (Text)
- `negara` (String)

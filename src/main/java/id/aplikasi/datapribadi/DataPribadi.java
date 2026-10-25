package id.aplikasi.datapribadi;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "personal_data")
public class DataPribadi {
    @Id
    @NotBlank(message = "NIK wajib diisi.")
    @Pattern(regexp = "[0-9]{1,16}", message = "NIK harus berisi 1 sampai 16 digit angka.")
    @Column(length = 16, nullable = false, updatable = false)
    private String nik;

    @NotBlank(message = "Nama Lengkap wajib diisi.")
    @Size(max = 200, message = "Nama Lengkap maksimal 200 karakter.")
    @Column(nullable = false, length = 200)
    private String namaLengkap;

    @Pattern(regexp = "Laki-Laki|Perempuan", message = "Pilih jenis kelamin yang tersedia.")
    @Column(length = 20)
    private String jenisKelamin;

    @PastOrPresent(message = "Tanggal Lahir tidak boleh di masa depan.")
    private LocalDate tanggalLahir;

    @Size(max = 5000, message = "Alamat maksimal 5000 karakter.")
    @Column(columnDefinition = "TEXT")
    private String alamat;

    @Pattern(regexp = "Indonesia|Malaysia|Argentina|Portugal|Rusia", message = "Pilih negara yang tersedia.")
    @Column(length = 100)
    private String negara;

    @Transient
    private Integer umur;

    public String getNik() { return nik; }
    public void setNik(String nik) { this.nik = nik; }
    public String getNamaLengkap() { return namaLengkap; }
    public void setNamaLengkap(String namaLengkap) { this.namaLengkap = namaLengkap; }
    public String getJenisKelamin() { return jenisKelamin; }
    public void setJenisKelamin(String jenisKelamin) { this.jenisKelamin = jenisKelamin; }
    public LocalDate getTanggalLahir() { return tanggalLahir; }
    public void setTanggalLahir(LocalDate tanggalLahir) { this.tanggalLahir = tanggalLahir; }
    public String getAlamat() { return alamat; }
    public void setAlamat(String alamat) { this.alamat = alamat; }
    public String getNegara() { return negara; }
    public void setNegara(String negara) { this.negara = negara; }
    public Integer getUmur() { return umur; }
    public void setUmur(Integer umur) { this.umur = umur; }
}

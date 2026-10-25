package id.aplikasi.datapribadi;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DataPribadiRepository extends JpaRepository<DataPribadi, String> {
    java.util.List<DataPribadi> findByNikContainingAndNamaLengkapContainingIgnoreCaseOrderByNikAsc(String nik, String nama);
}

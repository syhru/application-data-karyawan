package id.aplikasi.datapribadi;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DataPribadiService {
    private final DataPribadiRepository repository;

    public DataPribadiService(DataPribadiRepository repository) {
        this.repository = repository;
    }

    public List<DataPribadi> list(String nik, String nama) {
        return repository.findByNikContainingAndNamaLengkapContainingIgnoreCaseOrderByNikAsc(nik.strip(), nama.strip())
                .stream().map(this::hitungUmur).toList();
    }

    public DataPribadi detail(String nik) {
        return hitungUmur(repository.findById(nik).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan.")));
    }

    public DataPribadi create(DataPribadi input) {
        if (repository.existsById(input.getNik())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "NIK sudah terdaftar.");
        }
        return hitungUmur(repository.save(input));
    }

    public DataPribadi update(String nik, DataPribadi input) {
        if (!nik.equals(input.getNik())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "NIK tidak boleh diubah.");
        }
        var data = detail(nik);
        data.setNamaLengkap(input.getNamaLengkap());
        data.setJenisKelamin(input.getJenisKelamin());
        data.setTanggalLahir(input.getTanggalLahir());
        data.setAlamat(input.getAlamat());
        data.setNegara(input.getNegara());
        return hitungUmur(repository.save(data));
    }

    public void delete(String nik) {
        detail(nik);
        repository.deleteById(nik);
    }

    private DataPribadi hitungUmur(DataPribadi data) {
        data.setUmur(data.getTanggalLahir() == null ? null :
                Period.between(data.getTanggalLahir(), LocalDate.now()).getYears());
        return data;
    }
}

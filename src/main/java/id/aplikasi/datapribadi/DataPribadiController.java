package id.aplikasi.datapribadi;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/data-pribadi")
public class DataPribadiController {
    private final DataPribadiService service;

    public DataPribadiController(DataPribadiService service) {
        this.service = service;
    }

    @GetMapping
    public List<DataPribadi> list(@RequestParam(defaultValue = "") String nik,
                                 @RequestParam(defaultValue = "") String nama) {
        return service.list(nik, nama);
    }

    @GetMapping("/{nik}")
    public DataPribadi detail(@PathVariable String nik) {
        return service.detail(nik);
    }

    @PostMapping
    public ResponseEntity<DataPribadi> create(@Valid @RequestBody DataPribadi input) {
        var data = service.create(input);
        return ResponseEntity.created(URI.create("/api/data-pribadi/" + data.getNik())).body(data);
    }

    @PutMapping("/{nik}")
    public DataPribadi update(@PathVariable String nik, @Valid @RequestBody DataPribadi input) {
        return service.update(nik, input);
    }

    @DeleteMapping("/{nik}")
    public ResponseEntity<Void> delete(@PathVariable String nik) {
        service.delete(nik);
        return ResponseEntity.noContent().build();
    }
}

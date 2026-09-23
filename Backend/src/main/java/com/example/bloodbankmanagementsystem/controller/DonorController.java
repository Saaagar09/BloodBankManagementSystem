package com.example.bloodbankmanagementsystem.controller;
import com.example.bloodbankmanagementsystem.dto.DonorAdminDTO;
import com.example.bloodbankmanagementsystem.dto.DonorDTO;
import com.example.bloodbankmanagementsystem.dto.DonorUpdateDTO;
import com.example.bloodbankmanagementsystem.entity.DonorEntity;
import com.example.bloodbankmanagementsystem.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/bloodbank/Donor")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }


    @PostMapping
    public ResponseEntity<DonorDTO> addDonor(@Valid @RequestBody DonorDTO donorDTO){
        DonorDTO donorAdded = donorService.addDonor(donorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(donorAdded);
    }

    @GetMapping
    public ResponseEntity<List<DonorAdminDTO>> getAllDonors() {

        List<DonorAdminDTO> getalldonor = donorService.getAllDonors();

        return ResponseEntity.status(HttpStatus.OK).body(getalldonor);
    }



    @GetMapping("/{id}")
    public ResponseEntity<DonorDTO> getDonor(@PathVariable Long id){
        DonorDTO donorFound = donorService.getDonorById(id);
        return ResponseEntity.status(HttpStatus.OK).body(donorFound);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DonorDTO> updatePartialDonor(@PathVariable Long id, @RequestBody DonorUpdateDTO donorUpdateDTO) {
        DonorDTO updated = donorService.updatePartialDonor(id, donorUpdateDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDonor(@PathVariable Long id ){

        String response = donorService.deleteDonorById(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    // role user controller

    @GetMapping("/me")
    public ResponseEntity<DonorDTO> getMyDonor() {
        DonorDTO getDonor = donorService.getMyDonor();
        return ResponseEntity.status(HttpStatus.CREATED).body(getDonor);
    }

    @PatchMapping("/me")
    public ResponseEntity<DonorDTO> updateMyDonor(
            @RequestBody DonorUpdateDTO donorUpdateDTO) {

        return ResponseEntity.ok(
                donorService.updateMyDonor(donorUpdateDTO)
        );
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteMyDonor() {

        donorService.deleteMyDonor();

        return ResponseEntity.ok("Donor deleted successfully");
    }

}

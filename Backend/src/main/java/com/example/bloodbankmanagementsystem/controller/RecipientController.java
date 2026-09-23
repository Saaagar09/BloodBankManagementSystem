package com.example.bloodbankmanagementsystem.controller;

import com.example.bloodbankmanagementsystem.dto.RecipientDTO;
import com.example.bloodbankmanagementsystem.dto.RecipientResponseDTO;
import com.example.bloodbankmanagementsystem.dto.RecipientUpdateDTO;
import com.example.bloodbankmanagementsystem.service.RecipientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/bloodbank/Recipient")
public class RecipientController {

    private final RecipientService recipientService;

    public RecipientController(RecipientService recipientService) {
        this.recipientService = recipientService;
    }

   // add Recipient

    @PostMapping
    public ResponseEntity<RecipientDTO> addrecipient(@Valid @RequestBody RecipientDTO recipientDTO){
       RecipientDTO addRecipient = recipientService.addRecipient(recipientDTO);
       return ResponseEntity.status(HttpStatus.CREATED).body(addRecipient);
    }

    // get Recipient by id

    @GetMapping("/{id}")
    public ResponseEntity<RecipientDTO> getRecipient(@PathVariable Long id){
        RecipientDTO response = recipientService.getRecipient(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    //get all recipient
    @GetMapping
    public ResponseEntity<List<RecipientResponseDTO>> getAllRecipient(){
        List<RecipientResponseDTO> response =  recipientService.getAllRecipient();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    //get all recipients of current login user
    @GetMapping("/me")
    public ResponseEntity<List<RecipientResponseDTO>> getMyRecipients() {

        List<RecipientResponseDTO> response = recipientService.getMyRecipients();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // update Recipient
    @PatchMapping("/{id}")
    public ResponseEntity<RecipientDTO> updateRecipient(@PathVariable Long id ,
                                                        @RequestBody RecipientUpdateDTO recipientUpdateDTO){
        RecipientDTO response = recipientService.updateRecipient(id,recipientUpdateDTO);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    //Delete Recipient
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipient(@PathVariable Long id ){
       String responseDTO =  recipientService.deleteRecipient(id);
        return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
    }

    @PatchMapping("/me/{id}")
    public ResponseEntity<RecipientDTO> updateMyRecipient(@PathVariable Long id,
                                                          @RequestBody RecipientUpdateDTO recipientUpdateDTO)
    {
        return ResponseEntity.ok(
                recipientService.updateMyRecipient(id, recipientUpdateDTO)
        );
    }

    @DeleteMapping("/me/{id}")
    public ResponseEntity<String> deleteMyRecipient(
            @PathVariable Long id) {

        recipientService.deleteMyRecipient(id);

        return ResponseEntity.ok("Recipient deleted successfully");
    }
}

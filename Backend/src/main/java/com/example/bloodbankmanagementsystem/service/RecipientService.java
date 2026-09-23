package com.example.bloodbankmanagementsystem.service;


import com.example.bloodbankmanagementsystem.dto.AcceptedDonorDTO;
import com.example.bloodbankmanagementsystem.dto.RecipientDTO;
import com.example.bloodbankmanagementsystem.dto.RecipientResponseDTO;
import com.example.bloodbankmanagementsystem.dto.RecipientUpdateDTO;
import com.example.bloodbankmanagementsystem.entity.DonorEntity;
import com.example.bloodbankmanagementsystem.entity.MyUser;
import com.example.bloodbankmanagementsystem.entity.NotificationEntity;
import com.example.bloodbankmanagementsystem.entity.RecipientEntity;
import com.example.bloodbankmanagementsystem.exception.ResourceNotFoundException;
import com.example.bloodbankmanagementsystem.mapper.RecipientMapper;
import com.example.bloodbankmanagementsystem.repository.MyUserRepository;
import com.example.bloodbankmanagementsystem.repository.NotificationRepository;
import com.example.bloodbankmanagementsystem.repository.RecipientRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecipientService {

    private final RecipientRepository recipientRepository;
    private final MyUserRepository myUserRepository;
    private final RecipientMapper recipientMapper;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    public RecipientService(RecipientRepository recipientRepository, MyUserRepository myUserRepository, RecipientMapper recipientMapper, NotificationService notificationService, NotificationRepository notificationRepository) {
        this.recipientRepository = recipientRepository;
        this.myUserRepository = myUserRepository;
        this.recipientMapper = recipientMapper;
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
    }

    // add service
    public RecipientDTO addRecipient(RecipientDTO recipientDTO) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // DTO -> Entity
        RecipientEntity addRecipient =
                recipientMapper.DtoToEntity(recipientDTO);

        // Link authenticated user
        addRecipient.setUser(myUser);

        // Save
        RecipientEntity recipientEntity = recipientRepository.save(addRecipient);

        // Find matching donors and create notifications for them
        notificationService.createNotificationsForRequest(recipientEntity);


        // Entity -> DTO
        return recipientMapper.EntityToDto(recipientEntity);
    }

    //  get all recipients service
    public List<RecipientResponseDTO> getAllRecipient() {

        List<RecipientEntity> recipients =
                recipientRepository.findAllByIsDeletedFalse();

        if (recipients.isEmpty()) {
            throw new ResourceNotFoundException("No Recipients in Database");
        }

        List<RecipientResponseDTO> dtoList = new ArrayList<>();

        for (RecipientEntity recipient : recipients) {
            dtoList.add(recipientMapper.EntityToResponseDto(recipient));
        }

        return dtoList;
    }


    // get all recipients of current user / logged in user
    public List<RecipientResponseDTO> getMyRecipients() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<RecipientEntity> recipients =
                recipientRepository.findAllByUserIdAndIsDeletedFalse(myUser.getId());

        List<RecipientResponseDTO> dtoList = new ArrayList<>();

        for (RecipientEntity recipient : recipients) {

            RecipientResponseDTO dto =
                    recipientMapper.EntityToResponseDto(recipient);

            List<NotificationEntity> acceptedNotifications =
                    notificationRepository.findAllByRecipientIdAndStatus(
                            recipient.getId(),
                            "ACCEPTED"
                    );

            List<AcceptedDonorDTO> acceptedDonors =
                    new ArrayList<>();

            for (NotificationEntity notification : acceptedNotifications) {

                DonorEntity donor = notification.getDonor();

                AcceptedDonorDTO donorDTO = new AcceptedDonorDTO();

                donorDTO.setId(donor.getId());
                donorDTO.setName(donor.getName());
                donorDTO.setBloodGroup(donor.getBloodGroup());
                donorDTO.setCity(donor.getCity());
                donorDTO.setContactNumber(donor.getContactNumber());

                acceptedDonors.add(donorDTO);
            }

            dto.setAcceptedDonors(acceptedDonors);

            dtoList.add(dto);
        }

        return dtoList;
    }

    //get recipient By id
    public RecipientDTO getRecipient(Long id) {

        // Fetching Recipient from the database

        RecipientEntity recipientEntity = recipientRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found With ID: " +id));

        //Entity-> DTO response

        return recipientMapper.EntityToDto(recipientEntity);


    }

    // Patch / Update recipient
    public RecipientDTO updateRecipient(
            Long id,
            RecipientUpdateDTO recipientUpdateDTO) {

        RecipientEntity response = recipientRepository
                .findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Recipient not found With ID: " + id));

        if (recipientUpdateDTO.getName() != null) {
            response.setName(recipientUpdateDTO.getName());
        }

        if (recipientUpdateDTO.getAge() != null) {
            response.setAge(recipientUpdateDTO.getAge());
        }

        if (recipientUpdateDTO.getCity() != null) {
            response.setCity(recipientUpdateDTO.getCity());
        }

        if (recipientUpdateDTO.getUnits() != null) {
            response.setUnits(recipientUpdateDTO.getUnits());
        }

        if (recipientUpdateDTO.getPurpose() != null) {
            response.setPurpose(recipientUpdateDTO.getPurpose());
        }

        if (recipientUpdateDTO.getBloodGroup() != null) {
            response.setBloodGroup(recipientUpdateDTO.getBloodGroup());
        }

        if (recipientUpdateDTO.getContactNumber() != null) {
            response.setContactNumber(recipientUpdateDTO.getContactNumber());
        }

        RecipientEntity updatedRecipient =
                recipientRepository.save(response);

        return recipientMapper.EntityToDto(updatedRecipient);
    }

    // Delete Recipient by id
    public String deleteRecipient(Long id) {

        RecipientEntity recipient = recipientRepository
                .findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Recipient not found With ID: " + id));

        recipient.setIsDeleted(true);

        recipientRepository.save(recipient);

        return "Recipient Deleted Successfully";
    }


    //role user
    public RecipientDTO updateMyRecipient(
            Long id,
            RecipientUpdateDTO recipientUpdateDTO) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        RecipientEntity recipient = recipientRepository
                .findByIdAndUserIdAndIsDeletedFalse(id, myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Recipient not found or does not belong to you"));

        if (recipientUpdateDTO.getName() != null) {
            recipient.setName(recipientUpdateDTO.getName());
        }

        if (recipientUpdateDTO.getAge() != null) {
            recipient.setAge(recipientUpdateDTO.getAge());
        }

        if (recipientUpdateDTO.getCity() != null) {
            recipient.setCity(recipientUpdateDTO.getCity());
        }

        if (recipientUpdateDTO.getUnits() != null) {
            recipient.setUnits(recipientUpdateDTO.getUnits());
        }

        if (recipientUpdateDTO.getPurpose() != null) {
            recipient.setPurpose(recipientUpdateDTO.getPurpose());
        }

        if (recipientUpdateDTO.getBloodGroup() != null) {
            recipient.setBloodGroup(recipientUpdateDTO.getBloodGroup());
        }

        if (recipientUpdateDTO.getContactNumber() != null) {
            recipient.setContactNumber(recipientUpdateDTO.getContactNumber());
        }

        RecipientEntity updatedRecipient =
                recipientRepository.save(recipient);

        return recipientMapper.EntityToDto(updatedRecipient);
    }

    public void deleteMyRecipient(Long id ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        RecipientEntity recipient = recipientRepository
                .findByIdAndUserIdAndIsDeletedFalse(id, myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recipient not found"));

        recipient.setIsDeleted(true);

        recipientRepository.save(recipient);
    }
}

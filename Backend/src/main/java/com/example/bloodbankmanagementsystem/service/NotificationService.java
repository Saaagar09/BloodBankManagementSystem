package com.example.bloodbankmanagementsystem.service;

import com.example.bloodbankmanagementsystem.dto.NotificationResponseDTO;
import com.example.bloodbankmanagementsystem.entity.DonorEntity;
import com.example.bloodbankmanagementsystem.entity.MyUser;
import com.example.bloodbankmanagementsystem.entity.NotificationEntity;
import com.example.bloodbankmanagementsystem.entity.RecipientEntity;
import com.example.bloodbankmanagementsystem.exception.ResourceNotFoundException;
import com.example.bloodbankmanagementsystem.repository.DonorRepository;
import com.example.bloodbankmanagementsystem.repository.MyUserRepository;
import com.example.bloodbankmanagementsystem.repository.NotificationRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.bloodbankmanagementsystem.repository.RecipientRepository;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final MyUserRepository myUserRepository;
    private final DonorRepository donorRepository;
    private final RecipientRepository recipientRepository;


    public NotificationService(
            NotificationRepository notificationRepository,
            MyUserRepository myUserRepository,
            DonorRepository donorRepository,
            RecipientRepository recipientRepository) {

        this.notificationRepository = notificationRepository;
        this.myUserRepository = myUserRepository;
        this.donorRepository = donorRepository;
        this.recipientRepository = recipientRepository;
    }

    public List<NotificationResponseDTO> getMyNotifications() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        DonorEntity donor = donorRepository
                .findByUserIdAndIsDeletedFalse(myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor profile not found"));

        List<NotificationEntity> notifications =
                notificationRepository.findAllByDonorId(donor.getId());

        List<NotificationResponseDTO> responseList =
                new ArrayList<>();

        for (NotificationEntity notification : notifications) {

            NotificationResponseDTO response =
                    new NotificationResponseDTO();

            response.setId(notification.getId());
            response.setMessage(notification.getMessage());
            response.setStatus(notification.getStatus());
            response.setCreatedAt(notification.getCreatedAt());

            responseList.add(response);
        }

        return responseList;
    }



    public void createNotificationsForDonor(DonorEntity donor) {

        List<RecipientEntity> matchingRequests =
                recipientRepository
                        .findAllByBloodGroupAndCityAndIsDeletedFalse(
                                donor.getBloodGroup(),
                                donor.getCity()
                        );

        for (RecipientEntity recipient : matchingRequests) {

            NotificationEntity notification =
                    new NotificationEntity();

            notification.setDonor(donor);
            notification.setRecipient(recipient);

            notification.setMessage(
                    recipient.getName()
                            + " needs "
                            + recipient.getBloodGroup()
                            + " blood in "
                            + recipient.getCity()
            );

            notification.setStatus("PENDING");

            notification.setCreatedAt(LocalDateTime.now());

            notificationRepository.save(notification);
        }
    }

    public void createNotificationsForRequest(RecipientEntity recipient) {

        List<DonorEntity> matchingDonors =
                donorRepository.findAllByBloodGroupAndCityAndIsDeletedFalse(
                        recipient.getBloodGroup(),
                        recipient.getCity()
                );

        for (DonorEntity donor : matchingDonors) {

            NotificationEntity notification = new NotificationEntity();

            notification.setDonor(donor);
            notification.setRecipient(recipient);

            notification.setMessage(
                    recipient.getName()
                            + " needs "
                            + recipient.getBloodGroup()
                            + " blood in "
                            + recipient.getCity()
            );

            notification.setStatus("PENDING");
            notification.setCreatedAt(LocalDateTime.now());

            notificationRepository.save(notification);
        }
    }


    @Transactional
    public void markAsRead(Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        DonorEntity donor = donorRepository
                .findByUserIdAndIsDeletedFalse(myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor profile not found"));

        int updatedRows =
                notificationRepository.markAsRead(
                        id,
                        donor.getId()
                );

        if (updatedRows == 0) {
            throw new ResourceNotFoundException(
                    "Notification not found or does not belong to you"
            );
        }
    }


    @Transactional
    public void markAsAccepted(Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        DonorEntity donor = donorRepository
                .findByUserIdAndIsDeletedFalse(myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor profile not found"));

        int updatedRows =
                notificationRepository.markAsAccepted(id, donor.getId());

        if (updatedRows == 0) {
            throw new ResourceNotFoundException(
                    "Notification not found or does not belong to you"
            );
        }
    }


    @Transactional
    public void markAsDeclined(Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        DonorEntity donor = donorRepository
                .findByUserIdAndIsDeletedFalse(myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor profile not found"));

        int updatedRows =
                notificationRepository.markAsDeclined(id, donor.getId());

        if (updatedRows == 0) {
            throw new ResourceNotFoundException(
                    "Notification not found or does not belong to you"
            );
        }
    }
}
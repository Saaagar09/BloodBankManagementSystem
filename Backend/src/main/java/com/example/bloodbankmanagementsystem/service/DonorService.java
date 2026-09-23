package com.example.bloodbankmanagementsystem.service;

import com.example.bloodbankmanagementsystem.dto.DonorAdminDTO;
import com.example.bloodbankmanagementsystem.dto.DonorDTO;

import com.example.bloodbankmanagementsystem.dto.DonorUpdateDTO;
import com.example.bloodbankmanagementsystem.entity.DonorEntity;
import com.example.bloodbankmanagementsystem.entity.MyUser;
import com.example.bloodbankmanagementsystem.exception.ResourceNotFoundException;
import com.example.bloodbankmanagementsystem.mapper.DonorMapper;
import com.example.bloodbankmanagementsystem.repository.DonorRepository;
import com.example.bloodbankmanagementsystem.repository.MyUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DonorService {

    private final DonorRepository donorRepository;
    private final MyUserRepository myUserRepository;
    private final DonorMapper donorMapper;

    public DonorService(DonorRepository donorRepository, MyUserRepository myUserRepository, DonorMapper donorMapper)
    {
        this.donorRepository = donorRepository;
        this.myUserRepository = myUserRepository;
        this.donorMapper = donorMapper;
    }

    public DonorDTO addDonor(DonorDTO donorDTO) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Optional<DonorEntity> existingDonor =
                donorRepository.findByUserId(myUser.getId());

        if (existingDonor.isPresent()) {
            throw new IllegalStateException(" ⚠️ You already Added donor , Please Check My Donor Profile !");
        }

        // DTO -> Entity
        DonorEntity donor = donorMapper.DtoToEntity(donorDTO);

        // linking the existing authenticated user to the new donor record
        donor.setUser(myUser);

        // save to db
        DonorEntity savedDonor = donorRepository.save(donor);

        // Entity -> DTO (Response)
        return donorMapper.EntityToDto(savedDonor);
    }

    public DonorDTO getDonorById(Long id) {

        DonorEntity donor = donorRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Donor not found With ID: " + id));

        // Entity → DTO

        return donorMapper.EntityToDto(donor);
    }

    public List<DonorAdminDTO> getAllDonors() {

        List<DonorEntity> donors = donorRepository.findAllByIsDeletedFalse();

        if (donors.isEmpty()) {
            throw new ResourceNotFoundException("No donors found");
        }

        List<DonorAdminDTO> dtoList = new ArrayList<>();

        for (DonorEntity donor : donors) {

            dtoList.add(donorMapper.EntityToAdminDto(donor));
        }

        return dtoList;
    }

    public DonorDTO updatePartialDonor(Long id, DonorUpdateDTO donorUpdateDTO) {

        DonorEntity getfield = donorRepository
                .findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Donor not found With ID: " + id));

        if (donorUpdateDTO.getName() != null) {
            getfield.setName(donorUpdateDTO.getName());
        }

        if (donorUpdateDTO.getBloodGroup() != null) {
            getfield.setBloodGroup(donorUpdateDTO.getBloodGroup());
        }

        if (donorUpdateDTO.getCity() != null) {
            getfield.setCity(donorUpdateDTO.getCity());
        }

        if (donorUpdateDTO.getAge() != null) {
            getfield.setAge(donorUpdateDTO.getAge());
        }

        if (donorUpdateDTO.getContactNumber() != null) {
            getfield.setContactNumber(donorUpdateDTO.getContactNumber());
        }

        DonorEntity updatedDonor = donorRepository.save(getfield);

        return donorMapper.EntityToDto(updatedDonor);
    }

    // Soft Delete
    public String deleteDonorById(Long id) {

        DonorEntity donor = donorRepository
                .findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor not found With ID: " + id));

        donor.setIsDeleted(true);

        donorRepository.save(donor);

        return "Donor Deleted Successfully";
    }

    //role user
    public DonorDTO getMyDonor() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        DonorEntity donor = donorRepository
                .findByUserIdAndIsDeletedFalse(myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        return donorMapper.EntityToDto(donor);
    }


    public DonorDTO updateMyDonor(DonorUpdateDTO donorUpdateDTO) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        DonorEntity donor = donorRepository
                .findByUserIdAndIsDeletedFalse(myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        if (donorUpdateDTO.getName() != null) {
            donor.setName(donorUpdateDTO.getName());
        }

        if (donorUpdateDTO.getBloodGroup() != null) {
            donor.setBloodGroup(donorUpdateDTO.getBloodGroup());
        }

        if (donorUpdateDTO.getCity() != null) {
            donor.setCity(donorUpdateDTO.getCity());
        }

        if (donorUpdateDTO.getAge() != null) {
            donor.setAge(donorUpdateDTO.getAge());
        }

        if (donorUpdateDTO.getContactNumber() != null) {
            donor.setContactNumber(donorUpdateDTO.getContactNumber());
        }

        DonorEntity updatedDonor = donorRepository.save(donor);

        return donorMapper.EntityToDto(updatedDonor);
    }

    // role user delete
    public void deleteMyDonor() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        MyUser myUser = myUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        DonorEntity donor = donorRepository
                .findByUserIdAndIsDeletedFalse(myUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        donor.setIsDeleted(true);

        donorRepository.save(donor);
    }

}

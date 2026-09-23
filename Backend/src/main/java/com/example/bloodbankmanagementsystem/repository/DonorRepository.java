package com.example.bloodbankmanagementsystem.repository;

import com.example.bloodbankmanagementsystem.entity.DonorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface DonorRepository extends JpaRepository<DonorEntity , Long > {
    Optional<DonorEntity> findByIdAndIsDeletedFalse(Long id);

    List<DonorEntity> findAllByIsDeletedFalse();


    Optional<DonorEntity> findByUserIdAndIsDeletedFalse(Long userId);

    Optional<DonorEntity> findByUserId(Long userId);

    //notification
    List<DonorEntity> findAllByBloodGroupAndCityAndIsDeletedFalse(
            String bloodGroup,
            String city);

}

package com.example.bloodbankmanagementsystem.repository;

import com.example.bloodbankmanagementsystem.entity.RecipientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipientRepository extends JpaRepository<RecipientEntity, Long> {

    Optional<RecipientEntity> findByIdAndIsDeletedFalse(Long id);

    List<RecipientEntity> findAllByIsDeletedFalse();

    Optional<RecipientEntity> findByUserIdAndIsDeletedFalse(Long userId);

    Optional<RecipientEntity> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    List<RecipientEntity> findAllByUserIdAndIsDeletedFalse(Long userId);

    //notification (This gives Spring Data JPA a query equivalent to:SELECT *
    //FROM recipient
    //WHERE blood_group = ?
    //AND city = ?
    //AND is_deleted = false;)

    List<RecipientEntity> findAllByBloodGroupAndCityAndIsDeletedFalse(String bloodGroup, String city);
}

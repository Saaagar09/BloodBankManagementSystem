package com.example.bloodbankmanagementsystem.repository;

import com.example.bloodbankmanagementsystem.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findAllByDonorId(Long donorId);

    List<NotificationEntity> findAllByRecipientIdAndStatus(
            Long recipientId,
            String status
    );

    @Modifying
    @Query("""
    UPDATE NotificationEntity n
    SET n.status = 'READ'
    WHERE n.id = :id
    AND n.donor.id = :donorId
    """)
    int markAsRead(
            @Param("id") Long id,
            @Param("donorId") Long donorId
    );

    @Modifying
    @Query("""
        UPDATE NotificationEntity n
        SET n.status = 'ACCEPTED'
        WHERE n.id = :id
        AND n.donor.id = :donorId
        """)
    int markAsAccepted(
            @Param("id") Long id,
            @Param("donorId") Long donorId
    );

    @Modifying
    @Query("""
        UPDATE NotificationEntity n
        SET n.status = 'DECLINED'
        WHERE n.id = :id
        AND n.donor.id = :donorId
        """)
    int markAsDeclined(
            @Param("id") Long id,
            @Param("donorId") Long donorId
    );
}
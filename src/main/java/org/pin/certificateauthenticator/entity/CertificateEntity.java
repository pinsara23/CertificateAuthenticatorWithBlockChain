package org.pin.certificateauthenticator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentFullName;
    private String studentId;
    private String nic;
    private String certificateSerialNumber;
    private String certificateUrl;
    private LocalDate issueDate;
    private String course;
    private String password;
}

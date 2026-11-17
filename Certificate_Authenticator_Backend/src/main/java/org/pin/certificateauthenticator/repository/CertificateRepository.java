package org.pin.certificateauthenticator.repository;

import org.pin.certificateauthenticator.entity.CertificateEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CertificateRepository extends JpaRepository<CertificateEntity, Long> {
    
    Optional<CertificateEntity> findByCertificateSerialNumber(String certificateSerialNumber);

    Optional<CertificateEntity> findByNic(String nic);
}

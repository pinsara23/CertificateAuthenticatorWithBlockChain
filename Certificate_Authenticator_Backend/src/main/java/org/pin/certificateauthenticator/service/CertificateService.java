package org.pin.certificateauthenticator.service;


import org.pin.certificateauthenticator.entity.CertificateEntity;
import org.pin.certificateauthenticator.repository.CertificateRepository;
import org.pin.certificateauthenticator.util.BlockChainUtil;
import org.pin.certificateauthenticator.util.FileStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

@Service
public class CertificateService {

    @Autowired
    private FileStorageUtil fileStorageUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private BlockChainUtil blockChainUtil;
    @Autowired
    private CertificateRepository certificateRepository;

    // save certificate details and issue on blockchain
    public String saveCertificate(CertificateEntity certificateEntity, MultipartFile file) {

        String fileName = fileStorageUtil.SaveFile(file);
        certificateEntity.setCertificateUrl(fileName);

        String password = String.valueOf((int)(Math.random()*10000)+203358);
        certificateEntity.setPassword(passwordEncoder.encode(password));

        certificateEntity.setIssueDate(LocalDate.now());

        certificateRepository.save(certificateEntity);

        String response = blockChainUtil.issueCertificateOnChain(certificateEntity.getCertificateSerialNumber(), certificateEntity.getNic());

        if (response.startsWith("0x")){
            return "Success, Your Password : "+password+" \n Hash : "+response;
        }else {
            return "Failed to issue certificate on blockchain: " + response;
        }


    }

    // verify certificate by serial number
    public Map<String , Object> verifyCertificate(String serialNumber){
        return blockChainUtil.verifyCertificateOnChain(serialNumber);
    }

    // get certificate file by serial number
    public ResponseEntity<Resource> downloadCertificate(String serialNumber, String password) {

        CertificateEntity certificateEntity = certificateRepository.findByCertificateSerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        if (!passwordEncoder.matches(password, certificateEntity.getPassword())) {
            return ResponseEntity.status(403).build();
        }

        Resource resource = fileStorageUtil.loadFileAsResource(certificateEntity.getCertificateUrl());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);

    }
}

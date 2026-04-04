package org.pin.certificateauthenticator.Conroller;

import org.pin.certificateauthenticator.entity.CertificateEntity;
import org.pin.certificateauthenticator.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/certificate")
public class CertificateController {

    @Autowired
    private  CertificateService certificateService;


    // /api/certificate/save
    @PostMapping("/save")
    public String saveCertificate(@RequestParam("file") MultipartFile file,
                                  @ModelAttribute CertificateEntity certificateEntity) {

        return certificateService.saveCertificate(certificateEntity, file);
    }

    // /api/certificate/verify?serialNumber=12345
    @GetMapping("/verify")
    public Map<String, Object> verifyCertificate(@RequestParam String serialNumber){
        return certificateService.verifyCertificate(serialNumber);
    }

    // /api/certificate/file?serialNumber=12345&password=abcd1234
    @PostMapping("/download")
    public ResponseEntity<Resource> getCertificateFile(@RequestParam String serialNumber, @RequestParam String password) throws IOException, IOException {
        return certificateService.downloadCertificate(serialNumber,password);
    }

}

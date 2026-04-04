package org.pin.certificateauthenticator.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageUtil {

    private final Path uploadLocation;

    public FileStorageUtil(@Value("${file.upload-dir}") String uploadDir){
        this.uploadLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.uploadLocation);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String SaveFile(MultipartFile file){

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path targetLocation = this.uploadLocation.resolve(fileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Resource loadFileAsResource(String fileName){
        try {
            Path filePath = this.uploadLocation.resolve(fileName).normalize();
            Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
            if(resource.exists()){
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

package com.abc.CertificateLogin.Controller;

import com.abc.CertificateLogin.Entity.Verifcode;
import com.abc.CertificateLogin.Entity.VerifcodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow all origins
public class AuthController {

    @Autowired
    private VerifcodeRepository verifcodeRepository;

    @PostMapping("/generate-code")
    public ResponseEntity<?> generateCode(@RequestBody Map<String, String> request) {
        String name = request.get("name"); // Extract name from JSON

        if (name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
        }

        Verifcode verifcode = new Verifcode(name);
        verifcodeRepository.save(verifcode);

        return ResponseEntity.ok(Map.of(
                "name", verifcode.getName(),
                "code", verifcode.getCode()
        ));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Verifcode verifcode) {
        Verifcode savedVerifcode = verifcodeRepository.findByNameAndCode(verifcode.getName(), verifcode.getCode());

        if (savedVerifcode == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid code"));
        }

        savedVerifcode.setVerified();
        verifcodeRepository.save(savedVerifcode);

        return ResponseEntity.ok(Map.of("message", "Code verified"));
    }

    @PostMapping("/is-verified")
    public ResponseEntity<?> isVerified(@RequestBody Map<String, String> request) {
        String name = request.get("name"); // Extract name from JSON

        if (name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
        }

        Verifcode savedVerifcode = verifcodeRepository.findByName(name);

        if (savedVerifcode == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid name"));
        }

        return ResponseEntity.ok(Map.of("verified", savedVerifcode.getVerified()));
    }
}

package com.abc.CertificateLogin.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.springframework.context.annotation.Primary;

import java.util.Random;

@Entity
public class Verifcode {
    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String code;

    private Boolean verified;

    public Verifcode() {
    }

    String sixDigitCode(){
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public Verifcode(String name){
        this.name = name;
        code = sixDigitCode();
        verified = false;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified() {
        this.verified = true;
    }
}

package com.abc.CertificateLogin.Entity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerifcodeRepository extends JpaRepository<Verifcode, Long> {
    Verifcode findByName(String name);
    Verifcode findByNameAndCode(String name, String code);
}

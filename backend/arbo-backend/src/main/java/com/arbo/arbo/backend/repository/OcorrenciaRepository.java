package com.arbo.arbo.backend.repository;

import com.arbo.arbo.backend.model.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
}

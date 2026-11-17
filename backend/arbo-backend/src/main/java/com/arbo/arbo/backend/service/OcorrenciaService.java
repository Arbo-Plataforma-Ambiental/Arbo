package com.arbo.arbo.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.arbo.arbo.backend.model.Ocorrencia;
import com.arbo.arbo.backend.repository.OcorrenciaRepository;

@Service
public class OcorrenciaService {
    private final OcorrenciaRepository ocorrenciaRepository;

    public OcorrenciaService(OcorrenciaRepository ocorrenciaRepository) {
        this.ocorrenciaRepository = ocorrenciaRepository;
    }

    public List<Ocorrencia> listarTodas() {
        return ocorrenciaRepository.findAll();
    }

    public Ocorrencia cadastrar(Ocorrencia ocorrencia) {
        if (ocorrencia.getDataRegistro() == null) {
            ocorrencia.setDataRegistro(LocalDateTime.now());
        }

        return ocorrenciaRepository.save(ocorrencia);
    }

    public Optional<Ocorrencia> buscarPorId(Long id) {
        return ocorrenciaRepository.findById(id);
    }

    public void excluir(Long id) {
        ocorrenciaRepository.deleteById(id);
    }

    public Ocorrencia atualizar(Long id, Ocorrencia dados) {
        Optional<Ocorrencia> encontrada = ocorrenciaRepository.findById(id);

        if (encontrada.isEmpty()) {
            return null;
        }

        Ocorrencia ocorrencia = encontrada.get();

        ocorrencia.setTitulo(dados.getTitulo());
        ocorrencia.setDescricao(dados.getDescricao());
        ocorrencia.setTipo(dados.getTipo());
        ocorrencia.setLatitude(dados.getLatitude());
        ocorrencia.setLongitude(dados.getLongitude());

        if (dados.getStatus() != null) {
            ocorrencia.setStatus(dados.getStatus());
        }
        if (dados.getImagem() != null) {
            ocorrencia.setImagem(dados.getImagem());
        }

        return ocorrenciaRepository.save(ocorrencia);
    }
}
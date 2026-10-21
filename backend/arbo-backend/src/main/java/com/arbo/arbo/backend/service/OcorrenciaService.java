package com.arbo.arbo.backend.service;

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
        return ocorrenciaRepository.save(ocorrencia);
    }

    public Optional<Ocorrencia> buscarPorId(Long id) {
        return ocorrenciaRepository.findById(id);
    }

    public void excluir(Long id) {
        ocorrenciaRepository.deleteById(id);
    }

    public Ocorrencia atualizar(Long id, Ocorrencia ocorrenciaAtualizada) {

        Optional<Ocorrencia> ocorrenciaEncontrada = ocorrenciaRepository.findById(id);

        if (ocorrenciaEncontrada.isEmpty()) {
            return null;
        }

        Ocorrencia ocorrencia = ocorrenciaEncontrada.get();

        ocorrencia.setTitulo(ocorrenciaAtualizada.getTitulo());
        ocorrencia.setDescricao(ocorrenciaAtualizada.getDescricao());
        ocorrencia.setTipo(ocorrenciaAtualizada.getTipo());
        ocorrencia.setLatitude(ocorrenciaAtualizada.getLatitude());
        ocorrencia.setLongitude(ocorrenciaAtualizada.getLongitude());
        ocorrencia.setStatus(ocorrenciaAtualizada.getStatus());

        return ocorrenciaRepository.save(ocorrencia);
    }

}

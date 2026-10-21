package com.feuji.adminservice.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.feuji.commonmodel.CreatePaper;

public interface CreatePaperRepository extends JpaRepository<CreatePaper, Long>
{
	public List<CreatePaper> findByStatus(String status);

}

package com.lifestyleservice.lifestyle.repository;

import com.lifestyleservice.lifestyle.entity.MembershipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface MembershipRepository extends JpaRepository<MembershipType, UUID> {
}

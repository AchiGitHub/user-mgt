package com.lifestyleservice.lifestyle.repository;

import com.lifestyleservice.lifestyle.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
    List<Member> findByIdIn(Collection<UUID> ids);

    @Query("SELECT mem FROM Member mem WHERE mem.id IN :ids")
    List<Member> findMembersByIds(@Param("ids") List<UUID> ids);

    @Query("SELECT mem FROM Member mem WHERE mem.id IN :ids AND (mem.firstName LIKE :name OR mem.lastName LIKE :name)")
    List<Member> findMembersById(@Param("ids") List<UUID> ids, @Param("name") String name);

}

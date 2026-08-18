package com.msmehub.msme_business_hub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name="users", uniqueConstraints=@UniqueConstraint(name="uk_users_email", columnNames="email"))
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(nullable=false) private String businessName;
    @NotBlank @Column(nullable=false) private String ownerName;
    @NotBlank @Email @Column(nullable=false, unique=true) private String email;
    @NotBlank @Column(nullable=false) private String phone;
    private String gstin;
    private String businessType;
    @JsonIgnore @Column(nullable=false) private String passwordHash;

    public User() {}
    public Long getId(){return id;} public String getBusinessName(){return businessName;} public String getOwnerName(){return ownerName;}
    public String getEmail(){return email;} public String getPhone(){return phone;} public String getGstin(){return gstin;} public String getBusinessType(){return businessType;} public String getPasswordHash(){return passwordHash;}
    public void setId(Long id){this.id=id;} public void setBusinessName(String v){businessName=v;} public void setOwnerName(String v){ownerName=v;}
    public void setEmail(String v){email=v;} public void setPhone(String v){phone=v;} public void setGstin(String v){gstin=v;} public void setBusinessType(String v){businessType=v;} public void setPasswordHash(String v){passwordHash=v;}
}

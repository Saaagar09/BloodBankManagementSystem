package com.example.bloodbankmanagementsystem.security;

import com.example.bloodbankmanagementsystem.entity.MyUser;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class MyUserDetails implements UserDetails {


    private final MyUser myUser;

    public MyUserDetails(MyUser myUser) {
        this.myUser = myUser;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + myUser.getRole().name())
        );
    }

    @Override
    public @Nullable String getPassword() {

        return myUser.getPassword();
    }

    @Override
    public String getUsername() {
        return myUser.getUsername();
    }
}
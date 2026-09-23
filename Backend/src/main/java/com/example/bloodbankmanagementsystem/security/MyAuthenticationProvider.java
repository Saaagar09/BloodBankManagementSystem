package com.example.bloodbankmanagementsystem.security;

import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

public class MyAuthenticationProvider implements AuthenticationProvider {

    private MyUserDetailsService myUserDetailsService;
    private PasswordEncoder passwordEncoder;

    public MyAuthenticationProvider(
            MyUserDetailsService myUserDetailsService,
            PasswordEncoder passwordEncoder) {

        this.myUserDetailsService = myUserDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {

        String username = authentication.getName();

        UserDetails userDetails =
                myUserDetailsService.loadUserByUsername(username);

        String password = authentication.getCredentials().toString();

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {

        return UsernamePasswordAuthenticationToken.class.equals(authentication);
    }
}

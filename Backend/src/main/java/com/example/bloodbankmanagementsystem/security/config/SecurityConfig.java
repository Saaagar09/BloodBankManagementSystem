package com.example.bloodbankmanagementsystem.security.config;

import com.example.bloodbankmanagementsystem.exception.security.CustomAccessDeniedHandler;
import com.example.bloodbankmanagementsystem.exception.security.CustomAuthenticationEntryPoint;
import com.example.bloodbankmanagementsystem.security.MyAuthenticationProvider;
import com.example.bloodbankmanagementsystem.security.MyUserDetailsService;
import com.example.bloodbankmanagementsystem.security.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomAuthenticationEntryPoint authenticationEntryPoint,
                          CustomAccessDeniedHandler accessDeniedHandler,
                          JwtAuthenticationFilter jwtAuthenticationFilter)
    {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors ->{})

                .authorizeHttpRequests(auth ->
                        auth
                                .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
                                .requestMatchers("/api/auth/register").permitAll()
                                .requestMatchers("/api/auth/login").permitAll()

                                // DONOR
                                .requestMatchers(HttpMethod.GET,"/api/bloodbank/Donor/me").hasRole("USER")

                                // NOTIFICATION
                                .requestMatchers(HttpMethod.GET, "/api/notifications/me").hasRole("USER")
                                .requestMatchers(HttpMethod.PATCH, "/api/notifications/*/read").hasRole("USER")
                                .requestMatchers(HttpMethod.PATCH, "/api/notifications/*/accept").hasRole("USER")
                                .requestMatchers(HttpMethod.PATCH, "/api/notifications/*/decline").hasRole("USER")

                                .requestMatchers(HttpMethod.GET, "/api/bloodbank/Donor").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/bloodbank/Donor/*").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/bloodbank/Donor").hasRole("USER")
                                .requestMatchers(HttpMethod.PATCH, "/api/bloodbank/Donor/me").hasRole("USER")
                                .requestMatchers(HttpMethod.DELETE, "/api/bloodbank/Donor/me").hasRole("USER")
                                .requestMatchers(HttpMethod.PATCH, "/api/bloodbank/Donor/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/bloodbank/Donor/**").hasRole("ADMIN")

                                // RECIPIENT
                                .requestMatchers(HttpMethod.POST, "/api/bloodbank/Recipient").hasRole("USER")

                                .requestMatchers(HttpMethod.GET, "/api/bloodbank/Recipient/me").hasRole("USER")
                                .requestMatchers(HttpMethod.GET, "/api/bloodbank/Recipient").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/bloodbank/Recipient/**").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.PATCH, "/api/bloodbank/Recipient/me/**").hasRole("USER")
                                .requestMatchers(HttpMethod.DELETE, "/api/bloodbank/Recipient/me/**").hasRole("USER")

                                .requestMatchers(HttpMethod.PATCH, "/api/bloodbank/Recipient/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/bloodbank/Recipient/**").hasRole("ADMIN")

                                .anyRequest().authenticated()
                )

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                //registerring jwtfilter

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        //basic auth disabled
        // .httpBasic(withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(MyUserDetailsService myUserDetailsService, PasswordEncoder passwordEncoder) {

        return new MyAuthenticationProvider(myUserDetailsService, passwordEncoder);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
}

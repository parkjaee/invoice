package com.aact.invoice.caps.dto;

public record ProcResult<T>(
        T data,
        String code,
        String message,
        boolean error
) {}

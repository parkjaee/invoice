package com.aact.invoice.caps.dto.request;

public record RequestMeta(
        String requestUserId,
        String requestIp,
        String programId,
        String progressGuid
) {}

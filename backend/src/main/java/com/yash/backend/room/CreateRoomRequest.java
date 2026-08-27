package com.yash.backend.room;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CreateRoomRequest(
		String name,
		@JsonProperty("isPublic") boolean isPublic,
		String language
) {
}

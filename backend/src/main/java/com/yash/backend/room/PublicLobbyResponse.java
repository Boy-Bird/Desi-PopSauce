package com.yash.backend.room;

import java.util.List;

public record PublicLobbyResponse(
		List<RoomResponse> rooms,
		long privateRoomCount
) {
}

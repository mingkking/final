package com.example.mgr.Service;

import java.util.List;

import com.example.mgr.domain.MgrChatVO;

public interface MgrChatService {
    long getRoomsCount();
    List<MgrChatVO> getAllRooms();
}

package com.example.mgr.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mgr.dao.MgrChatDAO;
import com.example.mgr.domain.MgrChatVO;

@Service
public class MgrChatServiceImpl implements MgrChatService {

    @Autowired
    private MgrChatDAO mgrchatDAO;

    @Override
    public long getRoomsCount() {
        return mgrchatDAO.countRooms();
    }
    
    @Override
    public List<MgrChatVO> getAllRooms() {
        return mgrchatDAO.findAllRooms();
    }
}
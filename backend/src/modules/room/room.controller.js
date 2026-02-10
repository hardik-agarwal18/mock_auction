import { createRoomService, joinRoomService } from "./room.service.js";

export const createRoom = async (req, res, next) => {
  try {
    const room = await createRoomService(req.user.id, req.body);

    res.status(201).json({
      success: true,
      room,
    });
  } catch (err) {
    next(err);
  }
};

export const joinRoom = async (req, res, next) => {
  try {
    const team = await joinRoomService(req.user.id, req.params.roomId);

    res.status(201).json({
      success: true,
      team,
    });
  } catch (err) {
    next(err);
  }
};

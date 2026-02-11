import { addPlayerService, getPlayersService } from "./player.service.js";

export const addPlayer = async (req, res, next) => {
  try {
    const player = await addPlayerService(
      req.user.id,
      req.params.roomId,
      req.body,
    );

    res.status(201).json({
      success: true,
      player,
    });
  } catch (err) {
    next(err);
  }
};

export const getPlayers = async (req, res, next) => {
  try {
    const players = await getPlayersService(req.params.roomId);

    res.json({
      success: true,
      players,
    });
  } catch (err) {
    next(err);
  }
};

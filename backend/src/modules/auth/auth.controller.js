import { registerUser } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

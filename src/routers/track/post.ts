import { Track } from "../../models/trackModel.js";

export const postTrack = async (req: any, res: any) => {
  try {
    const track = new Track(req.body);
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
};


// trackRouter.post("/tracks", async (req, res) => {
//   try {
//     const track = new Track(req.body);
//     await track.save();
//     return res.status(201).send(track);
//   } catch (error) {
//     return res.status(500).send(error);
//   }    
// });

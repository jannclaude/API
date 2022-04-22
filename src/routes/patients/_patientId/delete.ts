import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

// Delete a single patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.delete(endpoint, async (req, res) => {
    const result = await db
      .collection('patients')
      .deleteOne({ _id: new ObjectId(req.params.patientId) });

    res.sendStatus(result.acknowledged && result.deletedCount > 0 ? 200 : 400);
  });
}

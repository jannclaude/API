import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

// Delete a single medication of a patient
export default function (endpoint: string, router: Router, db: Db): Router {
  return router.delete(endpoint, async (req, res) => {
    const result = await db
      .collection('medications')
      .deleteOne({ _id: new ObjectId(req.params.medicationId) });

    res.sendStatus(result.acknowledged && result.deletedCount > 0 ? 200 : 400);
  });
}

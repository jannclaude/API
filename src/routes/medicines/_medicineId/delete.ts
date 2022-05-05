import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../../modules/db.js';

// Delete a single medicine
export default function (endpoint: string, router: Router): Router {
  return router.delete(endpoint, async (req, res) => {
    const medicineId = new ObjectId(req.params.medicineId);

    const result = await db.collection('medicines').deleteOne({ _id: medicineId });

    const medications = await db.collection('medications').find({ medicine: medicineId }).toArray();

    await db.collection('medications').deleteMany({
      medication: {
        $in: medications.map(e => e._id),
      },
    });

    await db.collection('schedules').deleteMany({
      medication: {
        $in: medications.map(e => e._id),
      },
    });

    res.sendStatus(result.acknowledged && result.deletedCount > 0 ? 200 : 400);
  });
}

import express from 'express';
import axios from 'axios';
import Docs from '../models/DocsModel';
import config from '../config/config';
import log from '../services/Logging';

const router = express.Router();

const NewCheck = (barcode, res) => {
  axios
    .get(`${config.lc_server}${barcode}`)
    .catch(error => {
      const errMsg = "Couldn't perform a request to the backend!";
      // log.error(errMsg);
      // log.error(error);
      console.log('error:');
      console.log(error);
      return res.status(400).send({ status: 'error', result: errMsg });
    })
    .then(response => {
      console.log('response data:');
      console.log(response.data);
      const last_answer = response.data;
      if (last_answer.result === 'fail' || last_answer.result === 'error') {
        return res.status(200).send({ status: 'fail', result: '' });
      }

      const newDoc = { barcode, checks: 1, last_answer: response.data };
      Docs.create(newDoc, (err, doc) => {
        if (err) {
          const errMsg = "Couldn't save/write the new Docs status in the DB";
          log.error(errMsg);
          log.error(err);
          return res.status(400).send({ status: 'error', result: errMsg });
        }
        console.log('doc:');
        console.log(doc);
        return res.status(200).send({ status: 'ok', result: doc });
      });
    });
};

router.get('/check', (req, res) => {
  log.info('GET check barcode');
  log.info(req.query);

  if (req.query === undefined) {
    const errMsg = "The query doesn't include barcode";
    log.error(errMsg);
    return res.status(400).send({ status: 'error', result: errMsg });
  }

  if (!req.query.barcode) {
    const errMsg = 'The barcode is empty in query parameters';
    log.error(errMsg);
    return res.status(400).send({ status: 'error', result: errMsg });
  }

  const { barcode } = req.query;
  Docs.findOne({ barcode }, (err, result) => {
    if (err) {
      const errMsg = "Couldn't execute the query of barcode in the DB";
      log.error(errMsg);
      log.error(err);
      return res.status(400).send({ status: 'error', result: errMsg });
    }

    if (result) {
      // docs was already check
      // update cheks count
      console.log('Doc already finded: ');
      console.log(result);

      Docs.update(
        { _id: result._id },
        { $set: { checks: result.checks + 1 } },
        (updatedErr, updatedResult) => {
          if (updatedErr) {
            const errMsg = "Couldn't update barcode status in the DB";
            log.error(errMsg);
            log.error(err);
            return res.status(400).send({ status: 'error', result: errMsg });
          }
          console.log('updatedResult: ');
          console.log(updatedResult);
          return res.status(200).send({ status: 'finded', result });
        }
      );
    } else {
      // it was new checks
      NewCheck(barcode, res);
    }
  });
});

export default router;

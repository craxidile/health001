const axios = require('axios/index');
const qs = require('querystring');

const express = require('express');
const router = express.Router();

/* GET home page. */
// router.get('/', (req, res) => {
//   res.render('index', { title: 'Express' });
// });

router.post('/result', async (req, res) => {
  const {
    bd,
    byce,
    bhr,
    bmn,
    name,
    gender,
    height,
    weight,
    age,
    bmi,
    dailyRoutines,
    rand
  } = req.body || {};
  console.log('>>body<<', req.body);
  console.log('>>req<<', qs.stringify({
    BD: bd,
    BYce: byce,
    Bhr: bhr,
    Bmn: bmn,
    range: 280,
    owner: name,
    isize: 300,
    radType: 'simplify',
    pregMn: 9,
    isMale: gender === 1,
    //designCal: $('#STEP2suggestion').attr('value'),
    Ht: height,
    Wt: weight,
    Age: age,
    BMI: bmi,
    Active: dailyRoutines,
    Language: 'Th',
    zodType: 'theory',
    SessionRand: rand,
  }));

  const response = await axios({
    method: 'POST',
    url: 'http://www.venitaclinic.com/CloudConsultant/BDSadv1.php',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      BD: bd,
      BYce: byce,
      Bhr: bhr,
      Bmn: bmn,
      range: 280,
      owner: name,
      isize: 300,
      radType: 'simplify',
      pregMn: 9,
      isMale: gender === 1,
      //designCal: $('#STEP2suggestion').attr('value'),
      Ht: height,
      Wt: weight,
      Age: age,
      BMI: bmi,
      Active: dailyRoutines,
      Language: 'Th',
      zodType: 'theory',
      SessionRand: rand,
    }),
  });

  const { status, data } = response;
  console.log(status);
  res.send(data);
})

module.exports = router;

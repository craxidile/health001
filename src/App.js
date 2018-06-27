import React, {Component} from 'react';
import {
  LocaleProvider,
  Alert,
  Row,
  Col,
  Layout,
  Input,
  InputNumber,
  Button,
  Form,
  DatePicker,
  TimePicker,
  Radio,
  Select,
  Checkbox,
  Modal
} from 'antd';
import thTH from 'antd/lib/locale-provider/th_TH';
import axios from 'axios';
import qs from 'querystring';
import moment from 'moment';
import 'moment/locale/th';

import './global.css';
import s from './App.css';

const {Header, Content} = Layout;
const {Item: FormItem} = Form;
const {Group: RadioGroup} = Radio;
const {Option} = Select;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      result: 'Please press Calculate',
      description: '',
      genderOptions: [
        {label: 'Male', value: 1},
        {label: 'Female', value: 2},
      ],
      dailyRoutines: [
        {label: 'ไม่ออกกำลังกาย งานนั่งกับโต๊ะ เดินทางนั่งรถเป็นหลัก', value: 1.2},
        {label: 'ยืนหรือเดินไปเดินมา เดินเรียนระหว่างตึก โหนรถเมล์ รถไฟฟ้า', value: 1.35},
        {label: 'ออกกำลังกายสัปดาห์ละ 1-2 ครั้ง ต้องการ build กล้าม', value: 1.75},
        {label: 'ทำงานแบกหาม นักกีฬาอาชีพ', value: 1.9},
      ],
      weight: {
        actual: 0,
        ideal: 0,
        adjusted: 0,
      },
      kcal: {
        actual: 0,
        ideal: 0,
        adjusted: 0,
      },
      activityFactor: 1,
      results: [],
      treatments: [],
      selectedWeight: 'actual',
      treatmentVisible: false,
    };
  }

  // componentDidMount() {
  //   this.mapResult({
  //     basic_info: {
  //       ABW: {kg: 69.5981875, kcal: 1794.035893125},
  //       IBW: {kg: 70.46425, kcal: 1802.6878575},
  //       Wt: {kg: "67", kcal: 1768.08},
  //       elemDesc: {
  //         "desc": "<h2>ธาตุเจ้าเรือนธาตุน้ำ  </h2><hr>Edematic Phenotype<br><hr><br><br>ข้อดี: ง่ายๆ สบายๆ อารมณ์ดี และดูอ่อนเยาว์กว่าคนวัยเดียวกัน (Baby face)<br><br>จิตใต้สำนึก (เด่นชัดช่วง 9-14 ปี): เฉื่อยแฉะ รักสบาย และชอบกินจุกกินจิก ง่วงเหงาหาวนอน และควบคุมความอยากของตัวเองไม่ค่อยได้<br><br>อุปนิสัยตอนโต (เด่นชัดราว 14-21 ปี) <character>ตรงไปตรงมา โผงผาง ชอบลุย และลงมือทำอย่างจริงจัง แต่อาจมีด้านด้อยคือเลือดร้อน ขี้โมโห และเจ้าคิดเจ้าแค้น</character><br>มักมีปัญหาสุขภาพกายดังต่อไปนี้คือ<br><br>",
  //         "zodAreaX": [{
  //           "txt": "ง่วงเหงาหาวนอน",
  //           "score": 3.5,
  //           "target": [{"index": 105, "patho": "mental", "rx": "looking for mental suggestion"}],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "หากความผิดปกติเป็นมากอาจมี Hydrocephalus หรือน้ำในโพรงสมอง",
  //           "score": 1,
  //           "target": [{"index": 76, "patho": "mental", "rx": "looking for mental suggestion"}],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "ความดันสูงเนื่องจากอาการบวมและน้ำคั่ง",
  //           "score": 2.5,
  //           "target": [{
  //             "index": 77,
  //             "patho": "arteriosclerosis",
  //             "rx": "looking for arteriosclerosis suggestion"
  //           }, {"index": 50, "patho": "edema", "rx": "looking for edema suggestion"}],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "ผิวพรรณเต่งตึง น้ำหนักตัวขึ้นง่าย สะสมไขมัน Cellulite ที่สะโพกและต้นขาได้ง่าย ลดน้ำหนักได้ง่ายแต่มี Yoyo effect ง่ายกว่าคนอื่น",
  //           "score": 2.5,
  //           "target": [{"index": 65, "patho": "anabolic", "rx": "looking for anabolic suggestion"}, {
  //             "index": 9,
  //             "patho": "anabolic",
  //             "rx": "looking for anabolic suggestion"
  //           }],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "หากปล่อยตัวไม่ดูและจะ อ้วน น้ำหนักเกิน บวม และเป็นโรคไต",
  //           "score": 3.5,
  //           "target": [{"index": 67, "patho": "anabolic", "rx": "looking for anabolic suggestion"}, {
  //             "index": 104,
  //             "patho": "anabolic",
  //             "rx": "looking for anabolic suggestion"
  //           }],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "มีความเสี่ยงต่อโรคเบาหวานได้ง่าย",
  //           "score": 3.5,
  //           "target": [{"index": 43, "patho": "DM", "rx": "looking for DM suggestion"}, {
  //             "index": 104,
  //             "patho": "anabolic",
  //             "rx": "looking for anabolic suggestion"
  //           }],
  //           "type": ["chkr"]
  //         }],
  //         "zodArea1": [{
  //           "txt": "ภูมิแพ้, เป็นหวัด คัดจมูกบ่อยๆ",
  //           "score": 2,
  //           "target": [{
  //             "index": 7,
  //             "patho": "autoimmune allergy",
  //             "rx": "looking for autoimmune allergy suggestion"
  //           }, {"index": 156, "patho": "infection", "rx": "looking for infection suggestion"}, {
  //             "index": 107,
  //             "patho": "anatomy nose",
  //             "rx": "looking for anatomy nose suggestion"
  //           }],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "หูชั้นกลางอักเสบ (Otitis media)",
  //           "score": 2,
  //           "target": [{
  //             "index": 7,
  //             "patho": "autoimmune allergy",
  //             "rx": "looking for autoimmune allergy suggestion"
  //           }, {"index": 156, "patho": "infection", "rx": "looking for infection suggestion"}, {
  //             "index": 114,
  //             "patho": "inflammation",
  //             "rx": "looking for inflammation suggestion"
  //           }, {"index": 44, "patho": "anatomy ear", "rx": "looking for anatomy ear suggestion"}],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "เยื่อบุตาอักเสบ (conjunctivitis), น้ำตาไหล ท่อน้ำตาอักเสบ",
  //           "score": 2,
  //           "target": [{
  //             "index": 7,
  //             "patho": "autoimmune allergy",
  //             "rx": "looking for autoimmune allergy suggestion"
  //           }, {"index": 45, "patho": "anatomy eye", "rx": "looking for anatomy eye suggestion"}],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "หากเป็นมากอาจมี โพรงไซนัสอักเสบเรื้อรัง มีอาการปวดโพรงไซนัส",
  //           "score": 3,
  //           "target": [{"index": 142, "patho": "infection", "rx": "looking for infection suggestion"}, {
  //             "index": 58,
  //             "patho": "anatomy face",
  //             "rx": "looking for anatomy face suggestion"
  //           }, {"index": 83, "patho": "inflammation", "rx": "looking for inflammation suggestion"}],
  //           "type": ["chkr"]
  //         }],
  //         "zodArea2": [{
  //           "txt": "เสมหะในลำคอ กระแอมกระไอ",
  //           "score": 3,
  //           "target": [{"index": 136, "patho": "sputum", "rx": "looking for sputum suggestion"}, {
  //             "index": 156,
  //             "patho": "infection",
  //             "rx": "looking for infection suggestion"
  //           }],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "อาจมีต่อมน้ำเหลืองที่คอบวมได้",
  //           "score": 3,
  //           "target": [{"index": 156, "patho": "infection", "rx": "looking for infection suggestion"}, {
  //             "index": 95,
  //             "patho": "anatomy L.N.",
  //             "rx": "looking for anatomy L.N. suggestion"
  //           }],
  //           "type": ["chkr", "edema"]
  //         }],
  //         "zodArea3": [{
  //           "txt": "หัวไหล่ แขน มือ บวม ตึง, Bursitis",
  //           "score": 3.5,
  //           "target": [{
  //             "index": 133,
  //             "patho": "anatomy shoulder stiff",
  //             "rx": "looking for anatomy shoulder stiff suggestion"
  //           }, null, {
  //             "index": 150,
  //             "patho": "anatomy tendon stiff",
  //             "rx": "looking for anatomy tendon stiff suggestion"
  //           }, {"index": 56, "patho": "fibrosis", "rx": "looking for fibrosis suggestion"}],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "Lymphadema หรืออาการบวมเนื่องจากน้ำเหลืองอุดกั้น",
  //           "score": 3.5,
  //           "target": [{
  //             "index": 93,
  //             "patho": "obstruction L.N.",
  //             "rx": "looking for obstruction L.N. suggestion"
  //           }, {"index": 50, "patho": "edema", "rx": "looking for edema suggestion"}, {
  //             "index": 95,
  //             "patho": "anatomy L.N.",
  //             "rx": "looking for anatomy L.N. suggestion"
  //           }],
  //           "type": ["chkr"]
  //         }, {
  //           "txt": "ใจสั่น หัวใจเต้นผิดจังหวะ เต้นช้า หรือเร็วเกินไป",
  //           "score": 1.5,
  //           "target": [{"index": 15, "patho": "conductivity heart", "rx": "looking for conductivity heart suggestion"}],
  //           "type": ["ill"]
  //         }],
  //         "zodArea4": [{
  //           "txt": "หลอดลมอักเสบ ปอดอักเสบ ปอดบวม",
  //           "score": 2.5,
  //           "target": [{
  //             "index": 12,
  //             "patho": "autoimmune asthma",
  //             "rx": "looking for autoimmune asthma suggestion"
  //           }, {"index": 119, "patho": "inflammation", "rx": "looking for inflammation suggestion"}, {
  //             "index": 120,
  //             "patho": "infection",
  //             "rx": "looking for infection suggestion"
  //           }],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "เต้านมเด่นในเพศชาย (Gynecomastia)",
  //           "score": 2.5,
  //           "target": [{
  //             "index": 64,
  //             "patho": "hormone imbalance",
  //             "rx": "looking for hormone imbalance suggestion"
  //           }, {"index": 53, "patho": "female hormone", "rx": "looking for female hormone suggestion"}, {
  //             "index": 52,
  //             "patho": "sex",
  //             "rx": "looking for sex suggestion"
  //           }],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "อ่อนเพลีย ไม่มีแรง จากภาวะพร่องฮอร์โมนเพศชาย",
  //           "score": 3.5,
  //           "target": [{
  //             "index": 64,
  //             "patho": "hormone imbalance",
  //             "rx": "looking for hormone imbalance suggestion"
  //           }, {"index": 14, "patho": "andropause", "rx": "looking for andropause suggestion"}, {
  //             "index": 52,
  //             "patho": "sex",
  //             "rx": "looking for sex suggestion"
  //           }],
  //           "type": ["chkr", "ill"]
  //         }, {
  //           "txt": "Cardiac arythmia, หลอดลมตีบ, หอบหืด",
  //           "score": 2,
  //           "target": [{
  //             "index": 15,
  //             "patho": "conductivity heart",
  //             "rx": "looking for conductivity heart suggestion"
  //           }, {
  //             "index": 24,
  //             "patho": "anatomy bronchus",
  //             "rx": "looking for anatomy bronchus suggestion"
  //           }, {"index": 12, "patho": "autoimmune asthma", "rx": "looking for autoimmune asthma suggestion"}],
  //           "type": ["chkr"]
  //         }],
  //         "zodArea5": [{
  //           "txt": "หัวใจโต (Congestive heart failure), หัวใจล้มเหลว, นอนราบไม่ได้ อาจมีขาบวม",
  //           "score": 3,
  //           "target": [{
  //             "index": 68,
  //             "patho": "anatomy heart",
  //             "rx": "looking for anatomy heart suggestion"
  //           }, {"index": 33, "patho": "CHF", "rx": "looking for CHF suggestion"}, {
  //             "index": 77,
  //             "patho": "arteriosclerosis",
  //             "rx": "looking for arteriosclerosis suggestion"
  //           }],
  //           "type": ["chkr"]
  //         }],
  //         "zodArea6": [{
  //           "txt": "Candida overgrowth, ถ่ายเป็นมูก ลำไส้อักเสบและอาจนำไปสู่ภาวะ Leaky gut",
  //           "score": 2,
  //           "target": [{
  //             "index": 134,
  //             "patho": "anatomy small bowel",
  //             "rx": "looking for anatomy small bowel suggestion"
  //           }, {
  //             "index": 91,
  //             "patho": "inflammation bowel",
  //             "rx": "looking for inflammation bowel suggestion"
  //           }, {"index": 59, "patho": "microbiome", "rx": "looking for microbiome suggestion"}, null],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "หากไม่ดูแล อาจมี Celiac Syndrome",
  //           "score": 3,
  //           "target": [{"index": 31, "patho": "microbiome", "rx": "looking for microbiome suggestion"}, {
  //             "index": 134,
  //             "patho": "anatomy small bowel",
  //             "rx": "looking for anatomy small bowel suggestion"
  //           }],
  //           "type": ["chkr", "edema"]
  //         }],
  //         "zodArea7": [{
  //           "txt": "ถ่ายท้องและท้องเสียได้ง่าย",
  //           "score": 2.5,
  //           "target": [{
  //             "index": 91,
  //             "patho": "inflammation bowel",
  //             "rx": "looking for inflammation bowel suggestion"
  //           }, {"index": 97, "patho": "anatomy large bowel", "rx": "looking for anatomy large bowel suggestion"}],
  //           "type": ["vf"]
  //         }, {
  //           "txt": "อาการบวมน้ำที่เกี่ยวเนื่องกับโรคไต",
  //           "score": 2.5,
  //           "target": [{"index": 108, "patho": "edema", "rx": "looking for edema suggestion"}, {
  //             "index": 50,
  //             "patho": "edema",
  //             "rx": "looking for edema suggestion"
  //           }],
  //           "type": ["chkr"]
  //         }],
  //         "zodArea8": [{
  //           "txt": "อาจมีอาการบวมได้ง่าย และไตอ่อนแอกว่าค่าเฉลี่ยคนทั่วไป",
  //           "score": 2.5,
  //           "target": [{"index": 50, "patho": "edema", "rx": "looking for edema suggestion"}, {
  //             "index": 132,
  //             "patho": "renal insufficiency",
  //             "rx": "looking for renal insufficiency suggestion"
  //           }],
  //           "type": ["chkr", "ill"]
  //         }, {
  //           "txt": "ปวดเบ่งเหมือนถ่ายไม่สุด (Tinesmus), ผายลมมาก",
  //           "score": 1.5,
  //           "target": [{
  //             "index": 28,
  //             "patho": "anatomy colon",
  //             "rx": "looking for anatomy colon suggestion"
  //           }, {"index": 128, "patho": "anatomy rectum", "rx": "looking for anatomy rectum suggestion"}, {
  //             "index": 34,
  //             "patho": "constipation",
  //             "rx": "looking for constipation suggestion"
  //           }, {"index": 72, "patho": "varicose", "rx": "looking for varicose suggestion"}],
  //           "type": ["ill"]
  //         }],
  //         "zodArea9": [{
  //           "txt": "ปวดบวม ตึงเส้นหน้าขา และเส้นปัสสาวะ ทำให้ปวดปัสสาวะบ่อย",
  //           "score": 3.5,
  //           "target": [{
  //             "index": 127,
  //             "patho": "anatomy quadriceps",
  //             "rx": "looking for anatomy quadriceps suggestion"
  //           }, {"index": 50, "patho": "edema", "rx": "looking for edema suggestion"}, {
  //             "index": 98,
  //             "patho": "anatomy muscle stiff",
  //             "rx": "looking for anatomy muscle stiff suggestion"
  //           }, {"index": 124, "patho": "urine", "rx": "looking for urine suggestion"}],
  //           "type": ["chkr", "ill"]
  //         }, {"txt": "", "score": 2, "target": "uninterpreted me", "type": ["chkr", "edema"]}],
  //         "zodArea10": [{
  //           "txt": "เข่าบวมน้ำ ตึง งอพับคู้ขาไม่สะดวก",
  //           "score": 3,
  //           "target": [{
  //             "index": 88,
  //             "patho": "anatomy knee",
  //             "rx": "looking for anatomy knee suggestion"
  //           }, {"index": 50, "patho": "edema", "rx": "looking for edema suggestion"}, {
  //             "index": 83,
  //             "patho": "inflammation",
  //             "rx": "looking for inflammation suggestion"
  //           }, {"index": 111, "patho": "arthritis", "rx": "looking for arthritis suggestion"}, {
  //             "index": 10,
  //             "patho": "arthritis",
  //             "rx": "looking for arthritis suggestion"
  //           }],
  //           "type": ["chkr"]
  //         }],
  //         "zodArea11": [{
  //           "txt": "บวมตึงจากการไหลเวียนน้ำเหลืองไม่ดี เวลาโดนยุงกัด อาจมีจ้ำๆ ตามผิว ที่เรียกว่า น้ำเหลืองไม่ดี",
  //           "score": 3,
  //           "target": [{
  //             "index": 95,
  //             "patho": "anatomy L.N.",
  //             "rx": "looking for anatomy L.N. suggestion"
  //           }, {"index": 50, "patho": "edema", "rx": "looking for edema suggestion"}, {
  //             "index": 110,
  //             "patho": "obstruction",
  //             "rx": "looking for obstruction suggestion"
  //           }, {"index": 130, "patho": "inflammation", "rx": "looking for inflammation suggestion"}, {
  //             "index": 158,
  //             "patho": "inflammation",
  //             "rx": "looking for inflammation suggestion"
  //           }],
  //           "type": ["chkr", "edema"]
  //         }],
  //         "zodArea12": [{
  //           "txt": "บวมตึงที่ข้อเท้า ข้อเท้าบวมง่ายเวลานั่งห้อยเท้านานๆ",
  //           "score": 2,
  //           "target": [{
  //             "index": 6,
  //             "patho": "anatomy ankle",
  //             "rx": "looking for anatomy ankle suggestion"
  //           }, {"index": 50, "patho": "edema", "rx": "looking for edema suggestion"}, {
  //             "index": 110,
  //             "patho": "obstruction",
  //             "rx": "looking for obstruction suggestion"
  //           }],
  //           "type": ["chkr", "edema"]
  //         }]
  //       }
  //     }
  //   });
  // }

  onSubmit(event) {
    event.preventDefault();
    const {form} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.submitData(values || {});
      }
    });
  }

  async submitData(values) {
    const {
      name,
      birthDate,
      birthTime,
      weight,
      height,
      dailyRoutines,
      gender
    } = values;

    const bd = birthDate.format('DD-MM-YYYY');
    const bhr = +birthTime.format('H');
    const bmn = +birthTime.format('m');
    const byce = +birthDate.format('YYYY');
    const rand = Math.floor(1000000000 * Math.random());
    const bmi = weight / height / height;
    const age = moment().diff(birthDate, 'years');
    const mode = process.env.NODE_ENV || 'development';
    //const calories = dailyRoutines * parseFloat($('#rawBMR').text());

    console.log(bd, bhr, bmn, rand, bmi, age);

    this.setState({
      bmi,
      weight: {
        actual: weight,
        ideal: this.state.ideal,
        adjusted: this.state.adjusted,
      },
      activityFactor: dailyRoutines,
      treatments: [],
      selectedWeight: 'actual',
      treatmentVisible: false,
    });

    const response = await axios({
      method: 'POST',
      url: mode === 'development' ? 'http://localhost:5000/result' : '/result',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
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
        rand,
      }),
    });

    const {data} = response;
    console.log('>>data<<', data);
    this.mapResult(data);
  }

  mapResult(data) {
    const {basic_info: basicInfo} = data || {};
    const {elemDesc: zodEffect} = basicInfo || {};
    const {desc: description} = zodEffect || {};
    console.log('>>zod_effect<<', zodEffect);
    const zodKeys = Object.keys(zodEffect || []);
    const results = zodKeys.reduce((current, zodKey) => {
      const details = zodEffect[zodKey];
      const detailKeys = Object.keys(details);
      return [...current, ...detailKeys.reduce((current, detailKey) => {
        const detail = details[detailKey] || {};
        return detail
          ? [...current, detail]
          : current;
      }, []).filter(detail => detail && detail.txt && detail.txt.trim())];
    }, []);
    results.sort((a, b) => b.score - a.score);
    const minScore = [...results].pop().score;
    const maxScore = [...results].shift().score;
    console.log('>>score<<', minScore, maxScore);

    const {
      Wt: {kg: wtKg, kcal: wtKcal},
      IBW: {kg: ibwKg, kcal: ibwKcal},
      ABW: {kg: abwKg, kcal: abwKcal},
    } = basicInfo;

    this.setState({
      results,
      description,
      weight: {
        actual: wtKg,
        ideal: ibwKg,
        adjusted: abwKg,
      },
      kcal: {
        actual: wtKcal,
        ideal: ibwKcal,
        adjusted: abwKcal,
      }
    });
  }

  async onTargetChange(target) {
    const mode = process.env.NODE_ENV || 'development';
    console.log(target);
    const response = await axios({
      method: 'POST',
      url: mode === 'development' ? 'http://localhost:5000/rx' : '/rx',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({target: target}),
    });
    const {data: rx} = response;
    console.log('>>rx<<', rx);
    this.setState({
      treatments: (this.state.treatments || []).concat(Object.values(rx)),
    });
  }

  render() {
    const {
      results,
      genderOptions,
      dailyRoutines,
      description,
      weight,
      kcal,
      activityFactor,
      selectedWeight,
      treatments
    } = this.state || {};

    const {
      form
    } = this.props;

    const {
      getFieldDecorator,
    } = form;

    return (
      <LocaleProvider locale={thTH}>
        <Layout className={s.container}>
          <Header>
            <div className={s.content}>
              <h1 className="header">Health 001</h1>
            </div>
          </Header>
          <Content className={s.content}>
            <Row className={s.section} type="flex" justify="center" gutter={32}>
              <Col span={9}>
                <Form className={s.loginForm} layout="vertical" onSubmit={event => this.onSubmit(event)}>
                  <FormItem label="Full name">
                    {
                      getFieldDecorator('name', {
                        rules: [
                          {required: true, message: 'Full name is required.'}
                        ]
                      })(
                        <Input placeholder="Full name"/>
                      )
                    }
                  </FormItem>
                  <FormItem label="Birth date">
                    {
                      getFieldDecorator('birthDate', {
                        rules: [
                          {required: true, message: 'Birth date is required.'}
                        ]
                      })(
                        <DatePicker className={s.fullWidth} placeholder="Birth date"/>
                      )
                    }
                  </FormItem>
                  <FormItem label="Birth time">
                    {
                      getFieldDecorator('birthTime', {
                        rules: [
                          {required: true, message: 'Birth time is required.'}
                        ]
                      })(
                        <TimePicker
                          className={s.fullWidth}
                          placeholder="Birth time"
                          minuteStep={15}
                          secondStep={60}
                        />
                      )
                    }
                  </FormItem>
                  <FormItem label="Gender">
                    {
                      getFieldDecorator('gender', {
                        rules: [
                          {required: true, message: 'Gender is required.'}
                        ]
                      })(
                        <RadioGroup options={genderOptions}/>)
                    }
                  </FormItem>
                  <FormItem label="Weight">
                    {
                      getFieldDecorator('weight', {
                        rules: [
                          {required: true, message: 'Weight is required.'}
                        ]
                      })(
                        <InputNumber className={s.fullWidth} placeholder="Weight"
                                     min={1} max={1000}/>
                      )
                    }
                  </FormItem>
                  <FormItem label="Height">
                    {
                      getFieldDecorator('height', {
                        rules: [
                          {required: true, message: 'Height is required.'}
                        ]
                      })(
                        <InputNumber className={s.fullWidth} placeholder="Height"
                                     min={1} max={400}/>
                      )
                    }
                  </FormItem>
                  <FormItem label="Daily routines">
                    {
                      getFieldDecorator('dailyRoutines', {
                        rules: [
                          {required: true, message: 'Daily routines are required.'}
                        ]
                      })(
                        <Select placeholder="Daily routines">
                          {
                            dailyRoutines.map(dailyRoutine => {
                              const {label, value} = dailyRoutine || {};
                              return (
                                <Option key={label} value={value}>
                                  {dailyRoutine.label}
                                </Option>
                              )
                            })
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                  <FormItem>
                    <Button className={s.fullWidth} type="primary" htmlType="submit">
                      Calculate
                    </Button>
                  </FormItem>
                </Form>
              </Col>
              <Col span={15}>
                {
                  description ? (
                    <Row className={s.resultRow} type="flex" justify="start" gutter={8}>
                      <Col span={24}>
                        <Alert type="success" description={(
                          <div>
                            <h3>ค่าพลังงานที่ต้องการในแต่ละวัน คำนวณด้วย น.น.</h3>
                            <Select placeholder="Energy needed a day" defaultValue="actual"
                                    style={{width: '100%'}}
                                    onSelect={value => this.setState({selectedWeight: value})}>
                              <Option key={0} value="actual">
                                Actual body weight = {weight.actual} kg
                              </Option>
                              <Option key={1} value="ideal">
                                Ideal body weight = {weight.ideal} kg
                              </Option>
                              <Option key={2} value="adjusted">
                                Adjusted body weight = {weight.adjusted} kg
                              </Option>
                            </Select>
                            <div style={{marginTop: '20px', marginBottom: '10px'}}>
                              <h3>ค่าพลังงานขั้นต่ำ Basal Metabolic Rate</h3>
                              <div>{kcal[selectedWeight]} kCal/day</div>
                            </div>
                            <div style={{marginTop: '20px', marginBottom: '10px'}}>
                              <h3>Daily calories required</h3>
                              <div>{kcal[selectedWeight] * activityFactor} kCal</div>
                            </div>
                            <div style={{marginTop: '20px', marginBottom: '10px'}}>
                              เมื่อคำนึงถึงรูปร่าง น้ำหนัก ส่วนสูง และเพศแล้ว ปริมาณพลังงานที่ต้องการใน 1 วัน
                              ของท่านคือ {kcal[selectedWeight] * activityFactor} kcal/day
                              แต่ท่านต้องการกินเพื่อลดน้ำหนักลง ซึ่งตามหลักโภชนาการที่ดีแล้ว
                              การลดน้ำหนักตัวโดยประมาณ 500g/สัปดาห์ จะเป็นการลดน้ำหนักที่ไม่ทรมานเกินไป
                              และให้ผลยั่งยืนกว่าการลดมากๆ ในทีเดียว
                              เพื่อบรรลุผลดังกล่าว แพทย์ของเราแนะนำให้ ลด Calories ที่กินลงอีก 500 kcal/day
                              ดังนั้น ตามแผนลดน้ำหนัก อาหารที่ท่านกินได้ภายใน 1
                              วันจึงจำกัดไม่เกิน {kcal[selectedWeight] * activityFactor - 500} kcal/day
                            </div>
                          </div>
                        )}/>
                      </Col>
                    </Row>
                  ) : null
                }
                {
                  description ? (
                    <Row className={s.resultRow} type="flex" justify="start" gutter={8}>
                      <Col span={24}>
                        <Alert type="success" description={(
                          <div>
                            <h3>คำอธิบาย</h3>
                            <span dangerouslySetInnerHTML={{__html: description}}/>
                          </div>
                        )}/>
                      </Col>
                    </Row>
                  ) : null
                }
                {description ? (
                  <Row className={s.resultRow} type="flex" justify="start" gutter={8}>
                    <Col span={24}>
                      {
                        <Alert description={results.map(result => (
                          <Row className={s.resultRow} type="flex" justify="start">
                            <Col span={24}>
                              <Checkbox key={result.txt} onChange={() => this.onTargetChange(result.target)}>
                              <span style={{
                                fontSize: `${12 + 3 * result.score}px`,
                                lineHeight: `${16 + 3 * result.score}px`
                              }}>
                                {result.txt}
                              </span>
                              </Checkbox>
                            </Col>
                          </Row>
                        ))} type="info"/>
                      }
                    </Col>
                  </Row>
                ) : null}
                {description ? (
                  <Row gutter={8}>
                    <Col>
                      <Button type="primary" style={{width: '100%'}}
                              onClick={() => this.setState({treatmentVisible: true})}>
                        Treatment summary
                      </Button>
                    </Col>
                  </Row>
                ) : null}
              </Col>
            </Row>
            <Modal
              title="Treatment Summary"
              visible={this.state.treatmentVisible}
              onOk={() => this.setState({treatmentVisible: false})}
              onCancel={() => this.setState({treatmentVisible: false})}
            >
              {
                treatments
                  .filter(treatment => {
                    return !!treatment.txt;
                  })
                  .reduce((current, treatment) => {
                    if (current.filter(t => t.index === treatment.index).length > 0)
                      return current;
                    return [...current, treatment];
                  }, [])
                  .map(treatment => (
                    <Row>
                      <Col>
                        <Checkbox key={treatment.index}>
                          {treatment.txt}
                        </Checkbox>
                      </Col>
                    </Row>
                  ))
              }
            </Modal>
          </Content>
        </Layout>
      </LocaleProvider>
    );
  }
}

export default Form.create()(App);

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
      results: [],
    };
  }

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
    //const calories = dailyRoutines * parseFloat($('#rawBMR').text());

    console.log(bd, bhr, bmn, rand, bmi, age);

    const response = await axios({
      method: 'POST',
      url: 'http://localhost:5000/result',
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
    const {zodEffect} = data || {};
    const zodKeys = Object.keys(zodEffect || []);
    const results = zodKeys.reduce((current, zodKey) => {
      const details = zodEffect[zodKey];
      const detailKeys = Object.keys(details);
      return [...current, ...detailKeys.reduce((current, detailKey) => {
        const detail = details[detailKey] || {};
        return detail.patho
          ? [...current, detail.patho]
          : current;
      }, []).filter(detail => detail && detail.txt && detail.txt.trim())];
    }, []);
    results.sort((a, b) => b.score - a.score);
    this.setState({results});
  }

  render() {
    const {
      results,
      genderOptions,
      dailyRoutines,
    } = this.state || {};

    const {
      form
    } = this.props;

    const {
      getFieldDecorator,
    } = form;

    const ALERT_TYPES = {
      '0.5': 'success',
      '1': 'warning',
      '1.5': 'error'
    };

    const FONT_SIZES = {
      '0.5': '14px',
      '1': '16px',
      '1.5': '20px'
    };

    const LINE_HEIGHTS = {
      '0.5': '22px',
      '1': '24px',
      '1.5': '28px'
    };

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
                  results.map(result => (
                    <Row className={s.resultRow} type="flex" justify="start" gutter={8}>
                      <Col span={24}>
                        <Alert
                          description={(<div style={{fontSize:`${FONT_SIZES[result.score]}`,lineHeight:`${LINE_HEIGHTS[result.score]}`}}>{result.txt}</div>)}
                          type={ALERT_TYPES[`${result.score}`]}
                        />
                      </Col>
                    </Row>
                  ))
                }
              </Col>
            </Row>
          </Content>
        </Layout>
      </LocaleProvider>
    );
  }
}

export default Form.create()(App);
